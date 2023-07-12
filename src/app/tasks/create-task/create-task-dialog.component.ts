import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class CreateTaskDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
