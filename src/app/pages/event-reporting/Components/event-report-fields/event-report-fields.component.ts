import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventReportingService } from '../../event-reporting.service';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-event-report-fields',
  templateUrl: './event-report-fields.component.html',
  styleUrls: ['./event-report-fields.component.css']
})
export class EventReportFieldsComponent implements OnInit {
  fieldData: any;
  eventsReportById$: Observable<any>;
  dropdownValues: any[] = [];
  resonsData: any[] = [];
  dropdownFormControls: UntypedFormControl[] = [];
  isloading: boolean = false;
  lang: string = 'ar';
  constructor(
    public dialogRef: MatDialogRef<EventReportFieldsComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private eventReportingService:EventReportingService,
  ) {
    this.dropdownValues.forEach((value) => {
      this.dropdownFormControls.push(new UntypedFormControl(value));
    });
    this.lang = localStorage.getItem('language') || 'ar';
  }

  ngOnInit(): void {
    this.eventReportingService.getEventReportingById(this.item);
    this.eventReportingService.eventReportsById$.subscribe(res => {
      this.eventsReportById$ = this.eventReportingService.SelectorById$();
      this.fieldData = res.data[0];
      this.isloading = res.loading;
      this.dropdownValues = this.fieldData?.Fields?.map((field:any)=> +field.FieldValue);
    });
    this.eventReportingService.getEventReason().subscribe((res)=> {
      this.resonsData = res;
    });
  }
  Close() {
    this.dialogRef.close();
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

}
