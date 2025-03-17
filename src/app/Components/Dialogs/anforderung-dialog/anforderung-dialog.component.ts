import {Component, Input} from '@angular/core';
import {AnforderungDialogViewModel} from '../../../Models/ViewModels/AnforderungDialogViewModel';
import {IAnforderung} from '../../../Models/Interfaces/IAnforderung';

@Component({
  selector: 'app-anforderung-dialog',
  imports: [],
  templateUrl: './anforderung-dialog.component.html',
  styleUrl: './anforderung-dialog.component.css'
})
export class AnforderungDialogComponent {

  @Input() viewModel?: AnforderungDialogViewModel;
  newOrEditedAnforderung: IAnforderung;
  isSaveButtonDisabled: boolean = true;

  constructor() {
    this.newOrEditedAnforderung = {
      id: this.viewModel?.anforderung?.id ?? -1,
      data: {
        title: this.viewModel?.anforderung?.data.title ?? "",
        beschreibung: this.viewModel?.anforderung?.data.beschreibung ?? "",
        tasks: this.viewModel?.anforderung?.data.tasks ?? []
      }
    }
  }

  onTitleChange() {
    this.updateSaveButton();
  }

  onBeschreibungChange() {
    this.updateSaveButton();
  }

  onBtnSaveClicked() {
    this.viewModel?.onSaveClick(this.newOrEditedAnforderung);
  }

  onBtnCancleClicked() {
    this.viewModel?.onCancelClick();
  }

  private updateSaveButton() {
    this.hasChanged()
      ? this.isSaveButtonDisabled = false
      : this.isSaveButtonDisabled = true;
  }

  private hasChanged() {
    if(this.viewModel?.anforderung?.data.title !== this.newOrEditedAnforderung.data.title) {
      return true;
    }
    if(this.viewModel?.anforderung?.data.beschreibung !== this.newOrEditedAnforderung.data.beschreibung) {
      return true;
    }
    return false;
  }

}
