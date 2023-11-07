import { distinctUntilChanged, map } from 'rxjs/operators';
import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackBugsService {
  store = new BehaviorSubject<any>({
    BugsTrack: { data: [], loading: false },
    Campanies: undefined,
    Filter: undefined,
  });
  get dataStore() {
    return this.store.value;
  }
  store$: Observable<any> = this.store.asObservable();
  constructor(private _http: HttpService) {}
  updateStore(newState: any) {
    this.store.next({
      ...this.store.value,
      ...newState,
    });
  }
  Selector$(selector: string) {
    return this.store$.pipe(
      map((state) => state[selector]),
      distinctUntilChanged()
    );
  }
  getBugsTrack() {
    this.updateStore({ BugsTrack: { data: [], loading: true } });
    this._http
      .saveData('/CompanyLocationBackup/Bugs', this.dataStore?.Filter)
      .subscribe((value) => {
        this.updateStore({ BugsTrack: { data: value, loading: false } });
      });
  }
  getCampanies() {
    this.updateStore({ Campanies: undefined });
    this._http
      .getData('/Subscription/Companies', {
        currentPage: 1,
        rowCount: 2000,
      })
      .subscribe((value) => {
        this.updateStore({ Campanies: value });
      });
  }
}
