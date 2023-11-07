import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { HttpService } from 'src/app/modules/auth/services/http.service';
@Injectable({ providedIn: 'root' })
export class administratorService {
  constructor(private http: HttpService, private httpp: HttpClient) {}
  codes$: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  filter = {};
  addCompanies(body: any) {
    return this.http.saveData('/Subscription/Companies', body);
  }
  deleteCompanies(CompanyId: any) {
    return this.http.deleteDate('/Subscription/Companies', {
      CompanyId: CompanyId,
    });
  }
  addSubscription(body: any) {
    return this.http.saveData('/Subscription/Subscription', body);
  }

  getCodeCampony() {
    return this.http.getData('/Code?ScreenName=Subscriptions');
  }

  getCompaniesByID(id: any) {
    return this.http.getData('/Subscription/Companies?CompanyId=' + id);
  }

  getSubscriptionByComID(id: any) {
    return this.http.getData('/Subscription/Subscription?CompanyId=' + id);
  }

  getSubscriptionByID(idSup: any, idCom: any) {
    return this.http.getData(
      '/Subscription/Subscription?SubscriptionId=' +
        idSup +
        '&CompanyId=' +
        idCom
    );
  }
  getCamponyByFilter(dataFilter: any) {
    return this.http.getData(
      '/Subscription/Companies?CompanyName=' +
        dataFilter.CompanyName +
        '&SubscriptionStatusId=' +
        dataFilter.SubscriptionStatusId +
        '&SubscriptionTypeId=' +
        dataFilter.SubscriptionTypeId +
        '&StartDate' +
        (dataFilter.StartDate
          ? moment(dataFilter.StartDate).format('YYYY-MM-DD')
          : '') +
        '&EndDate=' +
        (dataFilter.EndDate
          ? moment(dataFilter.EndDate).format('YYYY-MM-DD')
          : '') +
        '&ServicesID=' +
        dataFilter.ServicesID +
        '&CurrentPage=' +
        dataFilter.CurrentPage
    );
  }
  sendEmailtoAllCam(body: any) {
    return this.http.saveData('/Subscription/SendEmail', body);
  }
  StatusCam(body: any) {
    return this.http.saveData(
      `/Code/Deactivate?DeActivate=${body?.enable}&CompanyId=${body?.companyId}`,
      {}
    );
  }
  ChangePassword(body: any) {
    return this.http.saveData('/UsersProfile/ChangePassword', body);
  }
  getDataForExcel(params?: any) {
    return this.http.getData('/Subscription/Companies', {
      ...params,
      RowCount: 2002153,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }

  getTemplatesForBackup() {
    return this.http.getData('/CompanyLocationBackup/BackupTemplates');
  }
  addTemplateForBackup(body: any) {
    return this.http.saveFormDate(
      '/CompanyLocationBackup/BackupTemplates',
      body
    );
  }
  deleteTemplateForBackup(ID: any) {
    return this.http.deleteDate('/CompanyLocationBackup/BackupTemplates', {
      ID: ID,
    });
  }
  getTemplateForBackupForCompany(ID: any) {
    return this.http.getData('/CompanyLocationBackup/CompanyBackupTemplates', {
      ID: ID,
    });
  }
  addTemplateForBackupForCompany(body: any) {
    return this.http.saveData(
      '/CompanyLocationBackup/CompanyBackupTemplates',
      body
    );
  }
  deleteTemplateForBackupForCompany(ID: any) {
    return this.http.deleteDate(
      '/CompanyLocationBackup/CompanyBackupTemplates',
      {
        ID: ID,
      }
    );
  }

  getAdministratorLogs(
    CompanyId: number,
    Name?: string,
    CurrentPage?: any,
    RowCount?: any,
    LocationId?: any // Add LocationId as a parameter
  ) {
    return this.http.getData(
      `/Users/adminLogs?CompanyId=${CompanyId}&Name=${Name || ''}&RowCount=${
        RowCount || ''
      }&CurrentPage=${CurrentPage || ''}&LocationId=${LocationId || ''}` // Include LocationId in the query string
    );
  }
}
