import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EntityDto, PhaseDto, PhaseDtoPagedResultDto, PhaseServiceProxy, ProjectDto, ProjectDtoPagedResultDto, ProjectServiceProxy, TaskDto, TaskDtoPagedResultDto, TaskServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewTaskDialogComponent } from '@app/tasks/view-task/view-task-dialog.component';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']

})
export class DragAndDropComponent implements OnInit {
  proposed: TaskDto[] = [

  ];

  active: TaskDto[] = [

  ];

  testing: TaskDto[] = [

  ];

  completed: TaskDto[] = [

  ];

  tasks: TaskDto[];
  isLoaded: boolean;

  projects: ProjectDto[] = [];
  phases: PhaseDto[] = [];

  selectedProject : any;
  selectedPhase : any;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      if (event.container.id.split('cdk-drop-list-')[1] == '0') {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.proposeTask(entityDto).subscribe(() => {
        });
      }
      else if (event.container.id.split('cdk-drop-list-')[1] == '1') {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.startTask(entityDto).subscribe(() => {
        });
      }
      else if (event.container.id.split('cdk-drop-list-')[1] == '2') {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.testTask(entityDto).subscribe(() => {
        });
      }
      else if (event.container.id.split('cdk-drop-list-')[1] == '3') {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.completeTask(entityDto).subscribe(() => {
        });
      }

    }
  }
  constructor(private _taskService: TaskServiceProxy,
    private _projectService: ProjectServiceProxy,
    private _phaseService: PhaseServiceProxy,
    private _modalService: BsModalService,
    private cdr: ChangeDetectorRef
    ) { }

  loaded: boolean = false;

  ngOnInit(): void {
    this.initialProjects();
    this.initialTasks();
    this.cdr.detectChanges();
  }

  projectChangedEvent()
  {
    console.log(this.selectedProject);
    this.phases = [];
    this.initialPhases();
  }


  refreshTasks()
  {
    this.proposed = this.proposed;
    this.active = this.active;
    this.testing = this.testing;
    this.completed = this.completed;
  }

  initialTasks() {
    this.proposed = [];
    this.active = [];
    this.testing = [];
    this.completed = [];
    this.cdr.detectChanges();
    this._taskService.getCurrentUserTasks()
    .pipe(
      finalize(() => {
        this.isLoaded = true;
        this.cdr.detectChanges();
      })
    )
    .subscribe(
      (result: TaskDto[]) => {
        this.tasks = result;
        result.forEach(element => {
          if (element.status == 0) {
            this.proposed.push(element);
          }
          else if (element.status == 1) {
            this.active.push(element);
          }
          else if (element.status == 2) {
            this.testing.push(element);
          }
          else if (element.status == 3) {
            this.completed.push(element);
          }
        })
      }
    );
  }

  initialProjects() {
    this._projectService.getAll('',0,100)
    .pipe(
      finalize(() => {
        this.isLoaded = true;
        this.cdr.detectChanges();
      })
    )
    .subscribe(
      (result: ProjectDtoPagedResultDto) => {
        this.projects = result.items;
      }
    );
  }

  
  initialPhases() {
    this._phaseService.getAll('',this.selectedProject,0,100)
    .pipe(
      finalize(() => {
        this.isLoaded = true;
        this.cdr.detectChanges();
      })
    )
    .subscribe(
      (result: PhaseDtoPagedResultDto) => {
        console.log(result);
        this.phases = result.items;
      }
    );
  }

  initialFilteredTasks()
  {
    this.proposed = [];
    this.active = [];
    this.testing = [];
    this.completed = [];
    this.cdr.detectChanges();
    this._taskService.getAll('',this.selectedPhase,0,100)
    .pipe(
      finalize(() => {
        this.isLoaded = true;
        this.cdr.detectChanges();
      })
    )
    .subscribe(
      (result: TaskDtoPagedResultDto) => {
        this.tasks = result.items;
        result.items.forEach(element => {
          if (element.status == 0) {
            this.proposed.push(element);
          }
          else if (element.status == 1) {
            this.active.push(element);
          }
          else if (element.status == 2) {
            this.testing.push(element);
          }
          else if (element.status == 3) {
            this.completed.push(element);
          }
        })
    this.cdr.detectChanges();

      }
    );
    // this.loadData();
    this.cdr.detectChanges();
  }

  private showTaskDetails(task?: TaskDto): void {
    let showCreateOnlyWithId: BsModalRef;
    showCreateOnlyWithId = this._modalService.show(
      ViewTaskDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          task: task,
        },
      }
    );
  }


  loadData() {
    this.proposed = [];
    this.active = [];
    this.testing = [];
    this.completed = [];
    this.cdr.detectChanges();
    this.tasks.forEach(element => {
      if (element.status == 0) {
        this.proposed.push(element);
      }
      else if (element.status == 1) {
        this.active.push(element);
      }
      else if (element.status == 2) {
        this.testing.push(element);
      }
      else if (element.status == 3) {
        this.completed.push(element);
      }
    })
    this.cdr.detectChanges();

  }


  dataIsLoading()
  {
    if(this.isLoaded)
    return false;
    return true;
  }


  clearFilters()
  {
    this.initialTasks()
    this.cdr.detectChanges();

  }

  Go()
  {
    this.initialFilteredTasks()
    this.cdr.detectChanges();

  }




}


