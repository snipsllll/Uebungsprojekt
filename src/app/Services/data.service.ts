import { Injectable, signal } from '@angular/core';
import { TaskZustand } from '../Models/Enums/TaskZustand';
import { ITask } from '../Models/Interfaces/ITask';
import { IAnforderung, IAnforderungData } from '../Models/Interfaces/IAnforderung';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  anforderungen: IAnforderung[] = [];
  updated = signal<number>(0);
  completedLoading = signal<boolean>(false);

  constructor(private fireService: FireService) {
    this.loadData();
  }

  /**
   * 🔥 Lädt die neuesten Daten vom Server
   */
  private async loadData() {
    const serverData = await this.fireService.getDataFromServer();

    // Tasks auf Standardwerte setzen (kein Edit-Modus)
    serverData.forEach(anforderung => {
      anforderung.data.tasks.forEach(task => {
        task.data.isTitleInEditMode = false;
      });
    });

    this.anforderungen = serverData;
    this.completedLoading.set(true);
    this.sendUpdate();
  }

  /**
   * 🔥 Fügt eine neue Anforderung hinzu und synchronisiert mit dem Server
   */
  async addAnforderung(anforderungData: IAnforderungData) {
    await this.loadData();

    let newAnforderung: IAnforderung = {
      id: this.getNextFreeAnforderungId(),
      data: anforderungData
    };

    this.anforderungen.push(newAnforderung);
    await this.saveToServer();
  }

  /**
   * 🔥 Bearbeitet eine bestehende Anforderung mit Merging
   */
  async editAnforderung(anforderung: IAnforderung) {
    await this.loadData();

    const index = this.anforderungen.findIndex(x => x.id === anforderung.id);
    if (index !== -1) {
      this.anforderungen[index] = {
        ...this.anforderungen[index],
        data: { ...this.anforderungen[index].data, ...anforderung.data }
      };
      await this.saveToServer();
    }
  }

  /**
   * 🔥 Löscht eine Anforderung
   */
  async deleteAnforderungById(id: number) {
    await this.loadData();
    this.anforderungen = this.anforderungen.filter(a => a.id !== id);
    await this.saveToServer();
  }

  /**
   * 🔥 Fügt eine neue Aufgabe zu einer Anforderung hinzu
   */
  async addEmptyTaskToAnforderungByAnforderungId(anforderungId: number) {
    await this.loadData();

    let newTask: ITask = {
      id: this.getNextFreeTaskId(),
      data: {
        title: "",
        mitarbeiter: "",
        zustand: TaskZustand.todo,
        isTitleInEditMode: true
      }
    };

    const anforderung = this.anforderungen.find(x => x.id === anforderungId);
    if (anforderung) {
      anforderung.data.tasks.push(newTask);
      await this.saveToServer();
    }
  }

  /**
   * 🔥 Bearbeitet eine Aufgabe mit Konfliktmanagement
   */
  async editTask(editedTask: ITask) {
    await this.loadData(); // Neueste Daten holen

    let updated = false;

    this.anforderungen.forEach(anforderung => {
      const taskIndex = anforderung.data.tasks.findIndex(task => task.id === editedTask.id);
      if (taskIndex !== -1) {
        anforderung.data.tasks[taskIndex] = {
          ...anforderung.data.tasks[taskIndex],
          data: { ...anforderung.data.tasks[taskIndex].data, ...editedTask.data }
        };
        updated = true;
      }
    });

    if (updated) await this.saveToServer();
  }

  /**
   * 🔥 Löscht eine Aufgabe ohne Datenverlust
   */
  async deleteTask(taskId: number) {
    await this.loadData();

    this.anforderungen.forEach(anforderung => {
      anforderung.data.tasks = anforderung.data.tasks.filter(task => task.id !== taskId);
    });

    await this.saveToServer();
  }

  /**
   * 🔥 Speichert Daten auf dem Server (merged bestehende Daten)
   */
  private async saveToServer() {
    const serverData = await this.fireService.getDataFromServer();
    const mergedData = this.mergeData(serverData, this.anforderungen);
    await this.fireService.saveDataOnServer(mergedData);
    this.sendUpdate();
  }

  /**
   * 🔥 Merged Server- und lokale Daten (stellt sicher, dass keine Änderungen verloren gehen)
   */
  private mergeData(serverData: IAnforderung[], localData: IAnforderung[]): IAnforderung[] {
    const mergedData = [...serverData];

    localData.forEach(localAnforderung => {
      const existingAnforderung = mergedData.find(a => a.id === localAnforderung.id);
      if (existingAnforderung) {
        // Mergen der Felder und Tasks
        existingAnforderung.data = {
          ...existingAnforderung.data,
          ...localAnforderung.data,
          tasks: this.mergeTasks(existingAnforderung.data.tasks, localAnforderung.data.tasks)
        };
      } else {
        mergedData.push(localAnforderung);
      }
    });

    return mergedData;
  }

  /**
   * 🔥 Merged die Tasks einer Anforderung (verhindert Überschreiben)
   */
  private mergeTasks(serverTasks: ITask[], localTasks: ITask[]): ITask[] {
    const mergedTasks = [...serverTasks];

    localTasks.forEach(localTask => {
      const existingTask = mergedTasks.find(t => t.id === localTask.id);
      if (existingTask) {
        existingTask.data = {
          ...existingTask.data,
          ...localTask.data
        };
      } else {
        mergedTasks.push(localTask);
      }
    });

    return mergedTasks;
  }

  /**
   * 🔥 Holt die nächste freie Anforderungs-ID
   */
  private getNextFreeAnforderungId(): number {
    if (this.anforderungen.length === 0) return 1;
    return Math.max(...this.anforderungen.map(a => a.id), 0) + 1;
  }

  /**
   * 🔥 Holt die nächste freie Task-ID
   */
  private getNextFreeTaskId(): number {
    let tasks = this.anforderungen.flatMap(a => a.data.tasks);
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.id), 0) + 1;
  }

  /**
   * 🔥 Sendet ein Update-Signal für die UI
   */
  private sendUpdate() {
    this.updated.set(this.updated() + 1);
  }
}
