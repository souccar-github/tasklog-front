import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectServiceProxy, UpdateProjectDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
})
export class EditProjectDialogComponent extends AppComponentBase {

  saving = false;
  project = new UpdateProjectDto();
  @Output() onSave = new EventEmitter<any>();
  id: number;
  constructor(
    injector: Injector,
    private _projectService : ProjectServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._projectService.getForEdit(this.id).subscribe((result: UpdateProjectDto) => {
      this.project = result;
    });
  }
  save(): void {
    this.saving = true;

    this._projectService.update(this.project).subscribe(
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
