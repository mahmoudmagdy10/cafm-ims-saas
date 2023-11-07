import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonsModalComponent } from './reasons-modal.component';

describe('ReasonsModalComponent', () => {
  let component: ReasonsModalComponent;
  let fixture: ComponentFixture<ReasonsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
