import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLogsComponent } from './filter-logs.component';

describe('FilterLogsComponent', () => {
  let component: FilterLogsComponent;
  let fixture: ComponentFixture<FilterLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
