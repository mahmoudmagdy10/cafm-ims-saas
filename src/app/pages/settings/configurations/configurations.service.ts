import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/layout';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  constructor(
    private http: HttpService,
    private _layoutService: LayoutService
  ) {}

  getCodeConfiguration() {
    return this.http.getData('/Code?ScreenName=configuration');
  }
  Configuration = new BehaviorSubject<any>(undefined);
  Configuration$ = this.Configuration.asObservable();
  locationList = new BehaviorSubject<any>(undefined);
  locationList$ = this.locationList.asObservable();
  getConfiguration() {
    this.Configuration.next(undefined);
    this.http.getData('/Configuration').subscribe((value) => {
      this.Configuration.next(value);
      localStorage.setItem('Configuration', JSON.stringify(value));
    });
  }

  saveConfiguration(body: any) {
    return this.http.saveData(`/Configuration`, body);
  }

  get ConfigurationStorage() {
    const config = JSON.parse(localStorage.getItem('Configuration')!);
    return config;
  }
  getLocation() {
    this.http.getData('/Location/List').subscribe((value) => {
      this.locationList.next(value);
    });
  }

  downloadBackupExcelFile(LocationId: any) {
    return this.http
      .download(
        '/CompanyLocationBackup/DownloadBackupExcelFile?LocationId=' +
          LocationId,
        {}
      )
      .pipe(tap((value) => {}));
  }

  SaveLogoImg(Img: any) {
    return this.http.saveFormDate(`/Location/S3CompanyLogo`, Img).pipe(
      tap((res: any) => {
        this._layoutService.logoPath.next(res.logoPath);
      })
    );
  }
  getEventReason(params?: any) {
    return this.http.getData('/Configuration/EventReason', params);
  }
  addReasonsData(body: any) {
    return this.http.saveDataArray('/Configuration/EventReason', body);
  }
  deleteReason(params: any) {
    return this.http.deleteDate('/Configuration/EventReason', params);
  }
}
