import { TranslateService } from '@ngx-translate/core';
import { map, filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Injectable({
  providedIn: 'root',
})
export class SparePartService {
  exportDataExcel: any;

  private storesSub = new BehaviorSubject<any>(false);
  private codesSub = new BehaviorSubject<any>(false);
  private sparePartsSub = new BehaviorSubject<any>(false);
  private itemEditSub = new BehaviorSubject<any>(false);
  private PartAdjustmentsSub = new BehaviorSubject<any>(false);
  private TransactionsSub = new BehaviorSubject<any>(false);
  private PartIDEdit: number;
  RowCount: any = 50;
  constructor(
    private http: HttpService,
    private FieldManagmentService: FieldManagmentService,
    private viewDataFilterService: ViewDataFilterService,
    private _translateService: TranslateService
  ) {}

  getCodes() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'Store',
    };
    this.codesSub.next(false);
    this.http
      .getData('/Code', params)
      .pipe(
        map((code: any) => {
          return {
            ...code,
            AssetId: code?.AssetId?.map((value: any) => {
              return {
                ...value,
                label: value.AssetName + ' (' + value.CategoryName + ') ',
                key: value.AssetName,
                data: 'Documents Folder',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
              };
            }),
          };
        })
      )
      .subscribe((value) => {
        this.codesSub.next(value);
        this.FieldManagmentService.ChangeCode$ = value;
      });
  }

  get Codes$() {
    return this.codesSub.asObservable();
  }
  // getSpareParts
  getSpareParts(filter?: any) {
    if (!filter) filter = {};
    this.sparePartsSub.next(false);
    return this.http
      .getData('/Store/Part', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...this.viewDataFilterService.datafilterModel?.sparParts?.dataFilter
          ?.params,
        RowCount: this.RowCount,
        ...filter,
      })
      .subscribe((value) => {
        this.sparePartsSub.next(value);
      });
  }
  get SpareParts$() {
    return this.sparePartsSub.asObservable();
  }

  addSpareParts(body: any) {
    return this.http.saveData('/Store/Part', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  deleteSpareParts(ID: any) {
    return this.http.deleteDate('/Store/Part', {
      ID: ID,
    });
  }

  getStores() {
    this.storesSub.next(false);
    return this.http
      .getData('/Store', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.storesSub.next(value);
      });
  }
  get Stores$() {
    return this.storesSub.asObservable();
  }
  addStore(body: any) {
    return this.http.saveData('/Store', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  deleteStore(ID: any) {
    return this.http.deleteDate('/Store', {
      ID: ID,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }

  // item SpareParts
  getItemEdit(ID: any) {
    this.PartIDEdit = ID;
    this.itemEditSub.next(false);
    return this.http
      .getData('/Store/Part', {
        LocationId: localStorage.getItem('defaultLocation'),
        ID: ID,
      })
      .pipe(
        map((value) => {
          return value
            ? value?.Data?.map((item: any) => {
                return {
                  ...item,
                  VendorsFields: item.PartsFields,
                };
              })
            : '';
        }),
        map((value) => value[0])
      )
      .subscribe((value) => {
        this.itemEditSub.next(value);
      });
  }
  get itemEdit$() {
    return this.itemEditSub.asObservable();
  }
  updateItemEdit(newState: any) {
    return this.itemEditSub.next({
      ...this.itemEditSub.value,
      ...newState,
      NotPatch: true,
    });
  }
  addImage(body: any) {
    return this.http.saveFormDate('/Store/PartImage', body);
  }
  linkPartWithAsset(body: any) {
    return this.http.saveDataArray('/Store/AssetParts', body);
  }
  linkPartWithVendor(body: any) {
    return this.http.saveData('/Store/VendorParts', body);
  }
  deleteLinkPartWithAsset(body: any) {
    return this.http.deleteDate('/Store/AssetParts', body);
  }
  deleteLinkPartWithVendor(body: any) {
    return this.http.deleteDate('/Store/VendorParts', body);
  }

  addPartAdjustments(body: any) {
    return this.http.saveData('/Store/PartAdjustments', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  getPartAdjustments() {
    this.PartAdjustmentsSub.next(false);
    this.http
      .getData('/Store/Adjustments', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.PartAdjustmentsSub.next(value);
      });
  }
  get PartAdjustments$() {
    return this.PartAdjustmentsSub.asObservable();
  }
  PartAdjustmentsComplete(ID: any) {
    return this.http.saveData('/Store/PartAdjustmentsComplete', {
      ID: ID,
    });
  }
  deleteAdjustment(ID: any) {
    return this.http.deleteDate('/Store/Adjustments', {
      ID: ID,
    });
  }
  PartTransactionInitialValue(body: any) {
    return this.http.saveData('/Store/PartTransactionInitialValue', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  PartTransactionFromStore(body: any) {
    return this.http.saveData('/Store/PartTransactionFromStore', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  PartTransactionFromLocation(body: any) {
    return this.http.saveData('/Store/PartTransactionFromLocation', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  getStoresByLocation(LocationId: any) {
    return this.http.getData('/Store', {
      LocationId: LocationId,
    });
  }

  getTransactions(filter?: any) {
    this.TransactionsSub.next(false);
    this.http
      .getData('/Store/Transactions', {
        PartID: this.PartIDEdit,
        ...filter,
      })
      .subscribe((value) => {
        this.TransactionsSub.next(value);
      });
  }
  get Transactions$() {
    return this.TransactionsSub.asObservable();
  }
  deleteTransaction(ID: any) {
    return this.http.deleteDate('/Store/TransactionsDelete', { ID: ID });
  }

  getPartStockQuantity(PartId: any, StoreId: any) {
    return this.http.getData('/Store/PartStockQuantity', {
      PartId: PartId,
      SotreId: StoreId,
    });
  }
  // getDataForExcel(params?: any) {
  //   this.http
  //     .ExportToExcel('/Store/Part', {
  //       ...params,
  //       RowCount: 2002153,
  //       LocationId: localStorage.getItem('defaultLocation'),
  //     })
  //     .subscribe();
  // }
  getDataForExcel(params?: any) {
    this.http
      .getData('/Store/Part', {
        ...params,
        RowCount: 2002153,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.exportDataExcel = val?.Data;
        let dataForExcel: any[] = [];
        this.exportDataExcel?.forEach((item: any, index: any) => {
          dataForExcel.push({
            ['#']: index,
            [this._translateService.instant('STORES.TABLE.NAME')]:
              item.PartName,
            [this._translateService.instant(
              'ASSETS.ASSETCARDMODAL.BASICDATATAB.ADDFIELDMODAL.CATERORY'
            )]: item.CategoryName,
            [this._translateService.instant('STORES.TABLE.NUMBER')]:
              item.PartNumber,
            [this._translateService.instant('STORES.TABLE.QUANTITY')]:
              item.InStockQuantity,
            [this._translateService.instant('STORES.TABLE.PRICE')]:
              item.AveragePrice,
          });
        });
        this.http.downloadExcel(dataForExcel, 'Users');
      });
  }
}
