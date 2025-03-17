import {Injectable, signal} from '@angular/core';
import {TaskZustand} from '../Models/Enums/TaskZustand';
import {ITask} from '../Models/Interfaces/ITask';
import {IAnforderung, IAnforderungData} from '../Models/Interfaces/IAnforderung';
import {FileService} from './file.service';
import {FireService} from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  anforderungen: IAnforderung[] = [];
  updated = signal<number>(0);

  constructor(private fileService: FileService, private fireService: FireService) {
    this.anforderungen = this.fileService.loadData();
    this.sendUpdate();
    this.save(true);
  }

  addAnforderung(anforderungData: IAnforderungData) {
    let newAnforderung: IAnforderung = {
      id: this.getNextFreeAnforderungId(),
      data: anforderungData
    }

    this.anforderungen.push(newAnforderung);
    this.save(true);
  }

  editAnforderung(anforderung: IAnforderung) {
    this.anforderungen[this.anforderungen.findIndex(x => x.id === anforderung.id)] = anforderung;
  }

  deleteAnforderungById(id: number) {
    this.anforderungen.splice(this.anforderungen.findIndex(x => x.id === id), 1);
    this.save(true);
  }

  addEmptyTaskToAnforderungByAnforderungId(anforderungId: number) {
    let newTask: ITask = {
      id: this.getNextFreeTaskId(),
      data: {
        title: "",
        mitarbeiter: "",
        zustand: TaskZustand.todo
      }
    }

    this.anforderungen.find(x => x.id === anforderungId)?.data.tasks.push(newTask);
    this.save(true);
  }

  editTask(editedTask: ITask) {
    let found = false;
    this.anforderungen.forEach(anforderung => {
      anforderung.data.tasks.forEach(task => {
        if(task.id === task.id && !found) {
          found = true;
          let anforderungIndex = this.anforderungen.findIndex(x => x.id === anforderung.id);
          let taskIndex = this.anforderungen[anforderungIndex]?.data.tasks.findIndex(x => x.id === task.id);
          this.anforderungen[anforderungIndex].data.tasks[taskIndex] = editedTask;
        }
      })
    })

    this.save(true);
  }

  private getNextFreeAnforderungId(): number {
    let highestId = 1;
    this.anforderungen.forEach(anforderung => {
      if(anforderung.id > highestId) {
        highestId = anforderung.id;
      }
    })
    return highestId + 1;
  }

  private getNextFreeTaskId(): number {
    let highestId = 1;
    this.anforderungen.forEach(anforderung => {
      anforderung.data.tasks.forEach(task => {
        if(task.id > highestId) {
          highestId = task.id;
        }
      })
    })
    return highestId + 1;
  }

  private save(reload?: boolean) {
    //this.fileService.saveData(this.anforderungen);
    console.log(this.anforderungen)
    this.fireService.saveDataOnServer(this.anforderungen).then(() => {
      if(reload) {
        this.sendUpdate();
      }
    });
  }

  private sendUpdate() {
    this.updated.set(this.updated() + 1);
  }
}
