import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpmCostComponent } from './ppm-cost.component';

describe('PpmCostComponent', () => {
  let component: PpmCostComponent;
  let fixture: ComponentFixture<PpmCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpmCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PpmCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
