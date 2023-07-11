import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreatePhaseDto, PhaseServiceProxy, ProjectDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-phase-dialog',
  templateUrl: './create-phase-dialog.component.html',
})
export class CreatePhaseDialogComponent extends AppComponentBase {


  saving = false;
  phase = new CreatePhaseDto();

  constructor(
    injector: Injector,
    private _phaseService : PhaseServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();
  id: number;

  ngOnInit(): void {
    console.log(this.id);

  }

  save(): void {

    this.saving = true;
    console.log(this.id);
    this.phase.projectId = this.id;
    this._phaseService.create(this.phase).subscribe(
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
