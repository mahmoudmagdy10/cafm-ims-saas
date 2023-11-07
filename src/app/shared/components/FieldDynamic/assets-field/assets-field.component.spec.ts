import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsFieldComponent } from './assets-field.component';

describe('AssetsFieldComponent', () => {
  let component: AssetsFieldComponent;
  let fixture: ComponentFixture<AssetsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
