import { Component } from '@angular/core';
import {DialogService} from './Services/dialog.service';
import {AnforderungDialogComponent} from './Components/Dialogs/anforderung-dialog/anforderung-dialog.component';
import {MessageDialogComponent} from './Components/Dialogs/message-dialog/message-dialog.component';
import {ConfirmDialogComponent} from './Components/Dialogs/confirm-dialog/confirm-dialog.component';
import {TaskboardComponent} from './Components/taskboard/taskboard.component';
import {NgIf} from '@angular/common';
import {AnforderungDialogViewModel} from './Models/ViewModels/AnforderungDialogViewModel';
import {TaskZustand} from './Models/Enums/TaskZustand';
import {IAnforderung} from './Models/Interfaces/IAnforderung';
import {DataService} from './Services/data.service';
import {MessageDialogViewModel} from './Models/ViewModels/MessageDialogViewModel';
import {ConfirmDialogViewModel} from './Models/ViewModels/ConfirmDialogViewModel';

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

  messageDialogViewModel: MessageDialogViewModel;
  confirmDialogViewModel: ConfirmDialogViewModel;

  constructor(protected dialogService: DialogService, private dataService: DataService) {
    this.messageDialogViewModel = {
      title: "test titel message",
      beschreibung: "test beschreibung message"
    }
    this.confirmDialogViewModel = {
      title: "test titel message",
      beschreibung: "test beschreibung message",
      onConfirmClicked: this.doNothing1,
      onCancelClicked: this.doNothing1
    }

    //this.dialogService.showConfirmDialog(this.confirmDialogViewModel);
    //this.dialogService.showMessageDialog(this.messageDialogViewModel);
  }

  doNothing1 = () => {
    this.dialogService.isConfirmDialogVisible = false;
    this.dialogService.isMessageDialogVisible = false;
    this.dialogService.isAnforderungDialogVisible = false;
  }

  doNothing2 = (anforderung: IAnforderung) => {

  }
}
