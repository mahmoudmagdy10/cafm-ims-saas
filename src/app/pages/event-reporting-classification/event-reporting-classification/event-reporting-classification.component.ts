import { FieldManagmentService } from '../../../shared/components/FieldManagment/FieldManagment.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable, of } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventReportingClassificationService } from './../event-reporting-classification.service';
import { AddReportComponent } from '../modals/add-report/add-report.component';
import { AuthService } from 'src/app/modules/auth';
import { FieldManagmentComponent } from 'src/app/shared/components/FieldManagment/FieldManagment.component';
import { ToastrService } from 'ngx-toastr';
import { FilterIncidentReportComponent } from '../modals/filter/filter.component';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-event-reporting-classification',
  templateUrl: './event-reporting-classification.component.html',
  styleUrls: ['./event-reporting-classification.component.scss']
})
export class EventReportingClassificationComponent implements OnInit {
  @ViewChild('Report') Report!: ElementRef<HTMLImageElement>;

  constructor(
    public dialog: MatDialog,
    public service: EventReportingClassificationService,
    public fieldManagmentService: FieldManagmentService,
    private auth: AuthService,
    private toster: ToastrService
  ) {}
  DataAccidentReport$: Observable<any>;
  feildsViewInTable: any;
  IDFieldDeleted: number;
  subscription: Subscription;
  interval: any;
  IDIncidentReport: number;
  dataFilter = {};
  @ViewChild('TABLE') table: ElementRef;
  TableExcel$: Observable<any> = of([]);
  DataFeild$: Observable<any> = of([]);
  ngOnInit(): void {
    this.service.getCodeAccidentReports();
    this.service.getCommonFieldsByCategoryId(null);
    this.fieldManagmentService.ComponentType = 'WorkRequestGates';
    this.fieldManagmentService.getFeild();
    this.Refresh();
    this.DataAccidentReport$ = this.service.IncidentReports$;
    this.service.getIncidentReports(this.dataFilter);

    this.DataFeild$ = this.fieldManagmentService.DataFeild$.pipe(
      tap((value) => {

      })
    );
  }
  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(
          () => {
            this.service.getIncidentReports(this.dataFilter);
          },
          +TimerRefresh
        );
      } else if (value == 'now') {
        this.service.getIncidentReports(this.dataFilter);
      }
    });
  }

  filter() {
    const dialogRef = this.dialog
      .open(FilterIncidentReportComponent, {
        width: '60vw',
        data: { filters: this.dataFilter },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((dataFilter) => {
      if (dataFilter) {
        this.dataFilter = dataFilter;
      }
    });
  }

  addOrEditReport(item?: any) {
    const dialogRef = this.dialog
      .open(AddReportComponent, {
        width: '60vw',
        data: item,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'onSave') {
        this.service.getIncidentReports();
      }
    });
  }

  fieldsManagment() {
    const dialogRef = this.dialog
      .open(FieldManagmentComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  ValueField(idFeildsViewInTable: any, AccidentFields: any) {
    if (AccidentFields) {
      for (var i = 0; i < AccidentFields.length; ) {

        if (AccidentFields[i].FieldId == idFeildsViewInTable) {

          return AccidentFields[i].FieldValue;
        } else {
          i = i + 1;
        }
      }
    }
  }

  onDelete() {
    this.service
      .deleteIncidentReports(this.IDIncidentReport)
      .subscribe((res: any) => {
        if (res.rv > 0) {
          this.service.getIncidentReports();

        } else {
          this.toster.error(res.Msg);
        }
      });
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  export() {
    this.TableExcel$ = this.service.getDataForExcel(this.dataFilter).pipe(
      tap((value) => {
        setTimeout(() => {
          ExportTOExcelShared(this.table.nativeElement);
        }, 300);
      })
    );
  }
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
