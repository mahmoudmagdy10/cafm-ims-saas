import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceRequestsService {
  constructor(
    private http: HttpService,
    private FieldManagmentService: FieldManagmentService
  ) {}
  codesSub$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  dataFeildsSub$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  WorkRequestGatesSub$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  // data WorkRequestGates
  getWorkRequestGates() {
    this.http
      .getData('/WorkRequests/Gate', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .pipe(
        map((value) => {
          return value
            ? value.map((item: any) => {
                return {
                  ...item,
                  VendorsFields: item.WorkRequestGatesFields,
                };
              })
            : '';
        })
      )
      .subscribe((value) => {
        this.WorkRequestGatesSub$.next(value);
      });
  }
  get WorkRequestGates$(): Observable<any> {
    return this.WorkRequestGatesSub$.asObservable();
  }
  EditWorkRequestGates(body: any) {
    return this.http.saveData('/WorkRequests/Gate', body);
  }
  //  Code
  getCodeWorkRequestGates() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'WorkRequestGates',
    };
    this.http
      .getData('/Code', params)
      .pipe()
      .subscribe((value) => {
        this.codesSub$.next(value);
        this.FieldManagmentService.ChangeCode$ = value;
      });
  }
  get Code$(): Observable<any> {
    return this.codesSub$.asObservable();
  }
  getFeild() {
    const body = {
      LocationId: localStorage.getItem('defaultLocation'),
      ComponentType: 'WorkRequestGates',
    };
    this.http.getData('/Components/CommonFields', body).subscribe((value) => {
      this.dataFeildsSub$.next(value);
    });
  }
  get DataFeild$(): Observable<any> {
    return this.dataFeildsSub$.asObservable();
  }
  addFieldWorkRequestGates(body: any) {
    return this.http.saveData('/Components/Fields', {
      ...body,
      ComponentType: 'WorkRequestGates',
    });
  }

  //add field File in WorkRequestGates
  addFieldFileWorkRequestGates(body: any) {
    return this.http.saveFormDate('/Components/S3FieldsFile', {
      ...body,
      ComponentType: 'WorkRequestGates',
    });
  }

  // Delete Field In WorkRequestGates
  deleteFieldInWorkRequestGates(Params: any) {
    return this.http.deleteDate('/Components/Fields', {
      ...Params,
      ComponentType: 'WorkRequestGates',
    });
  }

  // Transfer Settings between Locaton
  TransferSettingsBetweenLocaton(body: any) {
    return this.http.saveData('/WorkRequests/GateTransferSettings', body);
  }
  // change States
  changeStates(body: any) {
    return this.http.saveData('/WorkRequests/GateUpdateStatus', body);
  }
  //delete Common  Feild
  deleteCommonFeild(body: any) {
    return this.http.deleteDate('/Components/CommonFields', {
      ...body,
      ComponentType: 'WorkRequestGates',
    });
  }
  //get Feild ById
  getFeildById(id: any) {
    const body = {
      LocationId: localStorage.getItem('defaultLocation'),
      ID: id,
      ComponentType: 'WorkRequestGates',
    };
    return this.http.getData('/Components/CommonFields', body);
  }

  // CommonFeild
  addCommonFeild(body: any) {
    return this.http.saveData('/Components/CommonFields', {
      ...body,
      ComponentType: 'WorkRequestGates',
    });
  }

  saveImageWorkRequest(body: any) {
    return this.http.saveFormDate('/WorkRequests/GateImageS3', body);
  }

  //  Add Catigories In Asset
  AddCategories(Name: any) {
    return this.http.saveData('/Components/Categories', {
      categoryName: Name,
      ComponentType: 'WorkRequestGates',
    });
  }
  //  Delete Catigories In Asset
  DeleteCategories(Params: any) {
    return this.http.deleteDate('/Components/Categories', Params);
  }
  getDataForExcel(params?: any) {
    return this.http.ExportToExcel('/WorkRequests/Gate', {
      ...params,
      RowCount: 2002153,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
}
