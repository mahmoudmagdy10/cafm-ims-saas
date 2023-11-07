import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectParentFieldComponent } from './select-parent-field.component';

describe('SelectParentFieldComponent', () => {
  let component: SelectParentFieldComponent;
  let fixture: ComponentFixture<SelectParentFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectParentFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectParentFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
