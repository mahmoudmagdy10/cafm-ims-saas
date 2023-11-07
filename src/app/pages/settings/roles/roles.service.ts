import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private http: HttpService) {}

  getUsersPermissionsMenu() {
    return this.http.getData('/UsersPermissions/Menu');
  }

  getCodeRoles() {
    return this.http.getData('/Code?ScreenName=Roles', {
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  getDataRoles() {
    return this.http.getData('/Roles/All');
  }

  addRole(body: any) {
    return this.http.saveData('/Roles', body);
  }
  deleteRoles(id: any) {
    return this.http.deleteDate(`/Roles?RoleID=${id}`);
  }
  GetDataById(id: any) {
    return this.http.getData(`/Roles?RoleID=${id}`);
  }
  saveReportsDashBorad(body: any) {
    return this.http.saveData('/Dashboard/RoleReports', body);
  }
  GetReportsDashBorad(RoleID: any) {
    return this.http.getData(`/Dashboard/RoleReports?RoleID=${RoleID}`);
  }
}
