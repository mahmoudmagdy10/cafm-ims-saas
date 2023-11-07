import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefualtTemplateComponent } from './defualt-template.component';

describe('DefualtTemplateComponent', () => {
  let component: DefualtTemplateComponent;
  let fixture: ComponentFixture<DefualtTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefualtTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefualtTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
