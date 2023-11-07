import { Component, Input, OnInit } from '@angular/core';
import { NewDashboardService } from '../new-dashboard.service';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/modules/auth/services/http.service';

@Component({
  selector: 'app-Table-dashboard',
  templateUrl: './Table-dashboard.component.html',
  styleUrls: ['./Table-dashboard.component.scss'],
})
export class TableDashboardComponent implements OnInit {
  loading: boolean = false;
  selectedPage = 1;
  RowCount: any = 10;
  DataTable$!: Observable<any>;
  @Input() report: any;
  DataTable = new BehaviorSubject<any>({ data: undefined, loading: false });
  DataTables$: Observable<any> = this.DataTable.asObservable();
  constructor(
    private _newDashboardService: NewDashboardService,
    private http: HttpService
  ) {}

  ngOnInit() {
    this.getDataTable(
      '/' + this.report?.ReportData[0]?.API,
      this.report?.ReportData?.[0]?.Parameters?.[0]?.LocationId,
      this.report?.ReportData?.[0]?.Parameters?.[0]?.CurrentPage
    );
    this.DataTable$ = this.DataTables$.pipe(
      tap((val) => {
      })
    );
  }
  getDataTable(api: any, LocationId: any, CurrentPage: any) {
    this.DataTable.next(false);
    this.http
      .getData(api, {
        // ...filter,
        CurrentPage: this.selectedPage,
        RowCount: this.RowCount,
        LocationId: LocationId,
      })
      .subscribe((value) => {
        this.DataTable.next(value);
      });
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this.RowCount = RowCount;
    // this.getDataTable(
    //   '/' + this.report?.ReportData[0].API,
    //   this.report?.ReportData[0]?.Parameters[0]?.LocationId,
    //   this.report?.ReportData[0]?.Parameters[0]?.CurrentPage
    // );
  }
  changePage() {
    this.selectedPage = this.selectedPage;
    this.getDataTable(
      '/' + this.report?.ReportData[0].API,
      this.report?.ReportData?.[0]?.Parameters?.[0]?.LocationId,
      this.report?.ReportData?.[0]?.Parameters?.[0]?.CurrentPage
    );
  }
}
