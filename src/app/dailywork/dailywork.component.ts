import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateDailyworkDialogComponent } from './create-dailywork/create-dailywork-dialog.component';
import { EditDailyworkDialogComponent } from './edit-dailywork/edit-dailywork-dialog.component';
import { DailyWorkDto, DailyWorkDtoPagedResultDto, DailyWorkServiceProxy } from '@shared/service-proxies/service-proxies';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';


class PagedDailyWorksRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: 'app-dailywork',
  templateUrl: './dailywork.component.html',
  animations: [appModuleAnimation()]
})
export class DailyworkComponent extends PagedListingComponentBase<DailyWorkDto>  {

  dailyWorks: DailyWorkDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  protected list(request: PagedDailyWorksRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;

    this._dailyWorkService
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
      .subscribe((result: DailyWorkDtoPagedResultDto) => {
        this.dailyWorks = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: DailyWorkDto): void {
    abp.message.confirm(
      this.l('DailyWorkDeleteWarningMessage', entity.date),
      undefined,
      (result: boolean) => {
        if (result) {
          this._dailyWorkService.delete(entity.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  constructor(
    injector: Injector,
    private _dailyWorkService: DailyWorkServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }


  createDailyWork(): void {
    this.showCreateOrEditDailyWorkDialog();
  }

  editDailyWork(dailyWork: DailyWorkDto): void {
    this.showCreateOrEditDailyWorkDialog(dailyWork.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  private showCreateOrEditDailyWorkDialog(id?: number): void {
    let showCreateOrEditDailyWorkDialog: BsModalRef;
    if (!id) {
      showCreateOrEditDailyWorkDialog = this._modalService.show(
        CreateDailyworkDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      showCreateOrEditDailyWorkDialog = this._modalService.show(
        EditDailyworkDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    showCreateOrEditDailyWorkDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
