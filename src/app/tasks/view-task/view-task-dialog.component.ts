import { Component, Injector, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { TaskDto, TaskServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-task-dialog',
  templateUrl: './view-task-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class ViewTaskDialogComponent extends AppComponentBase {


  config : AngularEditorConfig = {
    editable:false,
    spellcheck:true,
    height:'15rem',
    minHeight:'5rem',
    placeholder: 'Enter Text Here ....',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    sanitize: false,
  };
  
  constructor(
    injector: Injector,
    private _taskService : TaskServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }
  ngOnInit(): void {

  }

  task : TaskDto;

}
