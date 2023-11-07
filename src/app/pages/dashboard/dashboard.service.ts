import { Observable, BehaviorSubject } from 'rxjs';
import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpService, private httpBackend: HttpBackend) {}
  dataDashboard = new BehaviorSubject<any>({ data: undefined, loading: false });
  dataDashboard$: Observable<any> = this.dataDashboard.asObservable();
  GetDashboard(LocationId: any) {
    this.dataDashboard.next({ data: undefined, loading: true });
    this.http
      .getData('/Dashboard', {
        LocationId: LocationId || localStorage.getItem('defaultLocation'),
      })
      .subscribe((value: any) => {
        this.dataDashboard.next({ data: value[0], loading: false });
      });
  }
  GetDashboardWorker() {
    return this.http.getData('/Dashboard/Worker');
  }
  GetUserMenuPermission() {
    const locationId = localStorage.getItem('defaultLocation') || '';
    return this.http.getData(`/UsersPermissions/MenuPermission?LocationId=${locationId}`);
  }
  changeZoom(Zoom: any) {
    this.http
      .saveDataInParam(
        '/Location/UpdateZoom',
        {
          LocationId: localStorage.getItem('defaultLocation'),
          Zoom: Zoom,
        },
        {
          'skip-interceptor': 'true',
        }
      )
      .subscribe((value: any) => {});
  }
}
