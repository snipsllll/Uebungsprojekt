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

  constructor(private fireService: FireService) {
    this.fireService.getDataFromServer().then(data => {
      this.anforderungen = data;
      this.sendUpdate();
    });
  }

  addAnforderung(anforderungData: IAnforderungData) {
    let newAnforderung: IAnforderung = {
      id: this.getNextFreeAnforderungId(),
      data: anforderungData
    };

    this.anforderungen.push(newAnforderung);
    this.save(true);
  }

  editAnforderung(anforderung: IAnforderung) {
    const index = this.anforderungen.findIndex(x => x.id === anforderung.id);
    if (index !== -1) {
      this.anforderungen[index] = anforderung;
      this.save(true);
    }
  }

  deleteAnforderungById(id: number) {
    const index = this.anforderungen.findIndex(x => x.id === id);
    if (index !== -1) {
      this.anforderungen.splice(index, 1);
      this.save(true);
    }
  }

  addEmptyTaskToAnforderungByAnforderungId(anforderungId: number) {
    let newTask: ITask = {
      id: this.getNextFreeTaskId(),
      data: {
        title: "",
        mitarbeiter: "",
        zustand: TaskZustand.todo
      }
    };

    const anforderung = this.anforderungen.find(x => x.id === anforderungId);
    if (anforderung) {
      anforderung.data.tasks.push(newTask);
      this.save(true);
    }
  }

  editTask(editedTask: ITask) {
    let found = false;

    this.anforderungen.forEach(anforderung => {
      anforderung.data.tasks.forEach((task, index) => {
        if (task.id === editedTask.id && !found) {
          found = true;

          let anforderungIndex = this.anforderungen.findIndex(x => x.id === anforderung.id);
          let taskIndex = this.anforderungen[anforderungIndex]?.data.tasks.findIndex(x => x.id === editedTask.id);

          if (anforderungIndex !== -1 && taskIndex !== -1) {
            this.anforderungen[anforderungIndex].data.tasks[taskIndex] = editedTask;
            this.save(true);
          }
        }
      });
    });
  }

  deleteTask(taskId: number) {
    let found = false;

    this.anforderungen.forEach(anforderung => {
      anforderung.data.tasks.forEach((task, index) => {
        if (task.id === taskId && !found) {
          found = true;

          let notDeletedTasks: ITask[] = [];

          anforderung.data.tasks.forEach(ttask => {
            if(ttask.id !== taskId) {
              notDeletedTasks.push(ttask);
            }
          })

          let anforderungIndex = this.anforderungen.findIndex(x => x.id === anforderung.id);
          this.anforderungen[anforderungIndex].data.tasks = notDeletedTasks;
          this.save(true);
        }
      });
    });
  }

  private getNextFreeAnforderungId(): number {
    if (this.anforderungen.length === 0) return 1;
    return Math.max(...this.anforderungen.map(a => a.id), 0) + 1;
  }

  private getNextFreeTaskId(): number {
    let tasks = this.anforderungen.flatMap(a => a.data.tasks);
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.id), 0) + 1;
  }

  private save(reload?: boolean) {
    this.fireService.saveDataOnServer(this.anforderungen).then(() => {
      if (true) {
        this.fireService.getDataFromServer().then(data => {
          this.anforderungen = data;
          this.sendUpdate();
        })
      }
    });
  }

  private sendUpdate() {
    this.updated.set(this.updated() + 1);
  }
}
