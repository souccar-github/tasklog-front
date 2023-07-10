import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ProjectDto, ProjectDtoPagedResultDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateProjectDialogComponent } from './create-project/create-project-dialog.component';
import { EditProjectDialogComponent } from './edit-project/edit-project-dialog.component';
import { Router } from '@angular/router';


class PagedProjectsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  animations: [appModuleAnimation()]
})
export class ProjectComponent extends PagedListingComponentBase<ProjectDto>  {


  projects: ProjectDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _projectService: ProjectServiceProxy,
    private _modalService: BsModalService,
    private router : Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.refresh();
  }

  protected list(request: PagedProjectsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;

    this._projectService
      .getAll(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: ProjectDtoPagedResultDto) => {
        this.projects = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: ProjectDto): void {
    abp.message.confirm(
      this.l('ProjectDeleteWarningMessage', entity.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._projectService.delete(entity.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  onPhaseButtonClick(event)
  {
    this.router.navigateByUrl('app/project/' + event.id +'/phases');
  }


  createProject(): void {
    this.showCreateOrEditProjectDialog();
  }

  editProject(project: ProjectDto): void {
    this.showCreateOrEditProjectDialog(project.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  private showCreateOrEditProjectDialog(id?: number): void {
    let showCreateOrEditProjectDialog: BsModalRef;
    if (!id) {
      showCreateOrEditProjectDialog = this._modalService.show(
        CreateProjectDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      showCreateOrEditProjectDialog = this._modalService.show(
        EditProjectDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    showCreateOrEditProjectDialog.content.onSave.subscribe(() => {
      this.refresh();
    });

  }

}
