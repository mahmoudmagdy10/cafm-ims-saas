import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, forkJoin } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '../../i18n';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields

  private authLocalStorageToken = `token`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  Timer = new BehaviorSubject<boolean>(false);

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }
  getonTimer(): Observable<any> {
    return this.Timer.asObservable();
  }

  setTimer(Timer: any) {
    localStorage.setItem('TimerRefresh', Timer);
    this.Timer.next(Timer);
  }
  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient,
    private translationService: TranslationService
  ) // private toastr: ToastrService
  {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.user;
    // this.unsubscribe.push(subscr);
  }

  login(
    api: string,
    userName: string,
    password: string,
    code?: string,
    appID?: number | string
  ) {
    this.isLoadingSubject.next(true);
    return this.http
      .post(environment.baseUrl + api, {
        Email: userName,
        Password: password,
        code: code,
      })
      .pipe(
        tap((res: any) => {
          // if (res?.Data?.preventAccessWeb) {
          //   this.toastr.error(
          //     document.dir == 'rtl'
          //       ? 'لا يمكن الدخول للموبايل'
          //       : 'Mobile Cannot be Accessed'
          //   );
          // } else {
          this.saveUser(res.Data, userName, appID);
          this.currentUserSubject.next(res);
          if (res.rv > 0) {
            this.http
              .post(
                environment.baseUrl +
                  '/AppNotification/NotificationsAfterLogin',
                {},
                {
                  headers: this.getHeaders(),
                }
              )
              .subscribe(
                (value) => {
                  document.location.reload();
                },
                (err) => {
                  document.location.reload();
                }
              );
          } else {
            if (res.rv > 0) {
              // confirmLogin();
            }
          }
          // }
        }),

        finalize(() => this.isLoadingSubject.next(false))
      );
  }
  saveUser(res: any, userName?: string, appID?: number | string) {
    if (res?.token) {
      this.logout();
      localStorage.setItem(this.authLocalStorageToken, res.token);
      localStorage.setItem('fullName', res.firstName + ' ' + res.lastName);
      localStorage.setItem('userID', res.userId);
      localStorage.setItem('locations', JSON.stringify(res.locations));
      localStorage.setItem('avatarPath', res.avatarPath);
      localStorage.setItem('defaultLocation', res.defaultLocation || 0);
      localStorage.setItem('isSuperUser', res.isSuperUser);
      localStorage.setItem('companyId', res.companyId);
      localStorage.setItem('email', res.email);
      localStorage.setItem('currentCompany', res.companyName);
      localStorage.setItem('userMenu', JSON.stringify(res.userMenu));
      localStorage.setItem('currencyName', res.currencyName);
      // if (localStorage.getItem('language') != res.languageCode) {
      this.translationService.setLanguage(res.languageCode?.toLowerCase());

      // }
      //
      // if (userName == "public") this.router.navigate(["/jobs/app/" + appID]);
      // else {
      // localStorage.removeItem("public");
      if (userName) {
        // this.router.navigate(['/dashboard']);
      }
    } else {
      // this.toastr.error(res.message);
    }
  }

  logout() {
    localStorage.clear();
    // document.location.reload();
    this.router.navigate(['/auth/login']);
    //    {
    //     queryParams: {},
    //   });
  }
  get isActive() {
    return !!localStorage.getItem(this.authLocalStorageToken);
  }
  get companyId() {
    return localStorage.getItem('companyId')!;
  }
  get user() {
    return { fullName: localStorage.getItem('fullName') };
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return of(undefined);

    // this.authHttpService.createUser(user).pipe(
    //   map(() => {
    //     this.isLoadingSubject.next(false);
    //   }),
    //   switchMap(() =>
    //   this.login(user.email, user.password))
    //   ,
    //   catchError((err) => {
    //     console.error('err', err);
    //     return of(undefined);
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  getHeaders(extraHeader?: any) {
    return new HttpHeaders({
      Authorization: (
        'Bearer ' + localStorage.getItem(this.authLocalStorageToken)
      )?.includes('null')
        ? ''
        : 'Bearer ' + localStorage.getItem(this.authLocalStorageToken),
      ...extraHeader,
    });
  }
  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      localStorage.setItem(
        this.authLocalStorageToken,
        JSON.stringify(auth.token)
      );
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    // this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
