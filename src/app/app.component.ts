import { Component } from '@angular/core';
import {DialogService} from './Services/dialog.service';
import {TaskboardComponent} from './Components/taskboard/taskboard.component';
import {NgIf} from '@angular/common';
import {ConfirmDialogComponent} from './Components/Dialogs/confirm-dialog/confirm-dialog.component';
import {MessageDialogComponent} from './Components/Dialogs/message-dialog/message-dialog.component';
import {AnforderungDialogComponent} from './Components/Dialogs/anforderung-dialog/anforderung-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    TaskboardComponent,
    NgIf,
    ConfirmDialogComponent,
    MessageDialogComponent,
    AnforderungDialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Uebungsprojekt';

  constructor(protected dialogService: DialogService) {

  }
}
