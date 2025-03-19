import {Injectable, signal} from '@angular/core';
import {TaskZustand} from '../Models/Enums/TaskZustand';
import {ITask} from '../Models/Interfaces/ITask';
import {IAnforderung, IAnforderungData} from '../Models/Interfaces/IAnforderung';
import {FireService} from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  anforderungen: IAnforderung[] = [];
  updated = signal<number>(0);
  completedLoading = signal<boolean>(true);
  completedInitialLoading = signal<boolean>(false);

  constructor(private fireService: FireService) {
    this.getConvertedDataFromServer().then(convertedServerData => {
      this.anforderungen = convertedServerData;
      this.completedInitialLoading.set(true);
      this.sendUpdate();
    })
  }

  private async getConvertedDataFromServer(): Promise<IAnforderung[]> {
    let serverData = await this.fireService.getDataFromServer();
    let convertedServerData = this.convertServerDataToClientData(serverData);
    return convertedServerData;
  }

  private convertServerDataToClientData(serverData: IAnforderung[]) {
    return this.getDataWithTaskEditModesToFalse(serverData);
  }

  private getDataWithTaskEditModesToFalse(data: IAnforderung[]) {
    data.forEach(anforderung => {
      anforderung.data.tasks.forEach(task => {
        task.data.isTitleInEditMode = false;
      });
    });

    return data;
  }

  async addAnforderung(anforderungData: IAnforderungData) {
    this.completedLoading.set(false);
    this.getConvertedDataFromServer().then(convertedServerData => {
      console.log(convertedServerData)
      let newAnforderung: IAnforderung = {
        id: this.getNextFreeAnforderungId(convertedServerData),
        data: anforderungData
      };
      convertedServerData.push(newAnforderung);
      this.saveToServer(convertedServerData).then(() => {
        this.anforderungen = convertedServerData;
        this.sendUpdate();
        this.completedLoading.set(true);
      });
    });
  }

  async editAnforderung(anforderung: IAnforderung) {
    this.completedLoading.set(false);
    this.getConvertedDataFromServer().then(convertedServerData => {
      const index = convertedServerData.findIndex(x => x.id === anforderung.id);
      if (index !== -1) {
        convertedServerData[index] = {
          ...convertedServerData[index],
          data: {...convertedServerData[index].data, ...anforderung.data}
        };
      }
      this.saveToServer(convertedServerData).then(() => {
        this.anforderungen = convertedServerData;
        this.sendUpdate();
        this.completedLoading.set(true);
      });
    });
  }

  async deleteAnforderungById(id: number) {
    this.completedLoading.set(false);
    this.getConvertedDataFromServer().then(convertedServerData => {
      convertedServerData = convertedServerData.filter(a => a.id !== id);
      this.saveToServer(convertedServerData).then(() => {
        this.anforderungen = convertedServerData;
        this.sendUpdate();
        this.completedLoading.set(true);
      });
    });
  }

  async addEmptyTaskToAnforderungByAnforderungId(anforderungId: number) {
    this.completedLoading.set(false);
    this.getConvertedDataFromServer().then(convertedServerData => {
      let newTask: ITask = {
        id: this.getNextFreeTaskId(convertedServerData),
        data: {
          title: "",
          mitarbeiter: "",
          zustand: TaskZustand.todo,
          isTitleInEditMode: true
        }
      };
      const anforderung = convertedServerData.find(x => x.id === anforderungId);

      if (anforderung) {
        anforderung.data.tasks.push(newTask);
        this.saveToServer(convertedServerData).then(() => {
          this.anforderungen = convertedServerData;
          this.sendUpdate();
          this.completedLoading.set(true);
        });
      } else {
        this.sendUpdate();
        this.completedLoading.set(true);
      }
    });
  }

  async editTask(editedTask: ITask) {
    this.completedLoading.set(false);
    this.getConvertedDataFromServer().then(convertedServerData => {
      let updated = false;

      convertedServerData.forEach(anforderung => {
        const taskIndex = anforderung.data.tasks.findIndex(task => task.id === editedTask.id);
        if (taskIndex !== -1) {
          anforderung.data.tasks[taskIndex] = {
            ...anforderung.data.tasks[taskIndex],
            data: {...anforderung.data.tasks[taskIndex].data, ...editedTask.data}
          };
          updated = true;
        }
      });
      console.log(convertedServerData);

      if (updated) {
        this.saveToServer(convertedServerData).then(() => {
          this.anforderungen = convertedServerData;
          this.sendUpdate();
          this.completedLoading.set(true);
        });
      } else {
        this.sendUpdate();
        this.completedLoading.set(true);
      }
    });
  }

  async deleteTask(taskId: number) {
    let found = false;
    this.completedLoading.set(false);
    this.getConvertedDataFromServer().then(convertedServerData => {
      convertedServerData.forEach(anforderung => {
        const initialLength = anforderung.data.tasks.length;
        anforderung.data.tasks = anforderung.data.tasks.filter(task => task.id !== taskId);

        if (anforderung.data.tasks.length < initialLength) {
          found = true;
        }
      });
      if(found) {
        this.saveToServer(convertedServerData, true).then(() => {
          this.anforderungen = convertedServerData;
          this.sendUpdate();
          this.completedLoading.set(true);
        });
      } else {
        this.sendUpdate();
        this.completedLoading.set(true);
      }

    });
  }

  private async saveToServer(data?: IAnforderung[], override?: boolean) {
    this.fireService.saveDataOnServer(data ?? this.anforderungen, override).then(() => {
      this.sendUpdate();
    });
  }

  private sendUpdate() {
    this.updated.set(this.updated() + 1);
  }

  private getNextFreeAnforderungId(data?: IAnforderung[]): number {
    if (data) {
      if (data.length === 0) return 1;
      return Math.max(...data.map(a => a.id), 0) + 1;
    }
    if (this.anforderungen.length === 0) return 1;
    return Math.max(...this.anforderungen.map(a => a.id), 0) + 1;
  }

  private getNextFreeTaskId(data?: IAnforderung[]): number {
    if (data) {
      let tasks = data.flatMap(a => a.data.tasks);
      if (tasks.length === 0) return 1;
      return Math.max(...tasks.map(t => t.id), 0) + 1;
    }
    let tasks = this.anforderungen.flatMap(a => a.data.tasks);
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.id), 0) + 1;
  }
}
