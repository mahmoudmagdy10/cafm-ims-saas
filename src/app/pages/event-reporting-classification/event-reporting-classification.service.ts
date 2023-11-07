import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpService } from 'src/app/modules/auth/services/http.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';

@Injectable({
  providedIn: 'root'
})
export class EventReportingClassificationService {
  Codes$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  CommonFieldsByCategoryIdSub: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  IncidentReportsSub: BehaviorSubject<any> = new BehaviorSubject<any>({});
  LoadingSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpService,
    private FieldManagmentService: FieldManagmentService
  ) {}
  //  Code
  getCodeAccidentReports() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'WorkRequestGates',
    };
    this.http.getData('/Code', params).subscribe((value) => {
      this.Codes$.next(value);
      this.FieldManagmentService.ChangeCode$ = value;
    });
  }
  getCodeObz$() {
    return this.Codes$.asObservable();
  }
  //  Common Fields By CategoryId
  getCommonFieldsByCategoryId(CategoryId: any) {
    const params = {
      CategoryId: CategoryId,
      ComponentType: 'WorkRequestGates',
    };
    this.http
      .getData('/Components/CommonFieldsByCategoryId', params)
      .pipe(
        map((data) => {
          return data.map((value: any[]) => {
            return {
              ...value,
              PicturesBase64: [],
              PicturesFile: [],
            };
          });
        })
      )
      .subscribe((value) => {
        this.CommonFieldsByCategoryIdSub.next(value);
      });
  }
  getCommonFieldsByCategoryIdObz$() {
    return this.CommonFieldsByCategoryIdSub.asObservable();
  }
  // add Incident Reports
  addIncidentReports(body: any) {
    return this.http.saveData('/IncidentReports/EventReportClassification', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  // get Incident Reports
  getIncidentReports(body?: any) {
    this.LoadingSub.next(true);
    this.http
      .getData('/IncidentReports/EventReportClassification', {
        ...body,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.IncidentReportsSub.next(value);
        this.LoadingSub.next(false);
      });
  }
  get IncidentReports$() {
    return this.IncidentReportsSub.asObservable();
  }
  get Loading$() {
    return this.LoadingSub.asObservable();
  }
  //add field in asset
  addFieldIncidentReports(body: any) {
    return this.http.saveData('/Components/Fields', {
      ...body,
      ComponentType: 'EventReportClassification',
    });
  }

  //add field File in asset
  addFieldFileIncidentReports(body: any) {
    return this.http.saveFormDate('/Components/S3FieldsFile', {
      ...body,
      ComponentType: 'EventReportClassification',
    });
  }
  //Delete Incident Reports

  deleteIncidentReports(ID: any) {

    return this.http.deleteDate('/IncidentReports/EventReportClassification', {
      ID: ID,
    });
  }

  getDataForExcel(params?: any) {
    return this.http.getData('/IncidentReports/EventReportClassification', {
      ...params,
      RowCount: 2002153,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
}
