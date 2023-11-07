import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RefreshAssetsService {
  RefreshData$: BehaviorSubject<any> = new BehaviorSubject<any>('first');

  constructor() {}

  get RefreshAction$() {
    return this.RefreshData$.asObservable();
  }
  doAction$(value:any='') {
    this.RefreshData$.next(value);
  }
}
