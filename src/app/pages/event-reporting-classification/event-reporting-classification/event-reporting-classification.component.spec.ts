import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventReportingClassificationComponent } from './event-reporting-classification.component';

describe('EventReportingClassificationComponent', () => {
  let component: EventReportingClassificationComponent;
  let fixture: ComponentFixture<EventReportingClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventReportingClassificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventReportingClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
