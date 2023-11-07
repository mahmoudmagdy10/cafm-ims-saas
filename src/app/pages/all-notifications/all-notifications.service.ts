import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AllNotificationsService {
  constructor(private http: HttpService, private router: Router) {}
  selectedPage = 1;
  UserAlertNotifications = new BehaviorSubject<any>({
    data: undefined,
    isToster: false,
  });
  UserAlertNotifications$: Observable<any> =
    this.UserAlertNotifications.asObservable();

  getNotificationForUser() {
    this.UserAlertNotifications.next({ data: undefined, isToster: false });
    this.http
      .getData('/AppNotification/UserAlertNotifications', {
        UserID: localStorage.getItem('userID'),
        RowCount: 10,
        CurrentPage: this.selectedPage,
      })
      .subscribe((value) => {
        this.UserAlertNotifications.next({ data: value[0], isToster: false });
      });
  }

  addNotification(newMassage: any) {
    this.UserAlertNotifications.next({
      data: [newMassage, ...this.UserAlertNotifications.value?.data],
      isToster: true,
    });
  }

  moveNotify(item: any) {
    switch (item.AlertType) {
      case 'WO':
        this.router.navigateByUrl(item.UserLink + item.TableID);
        break;
    }
  }
}
