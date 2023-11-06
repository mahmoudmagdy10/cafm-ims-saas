import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryForUsersWorkOnTaskComponent } from './history-for-users-work-on-task.component';

describe('HistoryForUsersWorkOnTaskComponent', () => {
  let component: HistoryForUsersWorkOnTaskComponent;
  let fixture: ComponentFixture<HistoryForUsersWorkOnTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryForUsersWorkOnTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryForUsersWorkOnTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
