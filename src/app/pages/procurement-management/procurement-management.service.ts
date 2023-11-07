import { ViewDataFilterService } from './../../shared/components/view-data-filter/view-data-filter.service';
import { HttpService } from './../../modules/auth/services/http.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcurementManagementService {
  private budgetSub = new BehaviorSubject<any>(false);
  private codesSub = new BehaviorSubject<any>(false);
  private procurementOrderSub = new BehaviorSubject<any>(false);
  private orderEditSub = new BehaviorSubject<any>(false);
  private billSub = new BehaviorSubject<any>(false);
  private PurchaseOrdersItemsSub = new BehaviorSubject<any>(false);

  POId: any = '';
  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService
  ) {}
  getCodes() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'Procurement',
    };
    this.codesSub.next(false);
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
        this.codesSub.next(value);
      });
  }

  get Codes$() {
    return this.codesSub.asObservable();
  }
  // getbudget
  getBudget() {
    this.budgetSub.next(false);
    return this.http
      .getData('/Procurement/Budget', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.budgetSub.next(value);
      });
  }
  get budget$() {
    return this.budgetSub.asObservable();
  }

  addBudget(body: any) {
    return this.http.saveData('/Procurement/Budget', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  addImage(body: any) {
    return this.http.saveFormDate('/Store/BudgetImage', {
      ...body,
    });
  }
  deleteBudget(ID: any) {
    return this.http.deleteDate('/Procurement/Budget', {
      ID: ID,
    });
  }

  // get procurementOrder
  getProcurementOrder(Filtrt?: any) {
    if (!Filtrt) Filtrt = {};

    this.procurementOrderSub.next(false);
    return this.http
      .getData('/Procurement/Order', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...this.viewDataFilterService.datafilterModel?.procurementManagement
          ?.dataFilter?.params,
      })
      .subscribe((value) => {
        this.procurementOrderSub.next(value);
      });
  }
  get procurementOrders$() {
    return this.procurementOrderSub.asObservable();
  }
  // get Order Edit
  getOrderEdit() {
    this.orderEditSub.next(false);
    return this.http
      .getData('/Procurement/Order', {
        LocationId: localStorage.getItem('defaultLocation'),
        ID: this.POId,
      })
      .subscribe((value) => {
        this.orderEditSub.next({ ...value[0], IsSendRequest: false });
      });
  }
  get OrderEdit$() {
    return this.orderEditSub.asObservable();
  }
  updateOrderEdit(newValue: any) {
    this.orderEditSub.next({
      ...this.orderEditSub.value,
      ...newValue,
    });
  }
  // add procurementOrder

  addProcurementOrder(body: any) {
    return this.http.saveData('/Procurement/Order', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  // delete procurementOrder

  deleteProcurementOrder(ID: any) {
    return this.http.deleteDate('/Procurement/Order', {
      ID: ID,
    });
  }
  // addItemInPart
  addItemInPart(body: any) {
    return this.http.saveDataArray('/Procurement/OrderItem', body);
  }
  // deleteItemInPart
  deleteItemInPart(ID: any) {
    return this.http.deleteDate('/Procurement/OrderItem', { ID: ID });
  }

  // add Bill
  addBill(body: any) {
    return this.http.saveDataArray('/Procurement/OrderBill', body);
  }

  // get Bill
  getBill() {
    this.billSub.next(false);
    return this.http
      .getData('/Procurement/OrderBill', {
        POId: this.POId,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((Value) => {
        this.billSub.next(Value[0].Data);
        this.PurchaseOrdersItemsSub.next(Value[0].PurchaseOrdersItems);
      });
  }
  get bill$() {
    return this.billSub.asObservable();
  }
  get PurchaseOrdersItems$() {
    return this.PurchaseOrdersItemsSub.asObservable();
  }
  // delete OrderBill
  deleteOrderBill(ID: any) {
    return this.http.deleteDate('/Procurement/OrderBill', { ID: ID });
  }

  changeStatus(body: any) {
    return this.http.saveData('/Procurement/OrderStage', {
      ...body,
    });
  }

  OrderReject(notes: string) {
    return this.http.saveData('/Procurement/OrderReject', {
      id: this.POId,
      requestDisapproveNote: notes,
    });
  }

  // getDataForExcel(params?: any) {
  //   return this.http.getData('/Procurement/Order', {
  //     ...params,
  //     RowCount: 2002153,
  //     LocationId: localStorage.getItem('defaultLocation'),
  //   });
  // }
  getDataForExcel(params?: any) {
    this.http
      .ExportToExcel('/Procurement/Order', {
        ...params,
        LocationId: localStorage.getItem('defaultLocation'),
        RowCount: 2002153,
      })
      .subscribe();
  }
}
