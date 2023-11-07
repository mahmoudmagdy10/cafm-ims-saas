import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventReportFieldsComponent } from './event-report-fields.component';

describe('EventReportFieldsComponent', () => {
  let component: EventReportFieldsComponent;
  let fixture: ComponentFixture<EventReportFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventReportFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventReportFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
