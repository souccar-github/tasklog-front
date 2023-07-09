import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDailyworkDialogComponent } from './edit-dailywork-dialog.component';

describe('EditDailyworkDialogComponent', () => {
  let component: EditDailyworkDialogComponent;
  let fixture: ComponentFixture<EditDailyworkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDailyworkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDailyworkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
