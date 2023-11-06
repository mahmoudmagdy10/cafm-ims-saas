import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayFactoryComponent } from './two-way-factory.component';

describe('TwoWayFactoryComponent', () => {
  let component: TwoWayFactoryComponent;
  let fixture: ComponentFixture<TwoWayFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoWayFactoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
