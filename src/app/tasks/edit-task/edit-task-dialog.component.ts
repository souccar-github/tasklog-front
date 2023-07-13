import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PhaseServiceProxy, TaskServiceProxy, TaskTypeDto, TaskTypeServiceProxy, UpdateTaskDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class EditTaskDialogComponent extends AppComponentBase {

  saving = false;
  task = new UpdateTaskDto();
  users = [] as UserDto[];
  taskTypes = [] as TaskTypeDto[];

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
  id: number;
  phaseId: number;

  ngOnInit(): void {
    this._userService.getAll('',true,0,100).subscribe((result) => {
      this.users = result.items;
    });
    this._taskTypeService.getAll('',0,100).subscribe((result) => {
      this.taskTypes = result.items;
    });
    this._taskService.getForEdit(this.id).subscribe((result: UpdateTaskDto) => {
      this.task = result;
    });
  }

  save(): void {

    this.saving = true;
    console.log(this.phaseId);
    this.task.phaseId = this.phaseId;
    this._taskService.update(this.task).subscribe(
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
