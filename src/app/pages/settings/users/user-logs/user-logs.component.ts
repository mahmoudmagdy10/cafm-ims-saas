import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FilterLogsComponent } from './filter-logs/filter-logs.component';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss'],
})
export class UserLogsComponent implements OnInit {
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
    private usersService: UsersService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserLogsData();
    this.UserNameLogs = JSON.parse(localStorage.getItem('DataUsersLogs')!);
  }

  getUserLogsData() {
    this.userId = +this.route.snapshot.params['userId'];
    this.isLoading = true;
    if (this.userId) {
      this.usersService.getUserLogs(this.userId).subscribe((res: any) => {
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
    this.usersService
      .getUserLogs(
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
    this.usersService
      .getUserLogs(
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
