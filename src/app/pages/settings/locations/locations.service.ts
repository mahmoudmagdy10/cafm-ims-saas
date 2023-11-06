import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, shareReplay, tap } from 'rxjs/operators';
import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
@Injectable({ providedIn: 'root' })
export class LocationService {
  exportDataExcel: any;

  private serverUrl = 'http://49.12.56.114:1012/api';

  LocationAndSubLocationSub: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  LocationSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  locationSelected: any[] = [];
  resetSelected: Subject<any> = new Subject<any>();
  selectedPageLocations: any = 1;
  selectedPageLocations$: Observable<any> = this.resetSelected.asObservable();
  Filter: any;
  RowCount: any = 50;

  constructor(
    private http: HttpService,
    private HttpClient: HttpClient,
    private viewDataFilterService: ViewDataFilterService,
    private _translateService: TranslateService
  ) {}

  GetLocationAndSubLocation(Filtrt?: any) {
    if (!Filtrt) Filtrt = {};
    return this.http
      .getData('/Location/LocationSublocationList', {
        ...this.viewDataFilterService.datafilterModel?.locations?.dataFilter
          ?.params,
        RowCount: this.RowCount,
        CurrentPage: this.selectedPageLocations,
        ...Filtrt,
      })
      .subscribe((res: any) => {
        let newRes = res?.Data?.map((value: any) => {
          return {
            ...value,
            isEndDateCompleted: value?.LocationFiles?.some(
              (value: any) => value?.isEndDateCompleted
            ),
          };
        });
        this.LocationAndSubLocationSub.next({
          Data: newRes,
          Setting: res?.Setting,
        });
      });
  }
  GetLocation() {
    return this.http.getData('/Location').subscribe((res: any) => {
      let newRes = res?.map((value: any) => {
        return {
          ...value,
          isEndDateCompleted: value?.LocationFiles?.some(
            (value: any) => value?.isEndDateCompleted
          ),
        };
      });
      this.LocationSub.next(newRes);
    });
  }
  deleteAsset(ID: any) {
    const Params = {
      ID: ID,
    };
    return this.http.deleteDate('/Assets', Params);
  }
  deletSelectedAsset(ID: any) {
    const Params = {
      // ID: ID,
      ID: this.locationSelected.join(','),
    };
    return this.http.deleteDate('/Assets', Params);
  }
  deletSelectedAssets(ID: any) {
    const Params = {
      // ID: ID,
      ID: this.locationSelected.join(','),
    };
    return this.http.deleteDate('/Location', Params);
  }
  getCodeLocation() {
    return this.http
      .getData(
        '/Code?ScreenName=Locations&LocationId=' +
          localStorage.getItem('defaultLocation')
      )
      .pipe(shareReplay(1));
  }
  get locationsAndSubLocation$() {
    return this.LocationAndSubLocationSub.asObservable();
  }
  get location$() {
    return this.LocationSub.asObservable();
  }
  deleteLocation(id: any) {
    return this.http.deleteDate('/Location', { LocationId: id });
  }
  addLocation(body: any) {
    return this.http.saveData('/Location', body);
  }
  UpdateLocation(body: any) {
    return this.http.saveData('/Location/Update', body);
  }
  getLocationById(id: any) {
    return this.http.getData(`/Location?LocationId=${id}`);
  }

  saveImageLocation(body: any) {
    return this.http.saveFormDate(`/Location/S3Image`, body);
  }
  deleteLoc(body: any) {
    return this.http.deleteDate(`/Location`, {
      ...body,
    });
  }
  // getDataForExcel(params?: any) {
  //   this.http
  //     .ExportToExcel('/Location', {
  //       ...params,
  //       RowCount: 2002153,
  //       LocationId: localStorage.getItem('defaultLocation'),
  //     })
  //     .subscribe();
  // }
  getDataForExcel(params?: any) {
    this.http
      .getData('/Location', {
        ...params,
        RowCount: 2002153,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.locationsAndSubLocation$.subscribe((val: any) => {
          console.log('locationsAndSubLocation', val);
          this.exportDataExcel = val?.Data;
        });
        let dataForExcel: any[] = [];
        this.exportDataExcel?.forEach((item: any, index: any) => {
          console.log('forEach', item);
          dataForExcel.push({
            ['#']: index,
            [this._translateService.instant('LOCATIONS_MANAGEMENT.SITE_NAME')]:
              item.title,
            [this._translateService.instant(
              'LOCATIONS_MANAGEMENT.USERS_NUMBER'
            )]: item.UserCount,
            [this._translateService.instant(
              'LOCATIONS_MANAGEMENT.SUB_LOCATION_NUMBER'
            )]: item.NumberOfSublocations,
            [this._translateService.instant(
              'LOCATIONS_MANAGEMENT.ASSETS_NUMBER'
            )]: item.AssestsCount,
          });
          console.log('push', dataForExcel);
        });
        this.http.downloadExcel(dataForExcel, 'locations');
        console.log('downloadExcel', dataForExcel);
      });
  }

  addFileForLocation(locationID: any, body: any) {
    return this.http.saveDataWithOutMapping(
      '/Location/S3LocationFiles?LocationId=' + locationID,
      body
    );
  }
  saveLocationForSettingReport(body: any) {
    return this.http.saveFormDate(`/Location/S3LocationReportSetting`, body);
  }
  getLocationForSettingReport(LocationId: any) {
    return this.http.getData(`/Location/LocationReportSetting`, {
      LocationId: LocationId,
    });
  }
  DateAndTime = new BehaviorSubject<any>(undefined);
  DateAndTime$ = this.DateAndTime.asObservable();

  getDate() {
    this.http
      .getData('/Code/CurrentDateTime', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.DateAndTime.next(val.CurrentDate);
      });
  }
  //  deleteFileFromLocation(locationID: any, body: any) {
  //     return this.http.saveDataWithOutMapping(
  //       '/Location/S3LocationFiles?LocationId=' + locationID,
  //       body
  //     );
  //   }
  deleteFileFromLocation(FileUID: any) {
    return this.http.deleteDate('/Location/S3LocationFiles', {
      FileUID: FileUID,
    });
  }
  saveClientAcceptance(body: any) {
    return this.http.saveDataInParam(
      `/Location/ClientAcceptanceOnLocationSave`,
      { LocationId: localStorage.getItem('defaultLocation'), ...body }
    );
  }
  savehasOwnTagsOnly(body:any){
    return this.http.saveData(
      `/Location/TagsAndPiriorty`,
      { LocationId: localStorage.getItem('defaultLocation'), ...body }
    );
  }

  locationList = new BehaviorSubject<any>(undefined);
  locationList$ = this.locationList.asObservable();
  getLocation() {
    this.http.getData('/Location/List').subscribe((value) => {
      this.locationList.next(value);
    });
  }
  // checkServerStatus(): Observable<boolean> {
  //   return this.HttpClient.get(this.serverUrl, { responseType: 'text' }).pipe(
  //     map((response) => response.trim() === 'OK')
  //     // catchError(() => of(false))
  //   );
  // }

  getLoactionExtraService(body:any){
   return  this.http.getData('/Location/ExtraService', body);
  }

  addLocationExtraService(body: any) {
    return this.http.saveData('/Location/ExtraService', body);
  }

  deleteLocationExtraService(body: any) {
    console.log('body :>> ', body);
    return this.http.deleteDate('/Location/ExtraService', body);
  }
}
