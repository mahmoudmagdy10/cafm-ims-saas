import { AuthService } from './../../../../../modules/auth/services/auth.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { AsideMenuService } from 'src/app/services/aside-menu.service';
import { LocationService } from 'src/app/pages/settings/locations/locations.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,

})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  userMenu: any = undefined;
  showUserGroup: boolean = false;
  isSuperUser: any;
  showSoftService = false;
  softServicesOnLocation: any[]= [];
  private softServiceChangedSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService,
    private asideMenuService: AsideMenuService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
    ) {
    this.companyId = localStorage.getItem('companyId');
    if ( this.companyId === '120') {
      // softService for nebras 
      this.getLocationExtraServices();
    }
    
    if (!this.companyId) {
      document.location.reload();
      this.auth.logout();
    }
  }

  companyId: any;
  ngOnInit(): void {
    if (localStorage.getItem('companyId') === '120') {
      this.showSoftService = true;
      this.softServiceChangedSubscription = this.asideMenuService.softServiceChanged$.pipe(
        map(response => response || []),
        map((data: any[]) => data.map((item: any) => item.ServiceId)),
        tap((softServices: number[]) => {
          this.softServicesOnLocation = softServices;
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

  getLocationExtraServices(){
    const payload = {
      locationId : localStorage.getItem('defaultLocation')
    }
    this.locationService.getLoactionExtraService(payload).pipe(
      map(response => response.Data || []),
      map(data => data.map((item: any) => item.ServiceId)),
      tap((softServices: any[]) => {
        this.softServicesOnLocation = softServices;
      })
    )
    .subscribe();
}

  menuSoftService(serviceId : number){
    if(!this.softServicesOnLocation.length){
      return false
    }
    return this.softServicesOnLocation.includes(serviceId);
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
