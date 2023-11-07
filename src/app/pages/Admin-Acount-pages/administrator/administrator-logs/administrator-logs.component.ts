import { administratorService } from './../administrator.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-administrator-logs',
  templateUrl: './administrator-logs.component.html',
  styleUrls: ['./administrator-logs.component.scss'],
})
export class AdministratorLogsComponent implements OnInit {
  userLogsData: any[] = [];
  selectedPage: number = 1;
  RowCount: number;
  allDataRequest: any;
  filterData: any;
  isLoading: boolean = false;
  userId = 0;
  showFilter: boolean = false;
  showLabelsFilter: boolean = false;
  UserNameLogs: any;
  constructor(
    private route: ActivatedRoute,
    private _administratorService: administratorService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserLogsData();
    this.UserNameLogs = JSON.parse(localStorage.getItem('DataUsersLogs')!);
  }

  getUserLogsData() {
    this.userId = +this.route.snapshot.params['CompanyId'];
    this.isLoading = true;
    if (this.userId) {
      this._administratorService
        .getAdministratorLogs(this.userId)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.userLogsData = res?.Data;
          this.allDataRequest = res;
          this.cdr.detectChanges();
        });
    } else {
      this.isLoading = false; // Set loading state to false if userId is not available
    }
  }

  openFilter() {
    this.showFilter = true;
  }
  getDataLogsFilter(data: any) {
    this.userLogsData = data?.dataLogs;
    this.showLabelsFilter = true;
    this.filterData = data?.filterData;
  }
  closeFilter() {
    this.showFilter = false;
  }
  clearFilter() {
    this.showLabelsFilter = false;
    this.getUserLogsData();
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this._administratorService
      .getAdministratorLogs(
        this.userId,
        this.filterData?.Name,
        this.selectedPage,
        this.RowCount
      )
      .subscribe((res: any) => {
        this.isLoading = false;
        this.userLogsData = res?.Data;
        this.allDataRequest = res;
        this.cdr.detectChanges();
      });
  }
  changeListPage() {
    this._administratorService
      .getAdministratorLogs(
        this.userId,
        this.filterData?.Name,
        this.selectedPage,
        this.RowCount
      )
      .subscribe((res: any) => {
        this.isLoading = false;
        this.userLogsData = res?.Data;
        this.allDataRequest = res;
        this.selectedPage;
        this.cdr.detectChanges();
      });
  }
}
