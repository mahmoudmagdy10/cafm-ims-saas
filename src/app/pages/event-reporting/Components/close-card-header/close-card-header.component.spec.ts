import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCardHeaderComponent } from './close-card-header.component';

describe('CloseCardHeaderComponent', () => {
  let component: CloseCardHeaderComponent;
  let fixture: ComponentFixture<CloseCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseCardHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
