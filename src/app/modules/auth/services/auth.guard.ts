import { switchMap, map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isActive) {
      if (!state.url.includes('login')) {
        this.router.navigate(['/auth/login']);
        return of(false);
      } else {
        return of(true);
      }
    } else {
      if (state.url.includes('page-no-permission')) {
        return of(true);
      }
      if (state.url.includes('page-welcome')) {
        return of(true);
      }
      if (state.url.includes('login')) {
        this.router.navigate(['/page-welcome']);

        return of(false);
      } else {
        let userMenu = localStorage.getItem('userMenu');
        let userMenuJson = JSON.parse(userMenu!);
        if (
          !this.isShow(state.url, userMenuJson) &&
          this.auth.companyId != '0'
        ) {
          this.router.navigate(['/page-no-permission']);
          return of(false);
        } else {
          // this.router.navigate(['/page-welcome']);
          return of(true);
        }
      }
    }
  }
  isShow(screenName: string, userMenu: any[]): boolean {
    if (!userMenu?.length) return false;

    let isHave = userMenu.some((element) => {
      const cleanScreenName = element.ScreenName?.replace(
        /[\n\t]/g,
        ''
      ).toLowerCase();
      return (
        screenName?.toLowerCase()?.includes(cleanScreenName) &&
        element.IsShow === 1
      );
    });
    return isHave;
  }
}
