import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTableComponent } from './work-order-table.component';

describe('WorkOrderTableComponent', () => {
  let component: WorkOrderTableComponent;
  let fixture: ComponentFixture<WorkOrderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
