import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCloseReportComponent } from './modal-close-report.component';

describe('ModalCloseReportComponent', () => {
  let component: ModalCloseReportComponent;
  let fixture: ComponentFixture<ModalCloseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCloseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCloseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
