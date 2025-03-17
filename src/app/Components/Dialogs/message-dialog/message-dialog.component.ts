import {Component, Input} from '@angular/core';
import {MessageDialogViewModel} from '../../../Models/ViewModels/MessageDialogViewModel';
import {DialogService} from '../../../Services/dialog.service';

@Component({
  selector: 'app-message-dialog',
  imports: [],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.css'
})
export class MessageDialogComponent {
  @Input() viewModel?: MessageDialogViewModel;

  constructor(private dialogService: DialogService) {

  }

  onBtnOkClicked() {
    this.dialogService.isMessageDialogVisible = false;
  }
}
