import { Component } from '@angular/core';
import {DialogService} from './Services/dialog.service';
import {AnforderungDialogComponent} from './Components/Dialogs/anforderung-dialog/anforderung-dialog.component';
import {MessageDialogComponent} from './Components/Dialogs/message-dialog/message-dialog.component';
import {ConfirmDialogComponent} from './Components/Dialogs/confirm-dialog/confirm-dialog.component';
import {TaskboardComponent} from './Components/taskboard/taskboard.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    AnforderungDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    TaskboardComponent,
    NgIf
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Uebungsprojekt';

  constructor(protected dialogService: DialogService) {

  }
}
