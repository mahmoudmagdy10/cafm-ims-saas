import { BehaviorSubject } from 'rxjs';
import { HttpService } from './../../../../modules/auth/services/http.service';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  constructor(private http: HttpService) {}
  noInternetConnection = new BehaviorSubject(false);
  noInternetConnection$ = this.noInternetConnection.asObservable();

  RefreshDuration(body: any) {
    return this.http.saveData(`/UsersProfile/RefreshDuration`, body);
  }
  changeLocation(body: any) {
    return this.http.saveData(`/UsersProfile/DefaultLocation`, body);
  }
  checkIsSiteManager(Email: string, LocationId: any) {
    return this.http.getData(`/Users/ISUMger?Email=${Email}&LocationId=${LocationId}`);
  }
}
