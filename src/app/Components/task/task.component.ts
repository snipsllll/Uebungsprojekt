import {Component, Input, viewChild} from '@angular/core';
import {ITask} from '../../Models/Interfaces/ITask';
import {DataService} from '../../Services/data.service';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-task',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() task!: ITask;
  isTitleInEditMode = false;
  isMitarbeiterInEditMode = false;

  constructor(private dataService: DataService) {

  }

  afterTaskChanged() {
    this.dataService.editTask(this.task);
  }

  onStatusChange() {
    this.afterTaskChanged();
  }

  onTitleChange() {
    this.afterTaskChanged();
  }

  onMitarbeiterChange() {
    this.afterTaskChanged();
  }

  protected onEditBackgroundClicked() {
    this.isTitleInEditMode = false;
    this.isMitarbeiterInEditMode = false;
    this.onTitleChange();
  }

  protected readonly viewChild = viewChild;
}
