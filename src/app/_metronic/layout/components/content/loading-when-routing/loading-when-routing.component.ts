import { tap } from 'rxjs/operators';
import {
  RouteConfigLoadStart,
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  RouteConfigLoadEnd,
  NavigationEnd,
} from '@angular/router';
import { LoadingWhenRoutingService } from './loading-when-routing.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-loading-when-routing',
  templateUrl: './loading-when-routing.component.html',
  styleUrls: ['./loading-when-routing.component.css'],
})
export class LoadingWhenRoutingComponent implements OnInit {
  constructor(
    public _loadingWhenRoutingService: LoadingWhenRoutingService,
    private router: Router
  ) {}
  Loading$: Observable<any>;
  @Output() changeLoading = new EventEmitter();
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationStart ||
        event instanceof RouteConfigLoadStart
      ) {
        this._loadingWhenRoutingService.loadingOn();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel ||
        event instanceof RouteConfigLoadEnd
      ) {
        this._loadingWhenRoutingService.loadingOff();
      }
    });

    this.Loading$ = this._loadingWhenRoutingService.Loading$.pipe(
      tap((value) => {
        this.changeLoading.emit(value);
      })
    );
  }
}
