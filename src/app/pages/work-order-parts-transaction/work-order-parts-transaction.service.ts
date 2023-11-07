import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderPartsTransactionService {
  WorkOrderPartsTransactionSub = new BehaviorSubject<any>({
    loading: false,
    data: [],
  });
  WorkOrderPartsTransaction$ = this.WorkOrderPartsTransactionSub.asObservable();
  isAccepted = null;
  Filter: any;
  selectedPage = 1;
  RowCount: any = 50;
  CodesSub$: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService
  ) {}
  getWorkOrderPartsTransaction(SearchText?: any) {
    this.WorkOrderPartsTransactionSub.next({ loading: true, data: [] });

    this.http
      .getData('/WorkOrder/WorkOrderPartsTransaction', {
        ...SearchText,
        // ...this.viewDataFilterService.datafilterModel?.workOrderTransaction?.dataFilter,
        LocationId: localStorage.getItem('defaultLocation'),
        isAccepted: this.isAccepted,
        CurrentPage: this.selectedPage,
        RowCount: this.RowCount,
      })
      .subscribe((value) => {
        this.WorkOrderPartsTransactionSub.next({ loading: false, data: value });
      });
  }
  saveWorkOrderPartsTransaction(body: any) {
    this.http
      .saveData('/WorkOrder/WorkOrderPartsTransaction', {
        ...body,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.getWorkOrderPartsTransaction();
      });
  }
  //  Code
  getCode() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'WOPartTransactions',
    };
    this.http
      .getData('/Code', params)
      .pipe(

      )
      .subscribe((value) => {
        this.CodesSub$.next(value);
      });
  }
  get Codes$() {
    return this.CodesSub$.asObservable();
  }
}
