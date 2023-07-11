import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, ProjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
})
export default class CreateProjectDialogComponent extends AppComponentBase {

  saving = false;
  project = new CreateProjectDto();

  constructor(
    injector: Injector,
    public _projectService: ProjectServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  @Output() onSave = new EventEmitter<any>();


  save(): void {

    this.saving = true;


    this._projectService.create(this.project).subscribe(
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
