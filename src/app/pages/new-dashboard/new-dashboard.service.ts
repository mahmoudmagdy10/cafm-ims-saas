import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Injectable({
  providedIn: 'root',
})
export class NewDashboardService {
  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService
  ) {}
  dataDashboard = new BehaviorSubject<any>({ data: undefined, loading: false });
  dataDashboard$: Observable<any> = this.dataDashboard.asObservable();

  GetDashboard(parms?: any, LocationId?: number, forUserId?: number) {
    this.dataDashboard.next({ data: undefined, loading: true });
    this.http
      .getData('/Dashboard/UserDashBorad', {
        ...this.viewDataFilterService.datafilterModel?.dashboard?.dataFilter
          ?.params,
        ...parms,
        LocationId: LocationId || localStorage.getItem('defaultLocation'),
        forUserId: forUserId || localStorage.getItem('userID'), // Use 'forUserId' here
      })
      .subscribe((value: any) => {
        this.dataDashboard.next({ data: value, loading: false });
      });
  }
  UsersTeamReports(body: any) {
    return this.http.saveData('/Dashboard/UsersTeamReports', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  getUsersTeamReports(body: any) {
    return this.http.getData('/Dashboard/UsersTeamReports', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  // selectedPage = 1;
  // RowCount: any = 10;
  // DataTable = new BehaviorSubject<any>({ data: undefined, loading: false });
  // DataTable$: Observable<any> = this.DataTable.asObservable();
  // getDataTable(api: any, LocationId: any, CurrentPage: any) {
  //   this.DataTable.next(false);
  //   this.http
  //     .getData(api, {
  //       // ...filter,
  //       CurrentPage: this.selectedPage,
  //       RowCount: this.RowCount,
  //       LocationId: LocationId,
  //     })
  //     .subscribe((value) => {
  //       this.DataTable.next(value);
  //     });
  // }
}
