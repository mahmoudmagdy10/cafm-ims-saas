import { TranslateService } from '@ngx-translate/core';
import { environment } from './../../../../environments/environment';
import { AuthService } from './../../../modules/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersService {
  exportDataExcel: any;
  constructor(
    private http: HttpService,
    private httpp: HttpClient,
    private auth: AuthService,
    private _translateService: TranslateService
  ) {}
  private readonly baseUrl: string = environment.baseUrl;

  getUsersByFilter(dataFilter: any) {
    return this.http.getData('/Users', {
      ...dataFilter,
      RowCount: 10,
    });
  }
  addUser(body: any) {
    return this.http.saveData('/Users', body);
  }
  getUserById(id: any, locationId: any) {
    return this.http.getData(
      `/Users?UserID=${id}&locationId=${localStorage.getItem(
        'defaultLocation'
      )}`
    );
  }
  saveImageProfile(Img: File, id: any) {
    let formData = new FormData();
    formData.append('Avatar', Img);
    formData.append('UserID', id);

    return this.httpp.post(this.baseUrl + '/UsersProfile/Avatar', formData, {
      headers: this.auth.getHeaders(),
    });
  }
  userTypeId(body: any) {
    return this.http.saveData('/Users/UsersType', body);
  }
  userStatusId(body: any) {
    return this.http.saveData('/Users/UserStatus', body);
  }
  isEmailNotification(body: any) {
    return this.http.saveData('/Users/EmailNotification', body);
  }
  sendEmail(body: any) {
    return this.http.saveData('/Users/Email', body);
  }
  sendUsersEmail(body: any) {
    return this.http.saveData('/Users/SendEmails', body);
  }

  getCodeUsers() {
    return this.http.getData('/Code', {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'Users',
    });
  }
  UsersLocationRoles(body: any) {
    return this.http.saveData('/Users/UsersLocationRoles', body);
  }

  deleteRoleLoc(UserID: any, LocationId: any, RoleId: any) {
    return this.http.deleteDate(
      `/Users/UsersLocationRoles?UserID=${UserID}&LocationId=${LocationId}&RoleId=${RoleId}`
    );
  }
  deleteUsers(UserID: any) {
    return this.http.deleteDate('/Users?UserID=' + UserID);
  }
  ChangePassword(body: any) {
    return this.http.saveData('/UsersProfile/ChangePassword', body);
  }

  // getDataForExcel(params?: any) {
  //   this.http
  //     .ExportToExcel('/Users', {
  //       ...params,
  //       RowCount: 2002153,
  //       LocationId: localStorage.getItem('defaultLocation'),
  //     })
  //     .subscribe();
  // }
  getDataForExcel(params?: any) {
    this.http
      .getData('/Vendors', {
        ...params,
        RowCount: 2002153,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.exportDataExcel = val?.Data;
        let dataForExcel: any[] = [];
        this.exportDataExcel?.forEach((item: any, index: any) => {
          dataForExcel.push({
            ['#']: index,
            [this._translateService.instant('USERS.NAME')]: item.UserId,
            [this._translateService.instant('USERS.USERSGROUPS')]:
              item.RoleName,
            [this._translateService.instant('USERS.LATEST_AUTHENTICATION')]:
              item.LocationName,
          });
        });
        this.http.downloadExcel(dataForExcel, 'Users');
      });
  }

  getUserLogs(
    userId: number,
    Name?: string,
    CurrentPage?: any,
    RowCount?: any
  ) {
    return this.http.getData(
      `/Users/UsersLog?UserID=${userId}&Name=${Name || ''}&RowCount=${
        RowCount || ''
      }&CurrentPage=${CurrentPage || ''}`
    );
  }
  saveReportsDashBorad(body: any) {
    return this.http.saveData('/Dashboard/UserReports', body);
  }
  GetReportsDashBorad(forUserId: any) {
    return this.http.getData(`/Dashboard/UserReports?forUserId=${forUserId}`);
  }
  getCodeRoles() {
    return this.http.getData('/Code?ScreenName=DashBorad', {
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
}
