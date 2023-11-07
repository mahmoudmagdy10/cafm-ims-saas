/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TCComponent } from './TC.component';

describe('TCComponent', () => {
  let component: TCComponent;
  let fixture: ComponentFixture<TCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
