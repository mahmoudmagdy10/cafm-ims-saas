import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToPendingComponent } from './change-to-pending.component';

describe('ChangeToPendingComponent', () => {
  let component: ChangeToPendingComponent;
  let fixture: ComponentFixture<ChangeToPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeToPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeToPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
