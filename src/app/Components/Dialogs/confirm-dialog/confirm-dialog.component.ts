import {Component, Input} from '@angular/core';
import {ConfirmDialogViewModel} from '../../../Models/ViewModels/ConfirmDialogViewModel';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() viewModel?: ConfirmDialogViewModel;

  constructor() {

  }

  onBtnConfirmClicked() {
    this.viewModel?.onConfirmClicked();
  }

  onBtnCancelClicked() {
    this.viewModel?.onCancelClicked();
  }
}
