import {Component, computed} from '@angular/core';
import {DialogService} from './Services/dialog.service';
import {AnforderungDialogComponent} from './Components/Dialogs/anforderung-dialog/anforderung-dialog.component';
import {MessageDialogComponent} from './Components/Dialogs/message-dialog/message-dialog.component';
import {ConfirmDialogComponent} from './Components/Dialogs/confirm-dialog/confirm-dialog.component';
import {TaskboardComponent} from './Components/taskboard/taskboard.component';
import {LoadingComponent} from './Components/loading/loading.component';
import {NgIf} from '@angular/common';
import {DataService} from './Services/data.service';
import {LoadingBarComponent} from './Components/loading-bar/loading-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    AnforderungDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    TaskboardComponent,
    LoadingComponent,
    NgIf,
    LoadingBarComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Taskboard';
  isLoading = computed(() => {
    return !this.dataService.completedLoading();
  });
  isInitialLoading = computed(() => {
    return this.dataService.isLoadingInitial();
  });

  constructor(protected dialogService: DialogService, private dataService: DataService) {

  }
}
