import { ViewDataFilterService } from './../../shared/components/view-data-filter/view-data-filter.service';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TemplatesForSopService } from './TemplatesForSop.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { tap, skip } from 'rxjs/operators';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { addSopTemplate } from './modals/addSopTemplate/addSopTemplate.component';
import { SopTemplateCard } from './modals/SopTemplateCard/SopTemplateCard.component';
import { TemplatesForSopFilter } from './modals/filter/pm-filter.component';

@Component({
  selector: 'app-TemplatesForSop',
  templateUrl: './TemplatesForSop.component.html',
  styleUrls: ['./TemplatesForSop.component.scss'],
})
export class TemplatesForSopComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  pmsData$: Observable<any>;
  IDDeleted: any;
  viewType: any = 'List';
  interval: any;
  subscription: Subscription;
  subscriptionForDataFilter: Subscription;
  @ViewChild('TABLE') table: ElementRef;
  pmsExcel$: Observable<any>;
  CodeObz$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private service: TemplatesForSopService,
    private toastr: ToastrService,
    private auth: AuthService,
    private _viewDataFilterService: ViewDataFilterService
  ) {}
  ngAfterViewInit(): void {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('PPM', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.getDataPms();
      });
  }
  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$;
    this.getDataPms();
    this.service.getCodePms();
    this.service.getAllSchedulesTime();
    this.Refresh();
  }
  getDataPms() {
    this.service.getAllPms();
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
      }
    });
  }
  addPMTask() {
    const dialogRef = this.dialog
      .open(addSopTemplate, {
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
      .open(SopTemplateCard, {
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
      .open(TemplatesForSopFilter, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
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
}
