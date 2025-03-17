import {Component, Input} from '@angular/core';
import {ITask} from '../../Models/Interfaces/ITask';
import {DataService} from '../../Services/data.service';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() task!: ITask;

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
}
