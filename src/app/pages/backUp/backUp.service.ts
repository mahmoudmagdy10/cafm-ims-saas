import { tap } from 'rxjs/operators';
import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class BackupService {
  constructor(private http: HttpService) {}
  getAllTemplates() {
    return this.http.getData('/CompanyLocationBackup/BackupTemplates');
  }
  getAllTemplatesSelected() {
    return this.http.getData('/CompanyLocationBackup/CompanyBackupTemplates');
  }
  deleteTemplateSelected(ID: any) {
    return this.http.deleteDate(
      '/CompanyLocationBackup/CompanyBackupTemplates',
      { ID: ID }
    );
  }
  addTemplateForBackup(TemplateId: any) {
    return this.http.saveFormDate(
      '/CompanyLocationBackup/CompanyBackupTemplates',
      { TemplateId: TemplateId }
    );
  }

  addBackupConfig(body: any) {
    return this.http.saveFormDate('/CompanyLocationBackup/BackupConfig', body);
  }
  getBackupConfig() {
    return this.http.getData('/CompanyLocationBackup/BackupConfig');
  }
  downloadBackupExcelFile(LocationId: any) {

    return this.http.download(
      '/CompanyLocationBackup/DownloadBackupExcelFile?LocationId=' + LocationId,
      {}
    ).pipe(tap(value=>{

    }))
  }
  deleteBackupConfig(ID: any) {
    return this.http.deleteDate('/CompanyLocationBackup/BackupConfig', {
      ID: ID,
    });
  }
  GetLocation() {
    return this.http.getData('/Location');
  }
}
