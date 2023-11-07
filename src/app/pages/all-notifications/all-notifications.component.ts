import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AllNotificationsService } from './all-notifications.service';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss'],
})
export class AllNotificationsComponent implements OnInit {
  private audio = new Audio('./../../assets/sounds/tweet.mp3');
  constructor(private service: AllNotificationsService) {}
  notifications: any = [];
  UserAlertNotifications$: Observable<any>;
  Setting: any;
  selectedPage = 1;
  ngOnInit() {
    this.UserAlertNotifications$ = this.service.UserAlertNotifications$.pipe(
      tap((value) => {
        this.notifications = value?.data?.Data;
        this.Setting = value?.data?.Setting;
      })
    );
  }
  moveNotify(item: any) {
    this.service.moveNotify(item);
  }
  play() {
    // this.audio

    this.audio.play();
  }
  changePage() {
    this.service.selectedPage = this.selectedPage;
    this.service.getNotificationForUser();
  }
}
