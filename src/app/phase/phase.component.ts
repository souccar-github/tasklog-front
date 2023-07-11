import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PhaseDto, PhaseDtoPagedResultDto, PhaseServiceProxy, ProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreatePhaseDialogComponent } from './create-phase/create-phase-dialog.component';
import { EditPhaseDialogComponent } from './edit-phase/edit-phase-dialog.component';


class PagedPhasesRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: 'app-phase',
  templateUrl: './phase.component.html',
  animations: [appModuleAnimation()]

})
export class PhaseComponent extends PagedListingComponentBase<PhaseDto>  {

  phases : PhaseDto[] = [];
  project : ProjectDto;
  private routeSub: Subscription;
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  protected list(request: PagedPhasesRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    this.routeSub = this.route.params.subscribe(params => {

      this._phaseService.getAll( 
        request.keyword,
        params['id'],
        request.skipCount,
        request.maxResultCount) 
           .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: PhaseDtoPagedResultDto) => {
        this.phases = result.items;
        this.showPaging(result, pageNumber);
      });
      
    });
  }
  protected delete(entity: PhaseDto): void {
    abp.message.confirm(
      this.l('ProjectDeleteWarningMessage', entity.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._phaseService.delete(entity.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }


 

constructor(injector: Injector,
  private route: ActivatedRoute,
  private _phaseService:PhaseServiceProxy,
  private _projectService:ProjectServiceProxy,
   private _modalService: BsModalService) {
  super(injector);
}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {

      this._projectService.get( 
        params['id'])
      .subscribe((result : ProjectDto) => {
        this.project = result;
      });
      
    });
    this.refresh();
  }

  createPhase(): void {
    let id;
    this.routeSub = this.route.params.subscribe(params => {
      id =  params['id'];
    });
    this.showCreateWithId(id);
  }

  editPhase(phase: PhaseDto): void {
    this.showCreateOrEditPhaseDialog(phase.id);
  }


  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }


  private showCreateWithId(id?: number): void {
    let showCreateOnlyWithId: BsModalRef;
    showCreateOnlyWithId = this._modalService.show(
      CreatePhaseDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          id: id,
        },
      }
    );
    showCreateOnlyWithId.content.onSave.subscribe(() => {
      this.refresh();
    });

  }

  private showCreateOrEditPhaseDialog(id?: number): void {
    let showCreateOrEditProjectDialog: BsModalRef;
    if (!id) {
      showCreateOrEditProjectDialog = this._modalService.show(
        CreatePhaseDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      showCreateOrEditProjectDialog = this._modalService.show(
        EditPhaseDialogComponent,
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
