import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSelectedComponent } from './print-selected.component';

describe('PrintSelectedComponent', () => {
  let component: PrintSelectedComponent;
  let fixture: ComponentFixture<PrintSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintSelectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
