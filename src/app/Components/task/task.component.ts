import {Component, Input, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output} from '@angular/core';
import { ITask } from '../../Models/Interfaces/ITask';
import { DataService } from '../../Services/data.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements AfterViewInit {
  @Input() task!: ITask;
  @Output() isInEditMode = new EventEmitter<boolean>();

  isTitleInEditMode = false;
  isMitarbeiterInEditMode = false;

  @ViewChild('titleInput') titleInput!: ElementRef;
  @ViewChild('mitarbeiterInput') mitarbeiterInput!: ElementRef;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    // Wird nur benötigt, wenn die Inputs schon beim Start geladen sind.
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

  onBtnDeleteClicked() {
    this.dataService.deleteTask(this.task.id);
  }

  enableTitleEdit() {
    this.isTitleInEditMode = true;
    this.isInEditMode.emit(true);
    setTimeout(() => {
      this.titleInput?.nativeElement.focus();
      this.titleInput?.nativeElement.select();
    }, 0);
  }

  enableMitarbeiterEdit() {
    this.isMitarbeiterInEditMode = true;
    this.isInEditMode.emit(true);
    setTimeout(() => {
      this.mitarbeiterInput?.nativeElement.focus();
      this.mitarbeiterInput?.nativeElement.select();
    }, 0);
  }

  onEditBackgroundClicked() {
    this.isTitleInEditMode = false;
    this.isMitarbeiterInEditMode = false;
    this.isInEditMode.emit(false);
    this.afterTaskChanged();
  }
}
