import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateTaskDto, PhaseServiceProxy, TaskServiceProxy, TaskTypeDto, TaskTypeServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class CreateTaskDialogComponent extends AppComponentBase {

  html = '';

  saving = false;
  task = new CreateTaskDto();
  users = [] as UserDto[];
  taskTypes = [] as TaskTypeDto[];


  config : AngularEditorConfig = {
    editable:true,
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
    private _phaseService : PhaseServiceProxy,
    private _taskService : TaskServiceProxy,
    private _taskTypeService : TaskTypeServiceProxy,
    private _userService : UserServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();
  phaseId: number;

  ngOnInit(): void {
    this._userService.getAll('',true,0,100).subscribe((result) => {
      this.users = result.items;
    });
    this._taskTypeService.getAll('',0,100).subscribe((result) => {
      this.taskTypes = result.items;
    });
  }


  



  save(): void {
    this.saving = true;
    this.task.phaseId = this.phaseId;
    this._taskService.create(this.task).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

}
