import { Component } from '@angular/core';
import {DialogService} from './Services/dialog.service';
import {TaskboardComponent} from './Components/taskboard/taskboard.component';

@Component({
  selector: 'app-root',
  imports: [
    TaskboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Uebungsprojekt';

  constructor(protected dialogService: DialogService) {

  }
}
