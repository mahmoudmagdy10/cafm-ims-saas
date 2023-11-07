import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterForPrintPdfComponent } from './filter-for-print-pdf.component';

describe('FilterForPrintPdfComponent', () => {
  let component: FilterForPrintPdfComponent;
  let fixture: ComponentFixture<FilterForPrintPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterForPrintPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterForPrintPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
