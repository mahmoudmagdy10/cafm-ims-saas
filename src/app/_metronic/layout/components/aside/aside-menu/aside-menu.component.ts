import { AuthService } from './../../../../../modules/auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  userMenu: any = undefined;
  showUserGroup: boolean = false;
  isSuperUser: any;
  showSoftService = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.companyId = localStorage.getItem('companyId');
    if (!this.companyId) {
      document.location.reload();
      this.auth.logout();
    }
  }

  companyId: any;
  ngOnInit(): void {
    if (localStorage.getItem('defaultLocation') === '679'){
      this.showSoftService = true ;
    }
    console.log('this.showSoftService :>> ', this.showSoftService);
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
        if (!this.userMenu?.length) {
          this.router.navigate(['/page-no-permission']);
          return;
        }

        localStorage.setItem('userMenu', JSON.stringify(this.userMenu));
        this.userMenu = localStorage.getItem('userMenu');
        if (this.userMenu) {
          this.userMenu = JSON.parse(this.userMenu);
        }
        // if (this.userMenu.length > 0) {
        //   const linkUrl = this.removeFirstCharacter(this.router.url);
        //   const check = this.isIncludedUrl(linkUrl);
        //   const firstItem = this.userMenu.find(
        //     (menu: any) => menu.ScreenName
        //   ).ScreenName;
        //   if (!check) this.router.navigate([firstItem]);
        // }
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
}
