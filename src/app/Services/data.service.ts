import { Injectable, signal } from '@angular/core';
import { TaskZustand } from '../Models/Enums/TaskZustand';
import { ITask } from '../Models/Interfaces/ITask';
import { IAnforderung, IAnforderungData } from '../Models/Interfaces/IAnforderung';
import { FireService } from './fire.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  anforderungen: IAnforderung[] = [];
  updated = signal<number>(0);
  isLoadingInitial = signal<boolean>(true);
  completedLoading = signal<boolean>(true);

  constructor(private fireService: FireService) {
    this.initData();
  }

  private async initData() {
    this.isLoadingInitial.set(true);
    try {
      const downloadedData = await this.getConvertedDataFromServer();
      this.anforderungen = downloadedData;
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    } finally {
      this.isLoadingInitial.set(false);
      this.update();
    }
  }

  private async getConvertedDataFromServer(): Promise<IAnforderung[]> {
    try {
      const serverData = await this.fireService.getDataFromServer();
      return this.getDataWithTaskEditModesToFalse(serverData);
    } catch (error) {
      console.error('Fehler beim Abrufen der Serverdaten:', error);
      return [];
    }
  }

  private getDataWithTaskEditModesToFalse(data: IAnforderung[]): IAnforderung[] {
    return data.map(anforderung => ({
      ...anforderung,
      data: {
        ...anforderung.data,
        tasks: anforderung.data.tasks.map(task => ({
          id: task.id === -1 ? this.getNextFreeTaskId(data) : task.id,
          data: { ...task.data, isTitleInEditMode: task.data.isTitleInEditMode }
        }))
      }
    }));
  }

  async addAnforderung(anforderungData: IAnforderungData) {
    this.completedLoading.set(false);
    try {
      const convertedData = await this.getConvertedDataFromServer();
      const newAnforderung: IAnforderung = { id: this.getNextFreeId(convertedData), data: anforderungData };
      convertedData.push(newAnforderung);
      await this.saveToServer(convertedData);
      this.anforderungen = await this.getConvertedDataFromServer();
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  async editAnforderung(anforderung: IAnforderung) {
    this.completedLoading.set(false);
    try {
      const convertedData = await this.getConvertedDataFromServer();
      const index = convertedData.findIndex(x => x.id === anforderung.id);
      if (index !== -1) convertedData[index] = { ...convertedData[index], data: { ...anforderung.data } };
      await this.saveToServer(convertedData);
      this.anforderungen = await this.getConvertedDataFromServer();
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  async deleteAnforderungById(id: number) {
    this.completedLoading.set(false);
    try {
      let convertedData = await this.getConvertedDataFromServer();
      convertedData = convertedData.filter(a => a.id !== id);
      await this.saveToServer(convertedData);
      this.anforderungen = await this.getConvertedDataFromServer();
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  async addEmptyTaskToAnforderungByAnforderungId(anforderungId: number) {
    let localAnforderung = this.anforderungen.find(x => x.id === anforderungId);
    if(localAnforderung){
      localAnforderung.data.tasks.push({ id: -1, data: { title: '', mitarbeiter: '', zustand: TaskZustand.todo, isTitleInEditMode: true } });
      this.sendUpdate();
    }
    console.log(this.anforderungen)
  }

  async saveNewTask(task: ITask) {
    let anforderungId = -1;
    this.anforderungen.forEach(anf => {
      if(anf.data.tasks.find(t => t.id === task.id)){
        anforderungId = anf.id;
      }
    })
    this.completedLoading.set(false);
    try {
      let updated = false;
      const convertedData = await this.getConvertedDataFromServer();
      convertedData.forEach(anforderung => {
        if (anforderung.id === anforderungId && !updated) {
         anforderung.data.tasks.push(task);
         updated = true;
        }
      });
      await this.saveToServer(convertedData);
      this.anforderungen = await this.getConvertedDataFromServer();
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  async editTask(editedTask: ITask) {
    this.completedLoading.set(false);
    try {
      const convertedData = await this.getConvertedDataFromServer();
      let updated = false;
      convertedData.forEach(anforderung => {
        const taskIndex = anforderung.data.tasks.findIndex(task => task.id === editedTask.id);
        if (taskIndex !== -1) {
          anforderung.data.tasks[taskIndex] = { ...anforderung.data.tasks[taskIndex], data: { ...editedTask.data, isTitleInEditMode: false } };
          updated = true;
        }
      });
      if (updated) await this.saveToServer(convertedData);
      this.anforderungen = await this.getConvertedDataFromServer();
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  async deleteTask(taskId: number) {
    this.completedLoading.set(false);
    try {
      const convertedData = await this.getConvertedDataFromServer();
      convertedData.forEach(anforderung => {
        anforderung.data.tasks = anforderung.data.tasks.filter(task => task.id !== taskId);
      });
      await this.saveToServer(convertedData);
      this.anforderungen = await this.getConvertedDataFromServer();
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  private async saveToServer(data: IAnforderung[]) {
    this.completedLoading.set(false);
    try {
      await this.fireService.saveDataOnServer(data);
      this.anforderungen = await this.getConvertedDataFromServer();
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
    } finally {
      this.completedLoading.set(true);
      this.update();
    }
  }

  private update() {
    this.updated.set(this.updated() + 1);
  }

  private sendUpdate() {
    this.updated.set(this.updated() + 1);
  }

  private getNextFreeId(data: IAnforderung[]): number {
    return data.length > 0 ? Math.max(...data.map(a => a.id)) + 1 : 1;
  }

  private getNextFreeTaskId(data: IAnforderung[]): number {
    const tasks = data.flatMap(a => a.data.tasks);
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }
}
