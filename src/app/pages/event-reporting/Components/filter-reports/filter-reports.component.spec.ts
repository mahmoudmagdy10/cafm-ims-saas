import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterReportsComponent } from './filter-reports.component';

describe('FilterReportsComponent', () => {
  let component: FilterReportsComponent;
  let fixture: ComponentFixture<FilterReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
