import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraFieldsComponent } from './extra-fields.component';

describe('ExtraFieldsComponent', () => {
  let component: ExtraFieldsComponent;
  let fixture: ComponentFixture<ExtraFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
