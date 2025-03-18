import {Component, Input} from '@angular/core';
import {TaskComponent} from '../task/task.component';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {DialogService} from '../../Services/dialog.service';
import {DataService} from '../../Services/data.service';
import {IAnforderung} from '../../Models/Interfaces/IAnforderung';
import {AnforderungDialogViewModel} from '../../Models/ViewModels/AnforderungDialogViewModel';
import {ConfirmDialogViewModel} from '../../Models/ViewModels/ConfirmDialogViewModel';
import {TaskZustand} from '../../Models/Enums/TaskZustand';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-anforderung',
  imports: [
    TaskComponent,
    NgForOf,
    NgIf,
    NgStyle,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup
  ],
  templateUrl: './anforderung.component.html',
  styleUrl: './anforderung.component.css'
})
export class AnforderungComponent {
  @Input() anforderung!: IAnforderung;
  isMenuVisible: boolean = false;
  dropdownPosition = { x: 0, y: 0 };
  dragAndDropDisabled = false;
  isExpanded = true;

  constructor(private dataService: DataService, private dialogService: DialogService) {

  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  isDragAndDropDisabled(b: boolean) {
    this.dragAndDropDisabled = b;
    console.log(this.dragAndDropDisabled);
  }

  onBtnMenuClicked() {
    this.isMenuVisible = true;
  }

  onMenuBackgroundClicked() {
    this.isMenuVisible = false;
  }

  onBtnEditClicked() {
    this.isMenuVisible = false;
    let anforderungDialogViewModel: AnforderungDialogViewModel = {
      anforderung: this.anforderung,
      onSaveClick: this.onEditSaveClicked,
      onCancelClick: this.onEditCancelClicked
    };
    this.dialogService.showAnforderungDialog(anforderungDialogViewModel)
  }

  onBtnDeleteClicked() {
    this.isMenuVisible = false;
    let confirmDialogViewModel: ConfirmDialogViewModel = {
      title: "Löschen?",
      beschreibung: "Wollen Sie diese Anforderung wirklich löschen? Sie kann nicht wieder hergestellt werden!",
      onConfirmClicked: this.onDeleteConfirmClicked,
      onCancelClicked: this.onDeleteCancelClicked,
      anforderungId: this.anforderung.id
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onBtnAddTaskClicked() {
    this.dataService.addEmptyTaskToAnforderungByAnforderungId(this.anforderung.id!);
  }

  onEditSaveClicked = (anforderung: IAnforderung) => {
    this.dataService.editAnforderung(anforderung);
    this.dialogService.isAnforderungDialogVisible = false;
  }

  onEditCancelClicked = () => {
    this.dialogService.isAnforderungDialogVisible = false;
  }

  onDeleteConfirmClicked = (id?: number) => {
    if(id !== undefined) {
      this.dataService.deleteAnforderungById(id);
    }
    this.dialogService.isConfirmDialogVisible = false;
  }

  onDeleteCancelClicked = () => {
    this.dialogService.isConfirmDialogVisible = false;
  }

  get todoTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.todo);
  }

  get inProgressTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.inProgress);
  }

  get doneTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.done);
  }

  // Methode zum Verschieben von Tasks
  dropTask(event: CdkDragDrop<any[]>, targetStatus: TaskZustand) {
    if (event.previousContainer === event.container) {
      // Falls das Element in der gleichen Liste bewegt wurde
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Falls das Element in eine andere Liste verschoben wurde
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      // Task-Zustand aktualisieren
      const movedTask = event.container.data[event.currentIndex];
      movedTask.data.zustand = targetStatus;

      // Task-Änderung in Firestore oder Backend speichern
      this.dataService.editTask(movedTask);
    }
  }

  protected getTodoTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.todo);
  }

  protected getInProgressTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.inProgress);
  }

  protected getDoneTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.done);
  }

  protected readonly TaskZustand = TaskZustand;
}
