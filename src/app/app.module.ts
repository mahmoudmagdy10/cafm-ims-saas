import { AuthInterceptor } from './AuthInterceptor.service';
import { HttpService } from './modules/auth/services/http.service';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';

import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
// #fake-end#
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { FullCalendarModule } from '@fullcalendar/angular';

function appInitializer(authService: AuthService) {
  return () => {};
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    TooltipModule,
    RippleModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    FullCalendarModule,
    ToastrModule.forRoot({
      // timeOut: 10000,
      positionClass: 'toast-bottom-left',
      // preventDuplicates: true,
    }),
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    BsDatepickerModule.forRoot(),
    ScrollTopModule,
    ToastModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
