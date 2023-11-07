import { ToastrService } from 'ngx-toastr';
import { AuthService } from './modules/auth/services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HeaderService } from './_metronic/layout/components/header/header.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    public auth: AuthService,
    private toastr: ToastrService,
    private _headerService: HeaderService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (request.method == 'POST') {
    //   let defaultLocation = localStorage.getItem('defaultLocation');
    //   if (!defaultLocation||defaultLocation=='0') {
    //     this.toastr.error('Please change your location it`s not working ');

    //     return of();

    //   }
    // }

    const reqAfterClone = next.handle(request).pipe(
      mergeMap((value: any) => {
        if (
          value instanceof HttpResponse &&
          request.responseType != 'blob' &&
          request.headers.get('skipInterceptor') != 'true'
        ) {
          this._headerService.noInternetConnection.next(false);

          if (value!.body!.rv > 0 && (value!.body!.Msg || value!.body!.msg)) {
            this.toastr.success(value!.body!.Msg || value!.body!.msg);
          } else if (
            value!.body!.rv < 1 &&
            (value!.body!.Msg || value!.body!.msg)
          ) {
            this.toastr.error(value!.body!.Msg || value!.body!.msg);
            if (value!.body!.Msg || value!.body!.msg) {
              return throwError(value!.body!);
            }
          }
          if (value?.body?.rv == '-401') {
            document.location.reload();
            this.auth.logout();
          }
        }
        return of(value);
      }),

      catchError((err) => {
        if (
          err instanceof HttpErrorResponse
          // &&
          // request.headers.get('typeRequest') != 'blob'
        ) {
          if (err.status == 500) {
            this.toastr.error(
              'operation failed, please contact the technical support team'
            );
          } else if (err.status == 400) {
            var eror = '';
            if (err?.error?.rv <= 0 && err?.error?.msg) {
              // this.toastr.error(err?.error?.msg);
            } else {
              // Object.keys(err.error.errors).forEach((key) => {
              //   err.error.errors[key].forEach((element: any) => {
              //     eror = element;
              //     if (eror) {
              //       this.messageService.add({
              //         severity: 'error',
              //         detail: eror,
              //       });
              //     }
              //   });
              // });
            }
          } else if (err.status == 401) {
            // this.toastr.error('un Unauthorized');
            // document.location.reload();
            this.auth.logout();
          } else {
            this.toastr.error(
              ' operation failed, please contact the technical support team'
            );
          }
        }
        return throwError(err);
      })
    );
    if (!navigator.onLine) {
      this._headerService.noInternetConnection.next(true);
      return of();
    } else {
      this._headerService.noInternetConnection.next(false);
      return reqAfterClone;
    }
  }
}
