import { TestBed } from '@angular/core/testing';

import { ViewDataFilterService } from './view-data-filter.service';

describe('ViewDataFilterService', () => {
  let service: ViewDataFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewDataFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
