import { map, tap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment.prod';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ppmTasksService } from '../ppm-tasks.service';
import { UsersAndTeamsService } from '../modals/filter-for-print-pdf/User&TeamsModal/user&TeamsModal.service';

@Component({
  selector: 'app-report-work-order-pdf',
  templateUrl: './report-work-order-pdf.component.html',
  styleUrls: ['./report-work-order-pdf.component.scss'],
})
export class ReportWorkOrderPdfComponent implements OnInit {
  DataTasksForReport$: Observable<any>;
  constructor(private _workOrderService: ppmTasksService, private usersAndTeamsService: UsersAndTeamsService) {}
  Avatar = environment.Avatar;
  SettingReportByLocation: any;
  FilterReport: any;
  dir: any = document.dir;
  usersSignatureSelected: any[] = [];
  @ViewChild('printPdf') printPdf: ElementRef<any>;
  // isprintPdf=false
  ngOnInit(): void {
    this.DataTasksForReport$ = this._workOrderService.DataTasksForReport$.pipe(
      tap((value: any) => {
        if (value && value?.length != 0) {
          this.FilterReport = this._workOrderService.FilterReport;
          setTimeout(() => {
            this.printPdf?.nativeElement?.click();
          }, 1000);
        }
      }),
      );
    this._workOrderService.getSettingReportByLocation().subscribe((value) => {
      this.SettingReportByLocation = value;
    });
    this.usersAndTeamsService.userSignatures$.subscribe((res: any)=> this.usersSignatureSelected = res?.Data)
  }
  fixWithDateToday(data: any) {
    return moment(new Date(data)).isBefore(new Date());
  }
  ArrayToString(data: any) {
    if (data) {
      return data
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
    }
  }
  get Description() {
    return this.FilterReport?.description;
  }
  ngOnDestroy(): void {
    this._workOrderService.DataTasksForReportSub.next([]);
    // this.usersAndTeamsService.userSignatures$.unsubscribe();
  }
}
