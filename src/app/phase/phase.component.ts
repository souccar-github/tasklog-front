import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PhaseDto, PhaseDtoPagedResultDto, PhaseServiceProxy, ProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';


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
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.routeSub = this.route.params.subscribe(params => {
      this._phaseService.getAll(null,params['id'],0,100)
      .subscribe((result: PhaseDtoPagedResultDto) => {
        this.phases = result.items;
      });
    });
  }
  protected delete(entity: PhaseDto): void {
    throw new Error('Method not implemented.');
  }


  phases : PhaseDto[] = [];
  private project : ProjectDto;
  private routeSub: Subscription;
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

constructor(injector: Injector,private route: ActivatedRoute,private _phaseService:PhaseServiceProxy,private _projectService:ProjectServiceProxy) {
  super(injector);
}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this._phaseService.getAll('',params['id'],0,100)
      .subscribe((result: PhaseDtoPagedResultDto) => {
        this.phases = result.items;
      });
    });
  }

}
