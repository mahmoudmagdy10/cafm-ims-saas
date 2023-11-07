import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalTemplateComponent } from './vertical-template.component';

describe('VerticalTemplateComponent', () => {
  let component: VerticalTemplateComponent;
  let fixture: ComponentFixture<VerticalTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
