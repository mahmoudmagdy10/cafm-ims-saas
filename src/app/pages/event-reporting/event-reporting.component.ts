import { Component, OnInit } from '@angular/core';
import { EventReportingService } from './event-reporting.service';
import { MatDialog } from '@angular/material/dialog';
import { EventReportFieldsComponent } from './Components/event-report-fields/event-report-fields.component';
import { Observable } from 'rxjs';
import { ModalCloseReportComponent } from './Components/modal-close-report/modal-close-report.component';
import { TagsmanagementModalService } from '../settings/configurations/modals/tagsmanagementModal/tagsmanagement-modal.service';
import { MaintenanceRequestService } from 'src/app/public/maintenance-request/maintenance-request.service';
import { FilterReportsComponent } from './Components/filter-reports/filter-reports.component';

@Component({
  selector: 'app-event-reporting',
  templateUrl: './event-reporting.component.html',
  styleUrls: ['./event-reporting.component.scss']
})
export class EventReportingComponent implements OnInit {
  allEventReportsData: any;
  selectedTagIdOption: any;
  eventsReport$: Observable<any>;
  isloading: boolean = false;
  displaymodalFilter: boolean = false;
  displayDataFilter: boolean = false;
  isClearFilter: boolean = false;
  tagsDropdownOptions: any[] = [];
  priorityOptions: any[] = [];
  locationId: number = 0;
  dataFiltered: any = null;
  RequesterName: any = null;
  constructor(private eventReportingService: EventReportingService, private dialog: MatDialog, private maintenanceRequestService: MaintenanceRequestService) { }

  ngOnInit(): void {
    this.eventReportingService.getEventReporting();
    this.eventsReport$ = this.eventReportingService.Selector$();
    this.eventsReport$.subscribe((res)=> {
      this.isloading = res.loading;
    });
    this.maintenanceRequestService.getCodeWorkRequest(localStorage.getItem('defaultLocation')).subscribe((res)=> {
      this.priorityOptions = [{ code: null, Name: 'Select' } , ...res.PriorityId];
      this.tagsDropdownOptions = [{ code: null, Name: 'Select' }, ...res.TagsId];
    });
  }
  showFields(item: any) {
    const dialogRef = this.dialog
      .open(EventReportFieldsComponent, {
        width: '60vw',
        data: item,
        disableClose: true,
        autoFocus:false
      })
      .addPanelClass('cmms-custom-modal');
  }
  handleOpenReport(report: any){
    this.eventReportingService.reopenWorkRequestEvent({
      locationId: String(report.LocationId),
      workRequestID: String(report.ID),
    }).subscribe((res)=> {
      this.eventReportingService.getEventReporting();
    })
  }
  handleCloseReport(report: any){
    const dialogRef = this.dialog
    .open(ModalCloseReportComponent, {
      width: '60vw',
      data: report,
      disableClose: true,
      autoFocus:false
    })
    .addPanelClass('cmms-custom-modal');
  }
  onDropdownChangeCatogeryId(event:any, report: any){
    this.eventReportingService.saveEVRTagUpdate({
      id: String(report.ID),
      locationId: String(report.LocationId),
      tagId: String(event.value)
    }).subscribe((res)=> {});
  }

  onDropdownChangePriorityId(event:any, report: any){
    this.eventReportingService.saveEVRPriorityUpdate({
      id: String(report.ID),
      locationId: String(report.LocationId),
      priorityId: String(event.value),
    }).subscribe((res)=> {});
  }
  openFilter(){
    this.displaymodalFilter = true;
  }

  clearFilter(){
    this.eventReportingService.getEventReporting();
    this.eventsReport$ = this.eventReportingService.Selector$();
    this.displayDataFilter = false;
    this.dataFiltered = null;
    this.isClearFilter = true;
  }
  getFilterData(data: any){
    this.displayDataFilter = true;
    this.displaymodalFilter = false;
    this.dataFiltered = data;
    // if(data.PriorityId){
    //   this.dataFiltered.PriorityId = this.priorityOptions.find((prio)=> prio.code == data?.PriorityId)?.Name;
    // }
    // if(data.TagId){
    //   this.dataFiltered.TagId = this.tagsDropdownOptions.find((prio)=> prio.code == data?.TagId)?.Name;
    // }
  }
}

