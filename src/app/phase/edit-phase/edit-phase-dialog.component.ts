import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PhaseServiceProxy, UpdatePhaseDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-phase-dialog',
  templateUrl: './edit-phase-dialog.component.html',
})
export class EditPhaseDialogComponent extends AppComponentBase {

  saving = false;
  phase = new UpdatePhaseDto();

  constructor(
    injector: Injector,
    private _phaseService : PhaseServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit():void{
    this._phaseService.getForEdit(this.id).subscribe((result: UpdatePhaseDto) => {
      this.phase = result;
    });
  }

  @Output() onSave = new EventEmitter<any>();
  id: number;
  projectId:number;

  save(): void {
    this.saving = true;
    this.phase.projectId = this.projectId;
    this._phaseService.update(this.phase).subscribe(
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
