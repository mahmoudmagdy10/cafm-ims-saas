import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsideMenuService {
  private softServiceChangedSubject = new Subject<any>();

  softServiceChanged$ = this.softServiceChangedSubject.asObservable();

  softServiceChanged(locationSoftServies: any) {
    this.softServiceChangedSubject.next(locationSoftServies);
  }
}
