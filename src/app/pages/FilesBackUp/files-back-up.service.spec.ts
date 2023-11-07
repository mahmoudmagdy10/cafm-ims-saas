import { TestBed } from '@angular/core/testing';

import { FilesBackupService } from './files-back-up.service';

describe('FilesBackupService', () => {
  let service: FilesBackupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesBackupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
