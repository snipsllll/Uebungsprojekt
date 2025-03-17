import {Component, Input, OnInit} from '@angular/core';
import {AnforderungDialogViewModel} from '../../../Models/ViewModels/AnforderungDialogViewModel';
import {IAnforderung} from '../../../Models/Interfaces/IAnforderung';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-anforderung-dialog',
  imports: [
    FormsModule
  ],
  templateUrl: './anforderung-dialog.component.html',
  styleUrl: './anforderung-dialog.component.css'
})
export class AnforderungDialogComponent implements OnInit {

  @Input() viewModel?: AnforderungDialogViewModel;
  oldAnforderung!: IAnforderung;
  isSaveButtonDisabled: boolean = true;

  constructor() {

  }

  ngOnInit() {
    this.oldAnforderung = {
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
    this.viewModel?.onSaveClick(this.viewModel?.anforderung!);
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
    if(this.viewModel?.anforderung?.data.title !== this.oldAnforderung.data.title) {
      return true;
    }
    return this.viewModel?.anforderung?.data.beschreibung !== this.oldAnforderung.data.beschreibung;
  }

}
