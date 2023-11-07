import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryForUsersWorkOnTaskFilesComponent } from './history-for-users-work-on-task-files.component';

describe('HistoryForUsersWorkOnTaskFilesComponent', () => {
  let component: HistoryForUsersWorkOnTaskFilesComponent;
  let fixture: ComponentFixture<HistoryForUsersWorkOnTaskFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryForUsersWorkOnTaskFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryForUsersWorkOnTaskFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
