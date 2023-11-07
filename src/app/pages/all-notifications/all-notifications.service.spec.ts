import { TestBed } from '@angular/core/testing';

import { AllNotificationsService } from './all-notifications.service';

describe('AllNotificationsService', () => {
  let service: AllNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
