import { Component, Inject, OnInit } from '@angular/core';
import { EventReportFieldsComponent } from '../event-report-fields/event-report-fields.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventReportingService } from '../../event-reporting.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-close-report',
  templateUrl: './modal-close-report.component.html',
  styleUrls: ['./modal-close-report.component.scss']
})
export class ModalCloseReportComponent implements OnInit {
  FormReport: UntypedFormGroup;
  resonsData: any[] = [];
  lang: string = 'ar';
  selectedFile: any;
  constructor(
    public dialogRef: MatDialogRef<EventReportFieldsComponent>,
    @Inject(MAT_DIALOG_DATA) public report: any,
    private eventReportingService:EventReportingService,
    public fb: UntypedFormBuilder,
  ) {
    this.FormReport = this.fb.group({
      workRequestID: report.ID,
      LocationId: report.LocationId,
      notes: ['', Validators.required],
      file: [null],
      FilePath: [null],
      closeReasonType: [0, Validators.required],
    });
    this.lang = localStorage.getItem('language') || 'ar';
   }

  ngOnInit(): void {
    this.eventReportingService.getEventReason().subscribe((res)=> {
      this.resonsData = res;
    });
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   this.selectedFile = file;
  //   this.FormReport.patchValue({
  //     file: file
  //   });
  // }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.FormReport.patchValue({
        file: file
      });
    } else {
      this.selectedFile = null;
      this.FormReport.patchValue({
        file: null
      });
    }
  }
  Close() {
    this.dialogRef.close();
  }

  handleCloseReport(){
    if(this.FormReport.controls['FilePath'].value || this.selectedFile) {
      this.eventReportingService.reCloseWorkRequestEventFile({ FilePath: this.FormReport.controls['FilePath'].value, Id: String(this.report.ID), file: this.selectedFile }).subscribe((res)=> {
      })
    }
      this.eventReportingService.reCloseWorkRequestEvent({
      locationId: String(this.report.LocationId),
      workRequestID: String(this.report.ID),
      notes: this.FormReport.controls['notes'].value,
      closeReasonType: this.FormReport.controls['closeReasonType'].value,
    }).subscribe((res)=> {
      if(res){
        this.Close();
        this.eventReportingService.getEventReporting();
      }
    })
  }
}
