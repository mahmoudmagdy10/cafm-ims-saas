import { AuthService } from './../../../../../../modules/auth/services/auth.service';
import { map, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { Observable, Subscription, of } from 'rxjs';
import { AllNotificationsService } from 'src/app/pages/all-notifications/all-notifications.service';
import { ToastrService } from 'ngx-toastr';

export type NotificationsTabsType =
  | 'kt_topbar_notifications_1'
  | 'kt_topbar_notifications_2'
  | 'kt_topbar_notifications_3';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
  styleUrls: ['./notifications-inner.component.scss']

})
export class NotificationsInnerComponent implements OnInit {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  activeTabId: NotificationsTabsType = 'kt_topbar_notifications_1';
  alerts: Array<AlertModel> = defaultAlerts;
  logs: Array<LogModel> = defaultLogs;
  subscription: Subscription;
  interval: any;
  UserAlertNotifications$: Observable<any>;
  UserAlertNotifications: any = [];
  UserAlertNotificationsLenght: any;
  constructor(
    private _allNotificationsService: AllNotificationsService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.UserAlertNotifications$ =
      this._allNotificationsService.UserAlertNotifications$.pipe(
        tap((value) => {
          this.UserAlertNotificationsLenght = value.data?.Data?.length;
          this.UserAlertNotifications = value.data?.Data?.slice(0, 5);
          this.cdr.detectChanges();
        })
      );
  }
  getNotif() {
    // this.Notfi$ = this.service.getNotification().pipe(
    //   map((data) => {
    //     return data.map((value: any) => {
    //       return {
    //         title: value.Title,
    //         description: value.Description,
    //         time: this.time_ago(new Date(value.CreatedDate)),
    //         icon: 'icons/duotune/general/gen044.svg',
    //         state: 'success',
    //         NotificationLink: value.NotificationLink,
    //       };
    //     });
    //   }),
    //   tap((value) => {
    //   })
    // );
  }
  moveNotify(item: any) {
    this._allNotificationsService.moveNotify(item);
  }
  setActiveTabId(tabId: NotificationsTabsType) {
    this.activeTabId = tabId;
  }

  time_ago(date: Date) {
    var time = date.getTime();
    var time_formats_en = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var time_formats_ar = [
      [60, 'ثانية', 1], // 60
      [120, 'قبل 1 دقيقة', '1 minute from now'], // 60*2
      [3600, 'دقيقة', 60], // 60*60, 60
      [7200, 'منذ1ساعة', '1 hour from now'], // 60*60*2
      [86400, 'ساعة', 3600], // 60*60*24, 60*60
      [172800, 'في الامس', 'Tomorrow'], // 60*60*24*2
      [604800, 'أيام', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'الأسبوع الماضي', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'أسابيع', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'الشهر الماضي', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'الشهور', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'العام الماضي', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'سنوات', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'القرن الماضي', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'قرون', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = document.dir == 'rtl' ? 'منذ' : 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'الآن';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'من الان';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (
      (format =
        document.dir == 'rtl' ? time_formats_ar[i++] : time_formats_en[i++])
    )
      if (seconds < format[0]) {
        if (typeof format[2] == 'string') return format[list_choice];
        else
          return document.dir == 'rtl'
            ? token + Math.floor(seconds / format[2]) + ' ' + format[1] + ' '
            : Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

interface AlertModel {
  title: string;
  description: string;
  time: string;
  icon: string;
  state: 'primary' | 'danger' | 'warning' | 'success' | 'info';
}

const defaultAlerts: Array<AlertModel> = [
  {
    title: 'Project Alice',
    description: 'Phase 1 development',
    time: '1 hr',
    icon: 'icons/duotune/technology/teh008.svg',
    state: 'primary',
  },
  {
    title: 'HR Confidential',
    description: 'Confidential staff documents',
    time: '2 hrs',
    icon: 'icons/duotune/general/gen044.svg',
    state: 'danger',
  },
  {
    title: 'Company HR',
    description: 'Corporeate staff profiles',
    time: '5 hrs',
    icon: 'icons/duotune/finance/fin006.svg',
    state: 'warning',
  },
  {
    title: 'Project Redux',
    description: 'New frontend admin theme',
    time: '2 days',
    icon: 'icons/duotune/files/fil023.svg',
    state: 'success',
  },
  {
    title: 'Project Breafing',
    description: 'Product launch status update',
    time: '21 Jan',
    icon: 'icons/duotune/maps/map001.svg',
    state: 'primary',
  },
  {
    title: 'Banner Assets',
    description: 'Collection of banner images',
    time: '21 Jan',
    icon: 'icons/duotune/general/gen006.svg',
    state: 'info',
  },
  {
    title: 'Icon Assets',
    description: 'Collection of SVG icons',
    time: '20 March',
    icon: 'icons/duotune/art/art002.svg',
    state: 'warning',
  },
];

interface LogModel {
  code: string;
  state: 'success' | 'danger' | 'warning';
  message: string;
  time: string;
}

const defaultLogs: Array<LogModel> = [
  { code: '200 OK', state: 'success', message: 'New order', time: 'Just now' },
  { code: '500 ERR', state: 'danger', message: 'New customer', time: '2 hrs' },
  {
    code: '200 OK',
    state: 'success',
    message: 'Payment process',
    time: '5 hrs',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'Search query',
    time: '2 days',
  },
  {
    code: '200 OK',
    state: 'success',
    message: 'API connection',
    time: '1 week',
  },
  {
    code: '200 OK',
    state: 'success',
    message: 'Database restore',
    time: 'Mar 5',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'System update',
    time: 'May 15',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'Server OS update',
    time: 'Apr 3',
  },
  {
    code: '300 WRN',
    state: 'warning',
    message: 'API rollback',
    time: 'Jun 30',
  },
  {
    code: '500 ERR',
    state: 'danger',
    message: 'Refund process',
    time: 'Jul 10',
  },
  {
    code: '500 ERR',
    state: 'danger',
    message: 'Withdrawal process',
    time: 'Sep 10',
  },
  { code: '500 ERR', state: 'danger', message: 'Mail tasks', time: 'Dec 10' },
];
