import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAsMapComponent } from './display-as-map.component';

describe('DisplayAsMapComponent', () => {
  let component: DisplayAsMapComponent;
  let fixture: ComponentFixture<DisplayAsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayAsMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
