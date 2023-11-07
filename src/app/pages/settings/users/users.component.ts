import { environment } from 'src/environments/environment';
import { AuthService } from './../../../modules/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { modal3Component } from './Dailogs/modal3/modal3.component';
import { modal1Component } from './Dailogs/modal1/modal1.component';
import { modal2Component } from './Dailogs/modal2/modal2.component';
import { AddUserComponent } from './Dailogs/modalAddUser/modalAddUser.component';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/api';
import { UsersService } from './users.service';
import { FilterUserComponent } from './Dailogs/FilterModule/FilterModule.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DashboardRolesComponent } from '../roles/dashboard-roles/dashboard-roles.component';
import { DashboardUsersComponent } from './Dailogs/dashboard-users/dashboard-users.component';

@Component({
  selector: 'users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.scss'],
  styles: [
    `
      table {
        width: 100%;
      }
    `,
  ],
})
export class usersComponent implements OnInit, OnDestroy {
  msgs: Message[] = [];
  position: string;
  display: boolean = false;
  isFilter: boolean = false;
  displayModal: boolean;
  items: MenuItem[];
  interval: any;
  displaymodal1: boolean = false;
  displaymodal2: boolean = false;
  displaymodal3: boolean = false;
  displaymodal4: boolean = false;
  displaymodal5: boolean = false;
  loadingDataUser: boolean = false;
  displaymodalFilter: boolean = false;
  showLabelsFilter: boolean = false;
  displaymodalSendEmailUser: boolean = false;
  dataSource: any[] = [];
  UserCheckedId: any[] = [];
  userId: any;
  dataUser: any;
  selectedPage = 1;
  displayedColumns: string[] = ['#', 'Name', 'Roles', 'Actions'];
  formCheckRoles = new UntypedFormGroup({});
  listPagination: any[] = [];
  codes: any;
  FiltersSearch: any = {
    Name: '',
    RoleId: '',
    LocationId: '',
    RoleName: '',
    LocationName: '',
    StatusId: '',
    StatusName: '',
    UserName: '',
    CurrentPage: 1,
  };
  UserIdDeleted: any;
  @ViewChild('FilterUserComponent', { static: true })
  FilterUserComponent: FilterUserComponent;
  @ViewChild('AddUser', { static: true })
  AddUser: AddUserComponent;
  @ViewChild('locRolModal', { static: true })
  locRolModal: modal2Component;
  @ViewChild('modal1', { static: true })
  modal1Component: modal1Component;
  @ViewChild('modal3', { static: true })
  modal3: modal3Component;
  subscription: Subscription;
  userIdChangePass: any;
  EmailUser: any;
  CollapsAll: boolean = false;
  DataSetting: any;
  Avatar = environment.Avatar;
  floatsltr: boolean = false;
  floatsrtl: boolean = false;
  isSuperAdmin: boolean = false;
  constructor(
    private auth: AuthService,
    private confirmationService: ConfirmationService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isCheckSuperUser();
    // if (this.dataSource.length == 1) {
    //   console.log(' this.dataSource', this.dataSource);

    //   this.showLabelsFilter = true;
    //   // this.FiltersSearch.patchValue()
    // }
    // this.usersService.getUsersByFilter(this.FiltersSearch).subscribe((val) => {
    //   console.log('valval', val);
    //   console.log('usersService', val);
    //   console.log('usersService', val?.Data.length);
    //   if (val?.Data.length == 1) {
    //     this.showLabelsFilter = true;
    //     this.FiltersSearch.patchValue(val?.Data);
    //   }
    // });
    if (document.dir == 'rtl') {
      this.floatsrtl = true;
    } else {
      this.floatsltr = true;
    }
    this.FiltersSearch = {
      ...this.FiltersSearch,
      ...this.route.snapshot.queryParams,
    };
    this.usersService.getCodeUsers().subscribe((value) => {
      this.codes = value;
    });

    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.getUsers();
        }, +TimerRefresh);
      } else if (TimerRefresh == 'now') {
        this.getUsers();
      }
    });

    this.getUsers();

    //   this.items = [
    //     {label: 'Update', icon: 'pi pi-refresh', command: () => {}},
    //     {label: 'Delete', icon: 'pi pi-times', command: () => {
    //         // this.delete();
    //     }},
    //     {label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io'},
    //     {separator: true},
    //     {label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup']}
    // ];
  }

  isRolesShow = true;
  showDialogAddUser() {
    this.display = true;
  }
  hidDialogAddUser() {
    this.display = false;
    this.getUsers();
  }
  showmodal1(dataUser: any, status?: number) {
    this.dataUser = dataUser;
    if (status == 1) {
      setTimeout(() => {
        this.modal1Component.ChangeStatus(true);
      }, 500);
    } else {
      this.displaymodal1 = true;
    }
  }
  showmodal2(dataUser: any) {
    this.dataUser = dataUser;
    this.displaymodal2 = true;
  }
  showmodal3(dataUser: any, status?: boolean) {
    this.dataUser = dataUser;
    if (status == false) {
      setTimeout(() => {
        this.modal3.ChangeStatus(true);
      }, 500);
    } else {
      this.displaymodal3 = true;
    }
  }
  showmodal4(userID: any) {
    this.displaymodal4 = true;
    this.userIdChangePass = userID;
  }
  showmodal5(id: any) {
    this.userId = id;
    this.displaymodal5 = true;
  }
  hidmodal5() {
    this.displaymodal5 = false;
    this.userId = null;
    this.getUsers();
  }
  hidmodal2() {
    this.displaymodal2 = false;

    this.getUsers();
  }
  hidmodal1(event: boolean) {
    this.displaymodal1 = false;
    if (event) {
      this.getUsers();
    }
  }
  hidmodal3() {
    this.displaymodal3 = false;
    this.getUsers();
  }
  toggleRoles() {
    this.isRolesShow = !this.isRolesShow;
  }

  getUsers() {
    this.loadingDataUser = true;
    if (
      this.isFilter &&
      (this.FiltersSearch.RoleId ||
        this.FiltersSearch.LocationId ||
        this.FiltersSearch.StatusId ||
        this.FiltersSearch.Name)
    ) {
      this.FiltersSearch.CurrentPage = 1;
    }
    if (this.FiltersSearch.StatusId == 2) {
      this.FiltersSearch.IsActiveUser = true;
    }
    if (this.FiltersSearch.StatusId == 23) {
      this.FiltersSearch.IsActiveUser = false;
    }
    if (this.FiltersSearch.StatusId == null) {
      this.FiltersSearch.IsActiveUser = null;
    }
    this.usersService.getUsersByFilter(this.FiltersSearch).subscribe((Data) => {
      let showLabelsFilterInUser = Data?.Data[0];
      if (Data?.Data.length == 1) {
        this.showLabelsFilter = true;
        // this.FiltersSearch.UserName = Data?.Data?.[0]?.UserName;
        // this.FiltersSearch.get('UserName')?.patchValue(
        //   Data?.Data?.[0]?.UserName
        // );

      }
      this.dataSource = Data.Data;
      Data.Data.forEach((item: any) => {
        this.formCheckRoles.removeControl(`item-${item.UserId}`);
        this.formCheckRoles.addControl(
          `item-${item.UserId}`,
          new UntypedFormControl(false)
        );
      });
      this.listPagination = [];
      this.DataSetting = Data.Setting[0];
      var i = 1;
      for (; i <= Data.Setting[0].TotalPage; i++) {
        this.listPagination.push(i);
      }

      this.loadingDataUser = false;
      this.cdr.detectChanges();
      this.CollapsAll = false;
    });
  }
  CheckUser(event: any, item: any) {
    if (event.target.checked == true) {
      this.UserCheckedId.push(item.UserId);
    } else {
      this.UserCheckedId.forEach((value, index) => {
        if (value == item.UserId) {
          this.UserCheckedId.splice(index, 1);
        }
      });
    }
  }
  checkAllorunCheck(event: any) {
    if (event.target.checked == true) {
      this.dataSource.forEach((value) => {
        value.checked = true;
        this.UserCheckedId.push(value.UserId);
      });
    } else {
      this.dataSource.forEach((value) => {
        value.checked = false;
      });
      this.UserCheckedId = [];
    }
  }
  confirm(element: any) {
    this.confirmationService.confirm({
      message: 'التبديل لتفعيل تلقي إشعارات البريد الإلكتروني أم لا?',
      acceptLabel: ' ',
      rejectLabel: ' ',
      accept: () => {
        this.usersService
          .isEmailNotification({
            isEmailNotification: !element.IsEmailNotification,
            userId: element.UserId,
          })
          .subscribe((res: any) => {
            if (res.rv > 0) {
              this.getUsers();
            } else {
            }
          });
        //Actual logic to perform a confirmation
      },
    });
  }
  confirmChangeStatus(element: any) {
    this.confirmationService.confirm({
      message: 'التبديل إذا كان المستخدم نشطًا أم لا?',
      acceptLabel: ' ',
      rejectLabel: ' ',
      accept: () => {
        //Actual logic to perform a confirmation
      },
    });
  }
  collaps(item?: any) {
    if (!this.formCheckRoles.get(`item-${item.UserId}`)?.value) {
      this.formCheckRoles.get(`item-${item.UserId}`)?.setValue(true);
    } else {
      this.formCheckRoles.get(`item-${item.UserId}`)?.setValue(false);
    }
  }
  collapsAll() {
    this.CollapsAll = !this.CollapsAll;
    this.dataSource.forEach((item) => {
      this.formCheckRoles.get(`item-${item.UserId}`)?.setValue(this.CollapsAll);
    });
  }
  deleteRoleLoc(UserID: any, LocationId: any, RoleId: any) {
    this.usersService
      .deleteRoleLoc(UserID, LocationId, RoleId)
      .subscribe((res: any) => {
        if (res.rv > 0) {
          this.getUsers();
        } else {
        }
      });
  }
  selectPage(PageCount: any) {
    if (PageCount == 'next') {
      this.selectedPage = this.selectedPage + 1;
    } else if (PageCount == 'back') {
      this.selectedPage = this.selectedPage - 1;
    } else if (PageCount == 'backAll') {
      this.selectedPage = 1;
    } else if (PageCount == 'nextAll') {
      this.selectedPage = this.listPagination.length;
    } else {
      this.selectedPage = PageCount;
    }
    this.FiltersSearch.CurrentPage = this.selectedPage;
    this.getUsers();
    // this.isFilter = false;
  }
  openFilter() {
    this.displaymodalFilter = true;
  }
  afterSearch(Filters: any) {
    if (
      Filters.LocationId == '' &&
      Filters.LocationName == '' &&
      Filters.Name == '' &&
      Filters.RoleId == '' &&
      Filters.RoleName == '' &&
      Filters.StatusId == '' &&
      Filters.StatusName == ''
    ) {
      this.showLabelsFilter = false;
    } else {
      this.showLabelsFilter = true;
    }
    this.FiltersSearch = {
      ...this.FiltersSearch,
      ...Filters,
    };
    this.getUsers();
    this.displaymodalFilter = false;
  }
  clearFilter() {
    this.FiltersSearch.IsActiveUser = null;

    this.clearQueryParams();
    this.FiltersSearch.UserID = null;
    this.FilterUserComponent.clearFilter();
    this.FilterUserComponent.onSearch();
    this.showLabelsFilter = false;
  }
  deleteUsers() {
    // this.loadingDataUser = true
    this.usersService.deleteUsers(this.UserIdDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          // this.getUsers();
          this.dataSource.forEach((element, index) => {
            if (element.UserId == this.UserIdDeleted) {
              this.dataSource.splice(index, 1);
            }
          });
        } else {
          // this.loadingDataUser = false
        }
      },
      (err) => {}
    );
  }

  deleteUsersChecked() {
    // this.loadingDataUser = true
    this.usersService.deleteUsers(this.UserCheckedId.join(',')).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.getUsers();
        } else {
        }
      },
      (err) => {}
    );
  }
  showModalSendEmail() {
    this.displaymodalSendEmailUser = true;
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  export() {
    this.usersService.getDataForExcel();
  }
  clearQueryParams() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: { UserID: null },
    });
  }

  handleClickFilter(filtered: boolean) {
    this.isFilter = filtered;
    this.selectedPage = 1;
  }
  isCheckSuperUser() {
    this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperUser') || '');
  }
  openUsersLogs(item: any) {
    localStorage.setItem('DataUsersLogs', JSON.stringify(item));
    window.open('/settings/users/userLog/' + item?.UserId, '_blank');
  }
  openDashboard(item: any) {
    const dialogRef = this.dialog.open(DashboardUsersComponent, {
      width: '50vw',
      data: {
        data: item,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }
}
