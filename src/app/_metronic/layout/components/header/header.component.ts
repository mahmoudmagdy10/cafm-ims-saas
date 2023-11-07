import { tap, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from './../../../../modules/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent } from '../../../kt/components';
import { HeaderService } from './header.service';
import { ConfigurationService } from 'src/app/pages/settings/configurations/configurations.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerContainerCssClasses: string = '';
  asideDisplay: boolean = true;
  headerLeft: string = 'menu';
  pageTitleCssClasses: string = '';
  pageTitleAttributes: {
    [attrName: string]: string | boolean;
  };
  TimerSelected: number;
  companyId: any;
  locations$: Observable<any>;
  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
  noInternetConnection$: Observable<any>;
  intervalSubscription: Subscription;
  private unsubscribe: Subscription[] = [];
  minutes: any[] = [5, 10, 15, 30];
  unActiveTimer: boolean = true;
  subscription: Subscription;
  interval: any;
  constructor(
    private layout: LayoutService,
    private router: Router,
    private service: HeaderService,
    private toastr: ToastrService,
    private auth: AuthService,
    private _configurationService: ConfigurationService,
    private _authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.companyId = localStorage.getItem('companyId');
    this.TimerSelected = +localStorage.getItem('TimerSelected')!;
    if (this.TimerSelected != 0) this.unActiveTimer = false;
    this.routingChanges();
  }
  ngOnInit(): void {
    this.checkUserPostion();
    this.headerContainerCssClasses =
      this.layout.getStringCSSClasses('headerContainer');
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.headerLeft = this.layout.getProp('header.left') as string;
    this.pageTitleCssClasses = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.layout.getHTMLAttributes('pageTitle');
    this.locations$ = this._configurationService.locationList$.pipe(
      tap((value) => {
      })
    );
    this._configurationService.getLocation();

    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      localStorage.getItem('TimerRefresh');
      if (value == 'now') {
        this._configurationService.getLocation();
      }
    });
    this.noInternetConnection$ = this.service.noInternetConnection$.pipe(
      distinctUntilChanged(),
      tap((value) => {
        if (value) {
          this.interval = setInterval(() => {
            this.refreshNow();
          }, 1000);
        } else {
          if (this.interval) {
            clearInterval(this.interval);
          }
        }
      })
    );
  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (this.pageTitleAttributes.hasOwnProperty(key)) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        MenuComponent.reinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  Logintime(time: any | null) {
    if (time && time != 0 && time != 'now') {
      localStorage.setItem('TimerSelected', time);
      this.unActiveTimer = false;
      this.TimerSelected = time;
      const timeMS = time * 60 * 1000;
      this.auth.setTimer(timeMS);
      const body = {
        refreshDuration: time,
      };
      this.service.RefreshDuration(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
          } else {
          }
        },
        (err) => {}
      );
    } else if (time == 0) {
      localStorage.setItem('TimerSelected', '0');
      this.TimerSelected = 444444;
      this.unActiveTimer = true;
      this.auth.setTimer(time);
      const body = {
        refreshDuration: time,
      };
      this.service.RefreshDuration(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            // document.location.reload();
          } else {
          }
        },
        (err) => {}
      );
    } else if (time == 'now') {
      this.auth.setTimer(time);
      this.auth.setTimer(0);
      this._configurationService.getConfiguration();
      this._configurationService.getLocation();
    } else {
      this.toastr.error('لم تتم العملية بنجاح');
    }
  }

  defualtLocation() {
    let defaultLocation = localStorage.getItem('defaultLocation');
    if (defaultLocation) {
      return this._configurationService.locationList.value?.filter(
        (item: any) => item.LocationId == defaultLocation
      )[0];
    }
  }
  currentCompany() {
    let currentCompany = localStorage.getItem('currentCompany');
    if (currentCompany) {
      return currentCompany;
    }
  }
  checkUserPostion(){
    const email = localStorage.getItem('email') || '';
    const defaultLocation = localStorage.getItem('defaultLocation');
    this.service.checkIsSiteManager(email ,defaultLocation).subscribe((value: any) => {
      localStorage.setItem('isUserManagerOnLocation', value?.isUserManagerOnLocation);
    });
  }

  changeLocation(defaultLocation: number) {
    const body = {
      defaultLocation: defaultLocation,
    };
    this.service.changeLocation(body).subscribe((value: any) => {
      localStorage.setItem('defaultLocation', defaultLocation.toString());
      localStorage.setItem('token', value.Data.token);
      localStorage.setItem('userMenu', JSON.stringify(value.Data.userMenu));
      document.location.reload();
    });
    this.checkUserPostion();
  }
  refreshNow() {
    this.auth.setTimer('now');
    this.auth.setTimer(0);
  }
}
