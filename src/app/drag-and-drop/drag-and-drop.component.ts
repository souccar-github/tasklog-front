import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { EntityDto, TaskDto, TaskServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {
  proposed : TaskDto[] = [

  ];

  active = [

  ];

  testing = [

  ];

  completed = [

  ];

  tasks : TaskDto[];
  isLoaded : boolean;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      if(event.container.id.split('cdk-drop-list-')[1] == '0')
      {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.proposeTask(entityDto).subscribe(() => {
        });
      }
      else if(event.container.id.split('cdk-drop-list-')[1] == '1')
      {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.startTask(entityDto).subscribe(() => {
        });
      }
      else if(event.container.id.split('cdk-drop-list-')[1] == '2')
      {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.testTask(entityDto).subscribe(() => {
        });
      }
      else if(event.container.id.split('cdk-drop-list-')[1] == '3')
      {
        let entityDto = new EntityDto();
        entityDto.id = event.container.data[event.currentIndex]['id'];
        this._taskService.completeTask(entityDto).subscribe(() => {
        });
      }
      
    }
  }
  constructor(private _taskService: TaskServiceProxy) { }

  loaded : boolean = false;

   ngOnInit(): void {
    // await this._taskService.getCurrentUserTasks()
    // .subscribe((result : TaskDto[]) => {
      
    //   result.forEach(element => {
    //     if(element.status == 0)
    //     {
    //       this.proposed.push(element);
    //     }
    //     else if(element.status == 1)
    //     {
    //       this.active.push(element.title);
    //     }
    //     else if(element.status == 2)
    //     {
    //       this.testing.push(element.title);
    //     }
    //     else if(element.status == 3)
    //     {
    //       this.completed.push(element.title);

    //     }
    //   });
    //   this.tasks = result;
    //   this.isLoaded = true;
    // });


    this.isLoaded = false;
    this._taskService.getCurrentUserTasks().subscribe({
      next : (result : TaskDto[]) => {
        this.tasks = result;
        result.forEach(element => {
              if(element.status == 0)
              {
                this.proposed.push(element);
              }
              else if(element.status == 1)
              {
                this.active.push(element);
              }
              else if(element.status == 2)
              {
                this.testing.push(element);
              }
              else if(element.status == 3)
              {
                this.completed.push(element);
              }
      })
    },
    complete: () => {
      this.isLoaded = true;
    }
    }
    );
  }


  loadData()
  {
    this.proposed = [];
    this.active = [];
    this.testing = [];
    this.completed = [];
    this.tasks.forEach(element => {
      if(element.status == 0)
      {
        this.proposed.push(element);
      }
      else if(element.status == 1)
      {
        this.active.push(element);
      }
      else if(element.status == 2)
      {
        this.testing.push(element);
      }
      else if(element.status == 3)
      {
        this.completed.push(element);
      }
})
  }

}


