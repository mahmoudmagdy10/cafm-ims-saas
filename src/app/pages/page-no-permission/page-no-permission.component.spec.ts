import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNoPermissionComponent } from './page-no-permission.component';

describe('PageNoPermissionComponent', () => {
  let component: PageNoPermissionComponent;
  let fixture: ComponentFixture<PageNoPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageNoPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNoPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
