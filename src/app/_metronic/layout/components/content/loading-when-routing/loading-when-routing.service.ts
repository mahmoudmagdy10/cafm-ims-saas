import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingWhenRoutingService {
  loadingSub = new BehaviorSubject<any>(false);
  constructor() {}
  loadingOn() {
    this.loadingSub.next(true);
  }
  loadingOff() {
    this.loadingSub.next(false);
  }
  get Loading$() {
    return this.loadingSub.asObservable();
  }
}
