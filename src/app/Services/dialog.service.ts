import { Injectable } from '@angular/core';
import {ConfirmDialogViewModel} from '../Models/ViewModels/ConfirmDialogViewModel';
import {MessageDialogViewModel} from '../Models/ViewModels/MessageDialogViewModel';
import {AnforderungDialogViewModel} from '../Models/ViewModels/AnforderungDialogViewModel';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  isConfirmDialogVisible: boolean = false;
  confirmDialogViewModel?: ConfirmDialogViewModel;
  isMessageDialogVisible: boolean = false;
  messageDialogViewModel?: MessageDialogViewModel;
  isAnforderungDialogVisible: boolean = false;
  anforderungDialogViewModel?: AnforderungDialogViewModel;

  constructor() { }

  showConfirmDialog(viewModel: ConfirmDialogViewModel) {
    this.confirmDialogViewModel = viewModel;
    this.isConfirmDialogVisible = true;
  }

  showMessageDialog(viewModel: MessageDialogViewModel) {
    this.messageDialogViewModel = viewModel;
    this.isMessageDialogVisible = true;
  }

  showAnforderungDialog(viewModel: AnforderungDialogViewModel) {
    this.anforderungDialogViewModel = viewModel;
    this.isAnforderungDialogVisible = true;
  }
}
