import { TranslateService } from '@ngx-translate/core';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpService } from 'src/app/modules/auth/services/http.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';

@Injectable({
  providedIn: 'root',
})
export class VendorsService {
  Codes$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  AllVendors$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  AllVendors = [];
  resetSelected: Subject<any> = new Subject<any>();
  selectedPageVendor$: Observable<any> = this.resetSelected.asObservable();
  selectedPageVendor = 1;
  RowCount: any = 50;
  constructor(
    private http: HttpService,
    private FieldManagmentService: FieldManagmentService,
    private viewDataFilterService: ViewDataFilterService,
    private _translateService: TranslateService
  ) {}
  //  Code
  getCodeVendors() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),

      ScreenName: 'Vendors',
    };
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
        this.Codes$.next(value);
        this.FieldManagmentService.ChangeCode$ = value;
      });
  }
  getCodeObz$() {
    return this.Codes$.asObservable();
  }

  //  get All Vendors
  getAllVendors(Filter?: any) {
    if (!Filter) Filter = {};

    this.AllVendors$.next(undefined);
    this.http
      .getData('/Vendors', {
        LocationId:
          Filter?.LocationId || localStorage.getItem('defaultLocation'),
        ...this.viewDataFilterService.datafilterModel?.Vendors?.dataFilter
          ?.params,
        RowCount: this.RowCount,
        CurrentPage: this.selectedPageVendor,
        ...Filter,
      })

      .subscribe((value) => {
        // this.AllVendors = value.Data;
        this.AllVendors$.next(value);
      });
  }
  getAllVendorsObz$() {
    return this.AllVendors$.asObservable();
  }

  // Add or Edit Vendor
  AddVendor(body: any) {
    return this.http.saveData('/Vendors', body);
  }
  // delete Vendor
  deleteVendor(ID: any) {
    return this.http.deleteDate('/Vendors', { ID: ID });
  }
  // Link asset with Vendor
  linkAssetWithVendor(body: any) {
    return this.http.saveData('/Vendors/Assets', body);
  }
  // delete asset with Vendor
  deleteAssetWithVendor(body: any) {
    return this.http.deleteDate('/Vendors/Assets', body);
  }

  linkPartWithVendor(body: any) {
    return this.http.saveData('/Store/VendorParts', body);
  }

  deleteLinkPartWithVendor(body: any) {
    return this.http.deleteDate('/Store/VendorParts', body);
  }
  Data: any;
  getDataForExcel(params?: any) {
    this.http
      .getData('/Vendors', {
        ...params,
        RowCount: 2002153,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.Data = val?.Data;
        let dataForExcel: any[] = [];
        this.Data?.forEach((item: any, index: any) => {
          dataForExcel.push({
            ['#']: index,
            [this._translateService.instant('VENDORS.TABLE.NAME')]:
              item.VendorName,
            [this._translateService.instant('VENDORS.TABLE.EMAIL')]: item.Email,
            [this._translateService.instant('VENDORS.TABLE.PHONE')]: item.Phone,
            [this._translateService.instant('VENDORS.TABLE.CONTACT')]:
              item.LicenseNumber,
            [this._translateService.instant('VENDORS.TABLE.ADDRESS')]:
              item.Address,
          });
        });
        this.http.downloadExcel(dataForExcel, 'Vendor');
      });
  }
}
