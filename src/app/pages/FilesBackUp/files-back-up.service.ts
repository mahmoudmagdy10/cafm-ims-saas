import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilesBackupService {
  constructor(private http: HttpService) {}

  getFilesBackup(LocationId: any) {
    return this.http.getData(
      '/CompanyLocationBackup/CompanyLocationBackupExcelFile',
      {
        LocationId: LocationId,
      }
    );
  }

  GetLocation() {
    return this.http.getData('/Location');
  }
}
