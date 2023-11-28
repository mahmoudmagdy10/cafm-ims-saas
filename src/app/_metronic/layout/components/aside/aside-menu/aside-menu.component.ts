import { AuthService } from './../../../../../modules/auth/services/auth.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { AsideMenuService } from 'src/app/services/aside-menu.service';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  userMenu: any = undefined;
  showUserGroup: boolean = false;
  isSuperUser: any;
  showSoftService = false;
  softServicesOnLocation: any[]= [];
  softServiceChangedSubscription: Subscription;
  companyId: any;
  sideMenu : any[] = [];
  sortMode = false;
  
  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService,
    private asideMenuService: AsideMenuService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    ) {
    this.companyId = localStorage.getItem('companyId');
    if (!this.companyId) {
      document.location.reload();
      this.auth.logout();
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('companyId') === '120' || localStorage.getItem('companyId') === '110') {
      this.showSoftService = true;
      this.softServiceChangedSubscription = this.asideMenuService.softServiceChanged$.pipe(
        tap(() => {
          this.fetchMenuItems();
          this.cdr.detectChanges();
        })
      ).subscribe();
    }
    setTimeout(() => {
      this.isAdminOnLoation();
      if (this.isAdminOnLoation()) {
        this.showUserGroup = true;
      } else {
        this.showUserGroup = false;
      }
    }, 3000);
    this.fetchMenuItems();
    this.isSuperUser = JSON.parse(localStorage.getItem('isSuperUser') || '');
  }

  removeFirstCharacter(parg: string) {
    return parg.split('/')[1];
  }

  isIncludedUrl(url: any) {
    return this.userMenu.some(
      (item: any) => item.ScreenName && item.ScreenName.includes(url)
    );
  }

  fetchMenuItems() {
    this.dashboardService.GetUserMenuPermission().subscribe(
      (res: any) => {
        this.userMenu = res?.[0]?.UserMenu;
        this.buildSideMenu(this.userMenu);
        this.cdr.detectChanges();
        if (!this.userMenu?.length) {
          this.router.navigate(['/page-no-permission']);
          return;
        }

        localStorage.setItem('userMenu', JSON.stringify(this.userMenu));
        this.userMenu = localStorage.getItem('userMenu');
        if (this.userMenu) {
          this.userMenu = JSON.parse(this.userMenu);
          this.cdr.detectChanges();
        }
      },
      (error: any) => {
        console.error('Error fetching menu items:', error);
      }
    );
  }

  isAdminOnLoation() {
    try {
      if (
        JSON.parse(localStorage.getItem('isUserManagerOnLocation') || '') ||
        JSON.parse(localStorage.getItem('isSuperUser') || '')
      ) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  isActiveRoute(): boolean {
    const currentRoute = this.router.url;
    return (
      currentRoute.includes('/WorkOrder/workOrderNotCompleted') ||
      currentRoute.includes('/WorkOrder/card')
    );
  }

  isShow(screenName: string) {
    if (this.userMenu?.length) {
      var isShow: boolean = false;
      this.userMenu.forEach((element: any, index: any) => {
        if (
          element.ScreenName?.replaceAll('\n', '')
            ?.replaceAll('\t', '')
            ?.toLowerCase() == screenName?.toLowerCase() &&
          element.IsShow == 1
        ) {
          //
          isShow = true;
        }
      });
      return isShow;
    } else {
      return false;
    }
  }

  buildSideMenu(menu: any) {
    /* toDo : backend should support company also */
    const fullMenu = [...menu ,
       {ScreenName: 'companies', IsShow: 1} ,
       {ScreenName: 'trackBugs', IsShow: 1},

       /* backend should support those endpoint if accountID =0  */
      this.canSeeAdminPanel() && {ScreenName: 'settings/configurations', IsShow: 1},
      this.canSeeAdminPanel() && {ScreenName: 'settings/users', IsShow: 1},
      this.canSeeAdminPanel() && {ScreenName: 'settings/roles', IsShow: 1},
    ]
    this.userMenu = fullMenu;
    this.sideMenu = fullMenu
      .map((menuItem: any) => this.getTitle(menuItem))
      .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
      .filter((item:any) => item.title)
      .filter((item:any) => item.display)
  }
  
  getTitle(menuItem: any): any {
    const menuConfig: { [key: string]: any } = {
      'dashboard': {title: this.translate.instant('SIDEBAR.DASHBOARD'), route: menuItem.ScreenName, icon: 'fas fa-tachometer-alt', display: this.showItemMenu(menuItem), index: 1 },
      'settings/locations': { title: this.translate.instant('SIDEBAR.LOCATIONS_MANAGEMENT'), route: menuItem.ScreenName, icon: 'far fa-building fa-lg', display: this.showItemMenu(menuItem), index: 2 },
      'MaintenanceRequests': { title: this.translate.instant('SIDEBAR.MAINTENANCEREQUESTS'), route: menuItem.ScreenName, icon: 'fas fa-wrench', display: this.showItemMenu(menuItem), index: 3 },
      'companies': { title: this.translate.instant('SIDEBAR.ADMIN.COMPANIES'), route: 'Admin/administrator', icon: 'fas fa-building', display: this.showItemMenu(menuItem), index: 4 , permission:['canSeeAdminPanel',]},
      'trackBugs': { title: this.translate.instant('track_bugs'), route: 'Admin/track-bugs', icon: 'fas fa-bug', display: this.showItemMenu(menuItem),  index: 5 , permission:['canSeeAdminPanel',]},
      'settings/configurations': { title: this.translate.instant('SIDEBAR.ADVANCEDSETTING.LABEL'), route: menuItem.ScreenName, icon: 'fas fa-cog', display: this.showItemMenu(menuItem), index: 6 ,permission:['canSeeAdminPanel',]},
      'settings/users': { title: this.translate.instant('SIDEBAR.USERS'), route: menuItem.ScreenName, icon: 'fas fa-user', display: this.showItemMenu(menuItem), index: 7 , permission:['canSeeAdminPanel','isSuperUser'] },
      'settings/roles': { title: this.translate.instant('SIDEBAR.USERSGROUPS'), route: menuItem.ScreenName, icon: 'fas fa-users', display: this.showItemMenu(menuItem), index: 8 , permission:['canSeeAdminPanel','isSuperUser'] },
      'Asset': { title: this.translate.instant('SIDEBAR.ASSETS'), route: 'Asset/Asset-main', icon: 'fas fa-cogs', display: this.showItemMenu(menuItem), index: 9 },
      'settings/CompaniesTeams': { title: this.translate.instant('SIDEBAR.WORKINIGTEAMS'), route: menuItem.ScreenName, icon: 'fas fa-users-cog', display: this.showItemMenu(menuItem), index: 10 },
      'WorkOrder': { title: this.translate.instant('SIDEBAR.WORK_ORDER'), route: 'WorkOrder/workOrderNotCompleted', icon: 'fas fa-wrench', display: this.showItemMenu(menuItem), index: 11 },
      'workOrderCompleted': { title: this.translate.instant('SIDEBAR.COMPLETED_WORK_ORDER'), route: 'WorkOrder/workOrderCompleted', icon: 'fas fa-check-circle', display: this.showItemMenu(menuItem), index: 12 },
      'PMs': { title: this.translate.instant('SIDEBAR.PREVENTIVEMAINTENANCE'), route: 'PMs/create-ppm', icon: 'fas fa-wrench', display: this.showItemMenu(menuItem), index: 13 },
      'PPMNotCompleted': { title: this.translate.instant('SIDEBAR.PPM_TASKS'), route: 'PPMTasks/PPMNotCompleted', icon: 'fas fa-wrench', display: this.showItemMenu(menuItem), index: 14 },
      'PPMCompleted': { title: this.translate.instant('SIDEBAR.COMPLETED_PPM_TASKS'), route: 'PPMTasks/PPMCompleted', icon: 'fas fa-check-circle', display: this.showItemMenu(menuItem), index: 15 },
      'Soft Service Management': { title: this.translate.instant('SIDEBAR.CREATESOFTSERVICES'), route: 'PMs/CreateSoftServices', icon: 'fas fa-cogs', display: this.showItemMenu(menuItem), index: 16 , permission:['canSeeSoftServices'] },
      'Soft service task': { title: this.translate.instant('SIDEBAR.SOFT_SERVICES_TASKS'), route: 'PPMTasks/SoftServiceTasks', icon: 'fas fa-wrench', display: this.showItemMenu(menuItem), index: 17 , permission:['canSeeSoftServices']},
      'Completed soft service task': { title: this.translate.instant('SIDEBAR.COMPLETED_SOFT_SERVICES_TASKS'), route: 'PPMTasks/CompletedSST', icon: 'fas fa-check-circle', display: this.showItemMenu(menuItem), index: 18 , permission:['canSeeSoftServices'] },
      'WOPTransaction': { title: this.translate.instant('Parts_Transaction'), route: 'WorkOrder-Parts-Transaction', icon: 'fas fa-wrench', display: this.showItemMenu(menuItem), index: 19 },
      'WorkOrderTemplate': { title: this.translate.instant('Templates_Library'), route: menuItem.ScreenName, icon: 'fas fa-book-open', display: this.showItemMenu(menuItem), index: 20 },
      'Vendors': { title: this.translate.instant('SIDEBAR.SUPPLIERS'), route: menuItem.ScreenName, icon: 'fas fa-truck-moving', display: this.showItemMenu(menuItem), index: 21 },
      'SpareParts': { title: this.translate.instant('SIDEBAR.WAREHOUSES'), route:  'Stores', icon: 'fas fa-archive', display: this.showItemMenu(menuItem), index: 22 },
      'ProcurementManagement': { title: this.translate.instant('SIDEBAR.PURCHASES'), route: 'ProcurementManagement', icon: 'fas fa-shopping-cart', display: this.showItemMenu(menuItem), index: 23 },
      'ReportManagement': { title: this.translate.instant('Report_management'), route: 'Report-management', icon: 'fas fa-chart-bar', display: this.showItemMenu(menuItem), index: 24 },
      'BillManagement': { title: this.translate.instant('SIDEBAR.BILLS'), route: 'Bills', icon: 'fas fa-file-invoice', display: this.showItemMenu(menuItem), index: 25 },
      'settings/Subscription': { title: this.translate.instant('SIDEBAR.SUBSCRIPTIONS'), route: menuItem.ScreenName, icon: 'fas fa-cog', display: this.showItemMenu(menuItem), index: 26 },
      'AccidentReport': { title: this.translate.instant('SIDEBAR.ACCIDENTREPORTS'), route: menuItem.ScreenName, icon: 'fas fa-exclamation-triangle', display: this.showItemMenu(menuItem), index: 27 },
      'settings/trash': { title: this.translate.instant('SIDEBAR.TRASH'), route: menuItem.ScreenName, icon: 'fas fa-trash-alt', display: this.showItemMenu(menuItem), index: 28 },
    };
    
    const config = menuConfig[menuItem.ScreenName];
    return config ? {
      title: config.title,
      route: config.route,
      icon: config.icon,
      display: config.display,
      index: config.index,
      permission: config.permission || [],
    } : menuItem;
  }

  showItemMenu(menuItem: any) {
    if (!this.userMenu.length) {
      return false;
    }
    const { ScreenName, IsShow } = this.userMenu.find((item: any) => item.ScreenName === menuItem.ScreenName) || {};
    if (IsShow === 1) {
      switch (ScreenName) {
        case 'settings/users':
        case 'settings/roles':
        case 'settings/configurations':
          return this.canSeeAdminPanel() || this.isSuperUser;
        case 'settings/configurations':
        case 'companies':
        case 'trackBugs':
          return this.canSeeAdminPanel();
        case 'Soft Service Management':
        case 'Soft service task':
        case 'Completed soft service task':
          return this.canSeeSoftServices();
        default:
          return true;
      }
    }
    return false;
  }
    
  drop(item: CdkDragDrop<any[]>) {
    moveItemInArray(this.sideMenu, item.previousIndex, item.currentIndex);
  }

  canSeeSoftServices(): boolean {
    const softServicesUsers = [120, 110 ];
    return softServicesUsers.includes(Number(localStorage.getItem('companyId')));
  }
  
  canSeeAdminPanel(){
    const adminPanelUsers = [0];
    return adminPanelUsers.includes(Number(localStorage.getItem('companyId')));
  }

}
