import { map, distinctUntilChanged } from 'rxjs/operators';
import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportManagmentService {
  store = new BehaviorSubject<any>({
    Reports: { data: [], loading: false },
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
  getReports() {
    this.updateStore({ Reports: { data: [], loading: true } });
    this._http
      .getData('/Location/LocationReportList', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.updateStore({ Reports: { data: value, loading: false } });
      });
  }
  printReport(api: string, body: any) {
   return this._http?.getBlob(api, body)
  }
}
