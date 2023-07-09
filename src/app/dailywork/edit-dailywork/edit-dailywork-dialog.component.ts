import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DailyWorkDto, DailyWorkServiceProxy, ProjectDto, ProjectServiceProxy, TaskTypeDto, TaskTypeServiceProxy, UpdateDailyWorkDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-dailywork-dialog',
  templateUrl: './edit-dailywork-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class EditDailyworkDialogComponent extends AppComponentBase {

  ngOnInit(): void {
    this._dailyWorkService.getForEdit(this.id).subscribe((result: UpdateDailyWorkDto) => {
      this.dailyWork = result;
    });
    this._projectService.getAll('',0,100).subscribe((result) => {
      this.projects = result.items;
    });
    this._taskTypeService.getAll('',0,100).subscribe((result) => {
      this.taskTypes = result.items;
    });
  }
  saving = false;
  dailyWork: UpdateDailyWorkDto = new UpdateDailyWorkDto();
  id: number;
  projects = [] as ProjectDto[];
  taskTypes = [] as TaskTypeDto[];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _dailyWorkService: DailyWorkServiceProxy,
    public _projectService: ProjectServiceProxy,
    public _taskTypeService: TaskTypeServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  save(): void {
    this.saving = true;

    this._dailyWorkService.update(this.dailyWork).subscribe(
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
