import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartInWorkOrderTransfarListComponent } from './spare-part-in-work-order-transfar-list.component';

describe('SparePartInWorkOrderTransfarListComponent', () => {
  let component: SparePartInWorkOrderTransfarListComponent;
  let fixture: ComponentFixture<SparePartInWorkOrderTransfarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparePartInWorkOrderTransfarListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartInWorkOrderTransfarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
