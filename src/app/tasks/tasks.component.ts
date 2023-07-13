import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {  PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { EntityDto, PhaseDto, PhaseServiceProxy, TaskDto, TaskDtoPagedResultDto, TaskServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CreateTaskDialogComponent } from './create-task/create-task-dialog.component';
import { EditTaskDialogComponent } from './edit-task/edit-task-dialog.component';
import { finalize } from 'rxjs/operators';


class PagedTasksRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  animations: [appModuleAnimation()]
})
export class TasksComponent  extends PagedListingComponentBase<TaskDto>  {

  protected list(request: PagedTasksRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    this.routeSub = this.route.params.subscribe(params => {

      this._taskService.getAll( 
        request.keyword,
        params['id'],
        request.skipCount,
        request.maxResultCount) 
           .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: TaskDtoPagedResultDto) => {
        this.tasks = result.items;
        this.showPaging(result, pageNumber);
      });
      
    });
  }
  protected delete(entity: TaskDto): void {
    abp.message.confirm(
      this.l('TaskDeleteWarningMessage', entity.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._taskService.delete(entity.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  tasks : TaskDto[] = [];
  phase : PhaseDto;
  private routeSub: Subscription;
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;


  constructor(injector: Injector,
    private route: ActivatedRoute,
    private _phaseService:PhaseServiceProxy,
    private _taskService:TaskServiceProxy,
     private _modalService: BsModalService) {
    super(injector);
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {

      this._phaseService.get( 
        params['id'])
      .subscribe((result : PhaseDto) => {
        this.phase = result;
      });
      
    });
    this.refresh();
  }

  startTask(task: TaskDto):void
  {
    let entityDto = new EntityDto();
    entityDto.id = task.id;
    abp.message.confirm(
      this.l('PhaseCompleteWarningMessage', task.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._taskService.startTask(entityDto).subscribe(() => {
            abp.notify.success(this.l('Task Started!'));
            this.refresh();
          });
        }
      }
    );
  }

  completeTask(task: TaskDto):void
  {
    let entityDto = new EntityDto();
    entityDto.id = task.id;
    abp.message.confirm(
      this.l('PhaseCompleteWarningMessage', task.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._taskService.completeTask(entityDto).subscribe(() => {
            abp.notify.success(this.l('Task Completed!'));
            this.refresh();
          });
        }
      }
    );
  }

  createTask(): void {
    let id;
    this.routeSub = this.route.params.subscribe(params => {
      id =  params['id'];
    });
    this.showCreateWithId(id);
  }

  editTask(task: TaskDto): void {
    this.showCreateOrEditTaskDialog(task.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }


  private showCreateWithId(id?: number): void {
    let showCreateOnlyWithId: BsModalRef;
    showCreateOnlyWithId = this._modalService.show(
      CreateTaskDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          phaseId: id,
        },
      }
    );
    showCreateOnlyWithId.content.onSave.subscribe(() => {
      this.refresh();
    });

  }


  private showCreateOrEditTaskDialog(id?: number): void {
    let showCreateOrEditProjectDialog: BsModalRef;
    if (!id) {
      showCreateOrEditProjectDialog = this._modalService.show(
        CreateTaskDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      showCreateOrEditProjectDialog = this._modalService.show(
        EditTaskDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
            phaseId : this.phase.id,
          },
        }
      );
    }

    showCreateOrEditProjectDialog.content.onSave.subscribe(() => {
      this.refresh();
    });

  }

}
