import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenByLinkComponent } from './open-by-link.component';

describe('OpenByLinkComponent', () => {
  let component: OpenByLinkComponent;
  let fixture: ComponentFixture<OpenByLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenByLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenByLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
