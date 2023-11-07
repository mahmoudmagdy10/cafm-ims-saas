import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsByComponentTypeComponent } from './logs-by-component-type.component';

describe('LogsByComponentTypeComponent', () => {
  let component: LogsByComponentTypeComponent;
  let fixture: ComponentFixture<LogsByComponentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsByComponentTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsByComponentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
