import { AuthService } from './../../../modules/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { SubscriptionService } from './Subscription.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-Subscription',
  templateUrl: './Subscription.component.html',
  styleUrls: ['./Subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  displayEditSubscription: boolean = false;
  Codes: any;
  SubscriptionByComID: any[] = [];
  CompanyId: any;
  SubscriptionByComIDLast: any = null;
  SubscriptionByComIDLastEdit: any = null;
  loading: boolean = false;
  interval: any;
  CompanyForSub: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private subscriptionService: SubscriptionService,
    private cdr: ChangeDetectorRef
  ) {}
  subscription: Subscription;
  ngOnInit(): void {
    this.CompanyForSub = localStorage.getItem('CompanyForSub');
    this.CompanyId = this._activatedRoute.snapshot.paramMap.get('id');
    this.getSubscriptionByComID();
    this.getCodeSubscription();

    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(
          () => {
            this.getSubscriptionByComID();
            this.getCodeSubscription();
          },
          +TimerRefresh
        );
      } else if (value == 'now') {
        this.getSubscriptionByComID();
        this.getCodeSubscription();
      }
    });
  }
  getCodeSubscription() {
    this.subscriptionService.getCodeSubscription().subscribe((value) => {
      this.Codes = value;
    });
  }

  EditSubscription() {
    this.SubscriptionByComIDLastEdit = this.SubscriptionByComIDLast;
    this.displayEditSubscription = true;
  }
  getSubscriptionByComID() {
    this.loading = true;
    this.subscriptionService
      .getSubscriptionByComID(this.CompanyId)
      .subscribe((data: any) => {
        this.SubscriptionByComID = data;
        this.SubscriptionByComID.forEach((value: any) => {
          if (value.IsLast) {
            this.SubscriptionByComIDLast = value;
            this.SubscriptionByComIDLastEdit = value;
          }
        });
        this.loading = false;

        this.cdr.detectChanges();
      });
  }
  afterEditSub() {
    this.displayEditSubscription = false;
    this.SubscriptionByComIDLastEdit = null;
    this.getSubscriptionByComID();
  }
  AddNewSup() {
    this.SubscriptionByComIDLastEdit = null;
    this.displayEditSubscription = true;
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
    localStorage.removeItem('CompanyForSub');
  }
  companyId() {
    let companyId = localStorage.getItem('companyId');
    if (companyId) {
      return companyId;
    }
  }
}
