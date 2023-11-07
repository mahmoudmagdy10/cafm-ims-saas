import { DashboardRolesComponent } from './dashboard-roles/dashboard-roles.component';
import { AuthService } from './../../../modules/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Observable } from 'rxjs';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { RolesService } from './roles.service';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DashboardService } from '../../dashboard/dashboard.service';
import { HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  providers: [MessageService],
})
export class RolesComponent implements OnInit, OnDestroy {
  codes$: Observable<any>;
  dataMenuPer: any;
  dataRoles: any[] = [];
  DataById: any;
  IDRoleSelected: any;
  permIDByID: number[] = [];
  IsEditName: boolean = true;
  loading: boolean = false;
  loadingPer: boolean = false;
  deleteRolesId: any;
  deleteRolesIdIndex: any;
  interval: any;
  searchPer = '';
  lang = 'en';
  @ViewChild('rolesContainer') rolesContainer: ElementRef;
  subscription: Subscription;
  indexRolesEditName: number = 0;
  isDisabledInputName: boolean = false;
  constructor(
    private service: RolesService,
    private toastr: ToastrService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    public dialog: MatDialog
  ) {
    this.lang = localStorage.getItem('language') || 'en';
  }

  ngOnInit() {
    this.getUsersPermissionsMenu();
    this.getDataRoles();
    this.codes$ = this.service.getCodeRoles();
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.indexRolesEditName = 0;
          this.getDataRoles();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.indexRolesEditName = 0;

        this.getDataRoles();
      }
    });
  }

  getUsersPermissionsMenu() {
    this.service.getUsersPermissionsMenu().subscribe((data) => {
      this.dataMenuPer = data;
      this.cdr.detectChanges();
    });
  }
  getDataRoles(checkedLastRole?: boolean) {
    this.loading = true;
    this.service.getDataRoles().subscribe((data) => {
      this.dataRoles = data;
      this.loading = false;
      this.loadingPer = false;
      if (!checkedLastRole) {
        this.GetDataById(this.dataRoles[0].RoleId, this.dataRoles[0].RoleName);
        this.dataRoles[0].checked = true;
        this.readOnlyCheak(this.dataRoles[0].RoleStatus);
      } else {
        this.indexRolesEditName = this.dataRoles.length - 1;
        this.GetDataById(
          this.dataRoles[this.dataRoles.length - 1].RoleId,
          this.dataRoles[this.dataRoles.length - 1].RoleName
        );
        this.dataRoles[this.dataRoles.length - 1].checked = true;
        this.readOnlyCheak(
          this.dataRoles[this.dataRoles.length - 1].RoleStatus
        );
        setTimeout(() => {
          this.rolesContainer.nativeElement.scrollTop =
            this.rolesContainer.nativeElement.scrollHeight;
        }, 1000);

        this.cdr.detectChanges();
      }
      this.cdr.detectChanges();
    });
  }

  onAddRole() {
    const body = {
      roleId: 0,
      roleName: 'مجموعة المستخدمين جديد',
      roleNameEn: 'new role',
      roleStatus: 0,
      forAll: 1,
      forAdmin: 0,
      permissionID: '',
    };
    this.service.addRole(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.getDataRoles(true);

          this.cdr.detectChanges();
        } else {
        }
      },
      (err) => {}
    );
  }
  deleteRoles() {
    this.service.deleteRoles(this.deleteRolesId).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.dataRoles.splice(this.deleteRolesIdIndex, 1);
          this.GetDataById(
            this.dataRoles[0].RoleId,
            this.dataRoles[0].RoleName
          );
          this.dataRoles[0].checked = true;

          this.cdr.detectChanges();
          this.rolesContainer.nativeElement.scrollTop = 0;
        } else {
        }
      },
      (err) => {}
    );
  }
  GetDataById(id: any, name: string) {
    this.loadingPer = true;
    this.dataRoles.forEach((element: any) => {
      element.checked = false;
    });
    if (this.dataMenuPer) {
      this.dataMenuPer?.forEach((item: any, index: any) => {
        item.showMore = true;
        item?.Permissions?.forEach((element: any, indexP: any) => {
          element.checked = false;
        });
      });
    }

    this.permIDByID = [];
    this.IDRoleSelected = id;
    this.service.GetDataById(id).subscribe((Data) => {
      this.DataById = Data;
      Data?.forEach((value: any) => {
        if (value.Checked == 1) {
          this.permIDByID.push(value.PermissionId);
          this.dataMenuPer.forEach((item: any, index: any) => {
            item.showMore = true;

            item?.Permissions?.forEach((element: any, indexP: any) => {
              if (element.PermissionId == value.PermissionId) {
                element.checked = true;
              }
            });
          });
        }
      });
      this.loadingPer = false;
      this.cdr.detectChanges();
    });
  }
  readOnlyCheak(status: boolean) {
    if (status) {
      this.isDisabledInputName = true;
    } else {
      this.isDisabledInputName = false;
    }
  }
  autoEditPer(isEditName?: any) {
    if (this.DataById) {
      if (isEditName) {
        if (this.IsEditName) {
          if (this.dataRoles[this.indexRolesEditName]?.RoleName?.trim() != '') {
            const body = {
              roleId: this.IDRoleSelected,
              roleName:
                document.dir == 'rtl'
                  ? this.dataRoles[this.indexRolesEditName].RoleName
                  : this.dataRoles[this.indexRolesEditName]?.RoleNameAr,
              roleNameEn:
                document.dir == 'ltr'
                  ? this.dataRoles[this.indexRolesEditName].RoleName
                  : this.dataRoles[this.indexRolesEditName]?.RoleNameEn,

              roleStatus: 0,
              forAll: 1,
              forAdmin: 0,
              permissionID: this.permIDByID.join(','),
            };
            this.service.addRole(body).subscribe(
              (res: any) => {
                if (res.rv > 0) {
                  // this.toastr.success();

                  // this.getDataRoles(false,true);

                  this.cdr.detectChanges();
                } else {
                }
              },
              (err) => {}
            );
          } else {
            this.toastr.error('can`t be empty');
          }
        }
      } else {
        const body = {
          roleId: this.IDRoleSelected,
          roleName:
            document.dir == 'rtl'
              ? this.dataRoles[this.indexRolesEditName].RoleName
              : this.dataRoles[this.indexRolesEditName]?.RoleNameAr,
          roleNameEn:
            document.dir == 'ltr'
              ? this.dataRoles[this.indexRolesEditName].RoleName
              : this.dataRoles[this.indexRolesEditName]?.RoleNameEn,
          roleStatus: 0,
          forAll: 1,
          forAdmin: 0,
          permissionID: this.permIDByID.join(','),
        };
        this.service.addRole(body).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              // this.toastr.success();

              // this.getDataRoles(false,true);

              this.cdr.detectChanges();
            } else {
            }
          },
          (err) => {}
        );
      }
    }
  }
  autoChecked(event: any, item: any, GroupPermission?: any) {
    console.log(event);
    console.log(item);
    console.log(GroupPermission);

    const editWorkOrderItems = [49, 50, 51, 52, 56, 57, 59, 60, 61];

    if (
      editWorkOrderItems.includes(item.PermissionId) &&
      event.target.checked == true
    ) {
      GroupPermission.find(
        (permission: any) => permission.PermissionId == 55
      ).checked = true;
      this.permIDByID.push(55);
    }

    if (item.PermissionId == 55 && event.target.checked == false) {
      this.permIDByID = this.permIDByID.filter(
        (item) => !editWorkOrderItems.includes(item)
      );
      GroupPermission.forEach((permission: any) => {
        if (editWorkOrderItems.includes(permission.PermissionId)) {
          GroupPermission.find(
            (per: any) => per.PermissionId == permission.PermissionId
          ).checked = false;
        }
      });
    }

    if (event.target.checked == true) {
      if (item?.PermissionId == '98') {
        GroupPermission[2].checked = true;
        this.permIDByID.push(GroupPermission[2]?.PermissionId);
      }
      GroupPermission[0].checked = true;
      this.permIDByID.push(GroupPermission[0]?.PermissionId);
      this.permIDByID.push(item.PermissionId);
    } else {
      if (GroupPermission[0].checked == false) {
        GroupPermission.forEach((element: any) => {
          element.checked = false;
          this.permIDByID.forEach((value, index) => {
            if (value == element.PermissionId) {
              this.permIDByID.splice(index, 1);
            }
          });
        });
      }
      // if(item?.PermissionId=='98'){
      //   GroupPermission[2].checked = false;
      //   this.permIDByID.forEach((value, index) => {
      //     if (value == GroupPermission[2].PermissionId) {
      //       this.permIDByID.splice(index, 1);
      //     }
      //   });
      // }
      this.permIDByID.forEach((value, index) => {
        if (value == item.PermissionId) {
          this.permIDByID.splice(index, 1);
        }
      });
    }
    // if (this.IsEdit) {

    this.autoEditPer();

    // }
  }
  CopyRole(item: any) {
    this.permIDByID = [];
    this.dataMenuPer.forEach((value: any, index: any) => {
      this.dataMenuPer[index].checked = false;
    });
    this.service.GetDataById(item.RoleId).subscribe((Data) => {
      this.DataById = Data;
      Data?.forEach((value: any) => {
        if (value.Checked == 1) {
          this.permIDByID.push(value.PermissionId);
          this.dataMenuPer.forEach((item: any, index: any) => {
            if (item.PermissionId == value.PermissionId) {
              this.dataMenuPer[index].checked = true;
            }
          });
        }
      });
      const body = {
        ...item,
        RoleId: 0,
        RoleName: item.RoleName,
        RoleNameEn: 'new role',
        permissionID: this.permIDByID.join(','),
      };
      this.service.addRole(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.getDataRoles(true);
            this.cdr.detectChanges();
          } else {
          }
        },
        (err) => {}
      );
    });
  }
  cheakAllPerCat(event: any, item: any) {
    if (event.target.checked) {
      if (item.Permissions) {
        item?.Permissions?.forEach((element: any) => {
          if (!element.checked) {
            element.checked = true;
            this.permIDByID.push(element.PermissionId);
          }
        });
        this.autoEditPer();
      }
    } else {
      if (item.Permissions) {
        item.Permissions.forEach((element: any) => {
          if (element.checked) {
            element.checked = false;
            this.permIDByID.forEach((value, index) => {
              if (value == element.PermissionId) {
                this.permIDByID.splice(index, 1);
              }
            });
          }
        });
        this.autoEditPer();
      }
    }
  }

  fetchMenuItems() {
    this.dashboardService.GetUserMenuPermission().subscribe(
      (res: any) => {
        let userMenu = res?.[0]?.UserMenu;
        localStorage.setItem('userMenu', JSON.stringify(userMenu));
      },
      (error: any) => {
        console.error('Error fetching menu items:', error);
      }
    );
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.altKey) {
      this.isDisabledInputName = false;
    }
  }
  ngOnDestroy() {
    this.fetchMenuItems();
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  openDashboard(item: any) {
    const dialogRef = this.dialog.open(DashboardRolesComponent, {
      width: '30vw',
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
