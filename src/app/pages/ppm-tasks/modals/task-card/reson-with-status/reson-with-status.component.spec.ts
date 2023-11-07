import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResonWithStatusComponent } from './reson-with-status.component';

describe('ResonWithStatusComponent', () => {
  let component: ResonWithStatusComponent;
  let fixture: ComponentFixture<ResonWithStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResonWithStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResonWithStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
