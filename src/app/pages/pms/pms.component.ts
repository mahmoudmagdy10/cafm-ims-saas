import { ViewDataFilterService } from './../../shared/components/view-data-filter/view-data-filter.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { addPMTask } from './modals/addPMTask/addPMTask.component';
import { PMFilter } from './modals/filter/pm-filter.component';
import { PmsService } from './pms.service';
import { Observable, Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { tap, skip, catchError } from 'rxjs/operators';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WeeklyPrintComponent } from './modals/Weekly-print/Weekly-print.component';
import { PMcardCopy } from './modals/pm-card-in-create/pm-card.component';
import { BalancedRedistributionDialogComponent } from './modals/balanced-redistribution-dialog/balanced-redistribution-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pms',
  templateUrl: './pms.component.html',
  styleUrls: ['./pms.component.scss'],
})
export class PmsComponent implements OnInit, OnDestroy, AfterViewInit {
  pmsData$: Observable<any>;
  IDDeleted: any;
  viewType: any = 'List';
  interval: any;
  subscription: Subscription;
  subscriptionForDataFilter: Subscription;
  @ViewChild('TABLE') table: ElementRef;
  pmsExcel$: Observable<any>;
  CodeObz$: Observable<any>;
  loadingPrint: boolean = false;
  AllSchedulesTimeCalender$: Observable<any>;
  isSoftService: any;

  constructor(
    public dialog: MatDialog,
    private service: PmsService,
    private auth: AuthService,
    private _viewDataFilterService: ViewDataFilterService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('PPM', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.getDataPms();
        this.service.getAllSchedulesTime();
      });
  }
  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$.pipe(
      tap((val) => {
      })
    );
    this.isSoftService = this.route.snapshot.data.isSoftService;
    this.getDataPms();
    this.service.getCodePms();
    this.service.getAllSchedulesTime();
    this.Refresh();
    this.AllSchedulesTimeCalender$ = this.service.AllSchedulesTimeCalender$;
  }

  getDataPms() {
    this.service.getAllPms();

    this.pmsData$ = this.service.DataPms$;
  }

  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.service.getCodePms();
          this.service.getAllSchedulesTime();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.service.getCodePms();
        this.service.getAllSchedulesTime();
        this.service.getAllPms();
      }
    });
  }

  addPMTask() {
    const dialogRef = this.dialog
      .open(addPMTask, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.getDataPms();
      }
    });
  }
  // ,fromScheduleTime:fromScheduleTime

  Card(ID: any, upComingTab?: boolean, fromScheduleTime = false) {
    this.service.getSchedulesTimeByPMSID(ID);

    const dialogRef = this.dialog
      .open(PMcardCopy, {
        width: '70vw',
        data: { ID: ID, upComingTab: upComingTab },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      this.getDataPms();
    });
  }

  Filter() {
    const dialogRef = this.dialog
      .open(PMFilter, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((dataFilter) => {
      this.service.getAllSchedulesTimeCalender({
        FromDate: this.service.FromDate,
        ToDate: this.service.ToDate,
      });
    });
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
  weeklyPrint() {
    const dialogRef = this.dialog
      .open(WeeklyPrintComponent, {
        width: '50vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscriptionForDataFilter.unsubscribe();
    this.subscription?.unsubscribe();
  }

  export() {
    this.pmsExcel$ = this.service.getDataForExcel().pipe(
      tap((value) => {
        setTimeout(() => {
          ExportTOExcelShared(this.table.nativeElement);
        }, 300);
      })
    );
  }
  @ViewChild('Report') Report!: ElementRef<HTMLImageElement>;
  exportPDF() {
    html2canvas(this.Report.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF({
        orientation: 'portrait',
      });

      const imageProps = pdf.getImageProperties(imgData);

      const pdfw = pdf.internal.pageSize.getWidth();

      const pdfh = (imageProps.height * pdfw) / imageProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

      pdf.save('output.pdf');
    });
  }

  get WorkOrderSelected() {
    return this.service.PPMSelected;
  }
  print() {
    this.loadingPrint = true;

    this.service
      .printSelected()
      .pipe(
        catchError((value) => {
          this.loadingPrint = false;
          this.cdr.detectChanges();
          return of([]);
        })
      )
      .subscribe((value) => {});
  }
  BalancedRedistribution() {
    const dialogRef = this.dialog
      .open(BalancedRedistributionDialogComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((result) => {
      this.service.getAllSchedulesTimeCalender({
        fromDate: this.service.FromDate,
        toDate: this.service.ToDate,
      });
    });
  }
}
