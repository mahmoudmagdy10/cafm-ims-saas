import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderCostComponent } from './workorder-cost.component';

describe('WorkorderCostComponent', () => {
  let component: WorkorderCostComponent;
  let fixture: ComponentFixture<WorkorderCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
