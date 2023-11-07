import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWorkOrderPdfComponent } from './report-work-order-pdf.component';

describe('ReportWorkOrderPdfComponent', () => {
  let component: ReportWorkOrderPdfComponent;
  let fixture: ComponentFixture<ReportWorkOrderPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportWorkOrderPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWorkOrderPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
