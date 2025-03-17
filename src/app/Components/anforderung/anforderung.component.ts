import {Component, Input} from '@angular/core';
import {TaskComponent} from '../task/task.component';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {DialogService} from '../../Services/dialog.service';
import {DataService} from '../../Services/data.service';
import {IAnforderung} from '../../Models/Interfaces/IAnforderung';
import {AnforderungDialogViewModel} from '../../Models/ViewModels/AnforderungDialogViewModel';
import {ConfirmDialogViewModel} from '../../Models/ViewModels/ConfirmDialogViewModel';
import {TaskZustand} from '../../Models/Enums/TaskZustand';

@Component({
  selector: 'app-anforderung',
  imports: [
    TaskComponent,
    NgForOf,
    NgIf,
    NgStyle
  ],
  templateUrl: './anforderung.component.html',
  styleUrl: './anforderung.component.css'
})
export class AnforderungComponent {
  @Input() anforderung!: IAnforderung;
  isMenuVisible: boolean = false;
  dropdownVisible = false;
  dropdownPosition = { x: 0, y: 0 };

  constructor(private dataService: DataService, private dialogService: DialogService) {

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
      title: "",
      beschreibung: "",
      onConfirmClicked: this.onDeleteConfirmClicked,
      onCancelClicked: this.onDeleteCancelClicked
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

  protected getTodoTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.todo);
  }

  protected getInProgressTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.inProgress);
  }

  protected getDoneTasks() {
    return this.anforderung.data.tasks.filter(x => x.data.zustand === TaskZustand.done);
  }
}
