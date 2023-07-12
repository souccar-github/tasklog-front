import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class EditTaskDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
