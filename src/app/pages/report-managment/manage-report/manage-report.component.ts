import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportManagmentService } from '../report-managment.service';

@Component({
  selector: 'app-manage-report',
  templateUrl: './manage-report.component.html',
  styleUrls: ['./manage-report.component.scss'],
})
export class ManageReportComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ManageReportComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private _reportManagmentService:ReportManagmentService
  ) {}
  FiltersParameters: any;
  ngOnInit(): void {
    this.FiltersParameters = JSON.parse(this.item?.FiltersParameters!);
  }
  Close() {
    this.dialogRef.close();
  }
  filter() {
    let body = {};
    this.FiltersParameters.forEach((item: any) => {
      body = { ...body, [item?.APIFilterName?.trim()]: item?.value };
    });

    this._reportManagmentService.printReport(this.item?.APIEndPoint,{...body,
      LocationId: localStorage.getItem('defaultLocation'),
    }).subscribe((value) => {
      // const url = window.URL.createObjectURL(value);
      // window.open(url);
      this.dialogRef.close();
    });
  }
}
