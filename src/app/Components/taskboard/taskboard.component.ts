import {Component, computed} from '@angular/core';
import {IAnforderung} from '../../Models/Interfaces/IAnforderung';
import {DataService} from '../../Services/data.service';
import {DialogService} from '../../Services/dialog.service';
import {AnforderungDialogViewModel} from '../../Models/ViewModels/AnforderungDialogViewModel';
import {AnforderungComponent} from '../anforderung/anforderung.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-taskboard',
  imports: [
    AnforderungComponent,
    NgForOf
  ],
  templateUrl: './taskboard.component.html',
  styleUrl: './taskboard.component.css'
})
export class TaskboardComponent {
  anforderungen = computed<IAnforderung[]>(() => {
    this.dataService.updated();
    return this.dataService.anforderungen;
  });

  constructor(protected dataService: DataService, private dialogService: DialogService) {

  }

  onBtnAddAnforderungClicked() {
    let anforderungDialogViewModel: AnforderungDialogViewModel = {
      onCancelClick: this.onAddAnforderungCancelClicked,
      onSaveClick: this.onAddAnforderungSaveClicked
    }

    this.dialogService.showAnforderungDialog(anforderungDialogViewModel);
  }

  onAddAnforderungCancelClicked = () => {
    this.dialogService.isAnforderungDialogVisible = false;
  }

  onAddAnforderungSaveClicked = (anforderung: IAnforderung) => {
    this.dataService.addAnforderung(anforderung.data);
    this.dialogService.isAnforderungDialogVisible = false;
  }
}
