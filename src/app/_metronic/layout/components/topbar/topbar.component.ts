import { tap } from 'rxjs/operators';
import { observable, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MyProfileService } from './../../../../pages/settings/my-profile/my-profille.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import { AllNotificationsService } from 'src/app/pages/all-notifications/all-notifications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = '';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  displayChangePasswordModal: boolean = false;
  constructor(
    private layout: LayoutService,
    private _allNotificationsService: AllNotificationsService,
    private toaster: ToastrService
  ) {}
  UserAlertNotifications$: Observable<any>;
  imgProfile: any;
  Avatar = environment.Avatar;
  notificationsNotReading: any;
  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;

    this.UserAlertNotifications$ =
      this._allNotificationsService.UserAlertNotifications$.pipe(
        tap((value) => {
          if (value?.isToster) {
            this.notificationsNotReading = +this.notificationsNotReading + 1;
            if (value?.isToster) {
              this.toaster.info('New Notification For You', undefined, {
                positionClass: 'toast-top-center',
              });
            }
          }
        })
      );
  }
  imageProfile() {
    let avatarPath = localStorage.getItem('avatarPath');
    //
    if (avatarPath) {
      //
      return this.Avatar + avatarPath;
    }

    // }else{
    // return []
    // }
  }
}
