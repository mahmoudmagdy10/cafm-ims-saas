import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { HttpService } from 'src/app/modules/auth/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EventReportingService {

  constructor(private _http: HttpService) { }

  eventReports = new BehaviorSubject<any>({
    data: [],
    loading: false
  });

  eventReportsById = new BehaviorSubject<any>({
    data: [],
    loading: false
  });

  eventReports$: Observable<any> = this.eventReports.asObservable();
  eventReportsById$: Observable<any> = this.eventReportsById.asObservable();

  updateEventReports(newState: any) {
    this.eventReports.next({
      ...this.eventReports.value,
      ...newState,
    });
  }

  updateEventReportsById(newState: any) {
    this.eventReportsById.next({
      ...this.eventReports.value,
      ...newState,
    });
  }
  getEventReporting(filter?:any){
    this.updateEventReports({ data: [], loading: true });
    const params = {
      locationId: localStorage.getItem('defaultLocation'),
      id: null,
      ...filter
    }
   this._http.getData('/WorkRequests/EventReporting', params).subscribe(res=> {
    this.updateEventReports({ data: res, loading: false });
   })
  }
  getEventReportingById(eventReportId?: number){
    // this.updateEventReports({ data: [], loading: true });
    const params = {
      locationId: localStorage.getItem('defaultLocation'),
      id: eventReportId,
    }
   this._http.getData('/WorkRequests/EventReporting', params).subscribe(res=> {
    this.updateEventReportsById({ data: res, loading: false });
   })
  }

  Selector$() {
    return this.eventReports$.pipe(
      map((state) => state),
      distinctUntilChanged()
    );
  }
  SelectorById$() {
    return this.eventReportsById$.pipe(
      map((state) => state),
      distinctUntilChanged()
    );
  }
  
  reopenWorkRequestEvent(body: { locationId: string, workRequestID: string }){
    const url = '/WorkRequests/WorkRequestEventReopen';
    return this._http.saveData(url, body);
  }

  reCloseWorkRequestEvent(body: { locationId: string, workRequestID: string, notes: string, closeReasonType: string }){
    const url = '/WorkRequests/EventReportingClose';
    return this._http.saveData(url, body);
  }

  reCloseWorkRequestEventFile(body: { file: any, FilePath: string, Id : string }){
    const url = '/WorkRequests/EventReportFile';
    return this._http.saveFormDate(url, body);
  }

  saveEVRPriorityUpdate(body: { locationId: string, id: string, priorityId: string }){
    const url = '/WorkRequests/EVRPriorityUpdate';
    return this._http.saveData(url, body);
  }
  saveEVRTagUpdate(body: { locationId: string, id: string, tagId: string }){
    const url = '/WorkRequests/EVRTagUpdate';
    return this._http.saveData(url, body);
  }

  getEventReason(){
    const url = '/Configuration/EventReason';
    return this._http.getData(url);
  }
}
