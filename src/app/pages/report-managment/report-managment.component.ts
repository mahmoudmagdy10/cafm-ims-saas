import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ManageReportComponent } from './manage-report/manage-report.component';
import { ReportManagmentService } from './report-managment.service';

@Component({
  selector: 'app-report-managment',
  templateUrl: './report-managment.component.html',
  styleUrls: ['./report-managment.component.scss'],
})
export class ReportManagmentComponent implements OnInit {
  reports$: Observable<any>;
  constructor(
    private _reportManagmentService: ReportManagmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this._reportManagmentService.getReports();
    this.reports$ = this._reportManagmentService.Selector$('Reports');
  }
  Manage(item: any) {
    const dialogRef = this.dialog
      .open(ManageReportComponent, {
        width: '60vw',
        data: item,
        disableClose: true,
        autoFocus:false
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
