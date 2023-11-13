import { ViewDataFilterService } from './../../shared/components/view-data-filter/view-data-filter.service';
import { map } from 'rxjs/operators';
import { HttpService } from './../../modules/auth/services/http.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  private billSub = new BehaviorSubject<any>(false);
  private billSubByID = new BehaviorSubject<any>(false);

  private codeSub = new BehaviorSubject<any>(false);
  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService,
    private router: Router
  ) {}
  // get Bill
  // mohamad=new BehaviorSubject
  getBill(Filtrt?: any) {
    if (!Filtrt) Filtrt = {};

    this.billSub.next(false);
    return this.http
      .getData('/Procurement/OrderBill', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...this.viewDataFilterService.datafilterModel?.Bills?.dataFilter
          ?.params,
      })
      .pipe(
        map((value) => {
          return value[0].Data || [];
        })
      )
      .subscribe((Value) => {
        this.billSub.next(Value);
      });
  }
  get bill$() {
    return this.billSub.asObservable();
  }

  // get Bill
  getBillById(Id: any) {
    this.billSubByID.next(false);
    return this.http
      .getData('/Procurement/OrderBill', {
        LocationId: localStorage.getItem('defaultLocation'),
        Id: Id,
      })
      .pipe(
        map((value) => {
          return value[0].Data;
        })
      )
      .subscribe((Value) => {
        this.billSubByID.next(Value);
      });
  }

  deleteBill(ID: any) {
    return this.http.deleteDate('/Procurement/OrderBill', {
      ID: ID,
    });
  }

  get billById$() {
    return this.billSubByID.asObservable();
  }
  addBill(body: any) {
    return this.http.saveDataArray('/Procurement/OrderBill', body);
  }
  getDataForExcel(params?: any) {
    return this.http.getData('/Procurement/OrderBill', {
      ...params,
      RowCount: 2002153,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  //  Code
  // getCodeBill() {
  //   const params = {
  //     LocationId: localStorage.getItem('defaultLocation'),
  //     ScreenName: 'WorkRequestGates',
  //   };
  //   this.http
  //     .getData('/Code', params)
  //     .pipe()
  //     .subscribe((value) => {
  //       this.codeSub.next(value);
  //     });
  // }
  // get Codes$() {
  //   return this.codeSub.asObservable();
  // }
  IsSoftService() {
    const currentRoute = this.router.url;
    const segmentsToCheck = ['CreateSoftServices', 'SoftServiceTasks', 'CompletedSST'];
    return segmentsToCheck.some(segment => currentRoute.includes(segment));
  }
  getCodeBill() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'Procurement',
      // isSoftService: this.IsSoftService()
    };
    this.codeSub.next(false);
    return this.http
      .getData('/Code', params)
      .pipe(
        map((code: any) => {
          return {
            ...code,
            // AssetId: code?.AssetId.map((value: any) => {
            //   return {
            //     ...value,
            //     label: value.AssetName + ' (' + value.CategoryName + ') ',
            //     key: value.AssetName,
            //     data: 'Documents Folder',
            //     expandedIcon: 'pi pi-folder-open',
            //     collapsedIcon: 'pi pi-folder',
            //   };
            // }),
          };
        })
      )
      .subscribe((value) => {
        this.codeSub.next(value);
      });
  }

  get Codes$() {
    return this.codeSub.asObservable();
  }
}
