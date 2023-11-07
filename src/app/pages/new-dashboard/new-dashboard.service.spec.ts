/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewDashboardService } from './new-dashboard.service';

describe('Service: NewDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewDashboardService]
    });
  });

  it('should ...', inject([NewDashboardService], (service: NewDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
