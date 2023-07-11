import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  DailyWorkServiceProxy,
  CreateDailyWorkDto,
  ProjectDto,
  TaskTypeDto,
  ProjectServiceProxy,
  TaskTypeServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  selector: 'app-create-dailywork-dialog',
  templateUrl: './create-dailywork-dialog.component.html',
  animations: [appModuleAnimation()]
})
export class CreateDailyworkDialogComponent extends AppComponentBase {
  saving = false;
  dailyWork = new CreateDailyWorkDto();
  projects = [] as ProjectDto[];
  taskTypes = [] as TaskTypeDto[];

  constructor(
    injector: Injector,
    public _dailyWorkService: DailyWorkServiceProxy,
    public _projectService: ProjectServiceProxy,
    public _taskTypeService: TaskTypeServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();
  ngOnInit(): void {
     this._projectService.getAll('',0,100).subscribe((result) => {
      this.projects = result.items;
    });
    this._taskTypeService.getAll('',0,100).subscribe((result) => {
      this.taskTypes = result.items;
    });
  
  }

  save(): void {

    this.saving = true;


    this._dailyWorkService.create(this.dailyWork).subscribe(
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
