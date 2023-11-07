import { ViewDataFilterService } from './../../shared/components/view-data-filter/view-data-filter.service';
import { tap, map, skip } from 'rxjs/operators';
import { AuthService } from './../../modules/auth/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BillsFilter } from './modals/filter/filter.component';
import { BillCard } from './modals/bill-card/bill-card.component';
import { BillsService } from './bills.service';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';
import { ToastrService } from 'ngx-toastr';
import { ProcurementManagementService } from '../procurement-management/procurement-management.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit, OnDestroy {
  Bills$: Observable<any>;
  @ViewChild('TABLE') table: ElementRef;
  BillSExcel$: Observable<any>;
  billDeleted: any;
  subscriptionForDataFilter: Subscription;

  constructor(
    public dialog: MatDialog,
    private service: BillsService,
    private auth: AuthService,
    private toster: ToastrService,
    private _viewDataFilterService: ViewDataFilterService,
    private serviceOrder: ProcurementManagementService
  ) {}
  interval: any;
  subscription: Subscription;
  Codes$: Observable<any>;

  ngOnInit(): void {
    this.Codes$ = this.serviceOrder.Codes$;

    this.serviceOrder.getCodes();

    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('Bills', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.service.getBill();
      });
    this.service.getBill();
    this.Bills$ = this.service.bill$;
    this.Refresh();
    this.service.getCodeBill();
  }
  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.service.getBill();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.service.getBill();
      }
    });
  }
  BillsFilter() {
    const dialogRef = this.dialog
      .open(BillsFilter, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  BillCard(ID: any) {
    this.service.getBillById(ID);
    const dialogRef = this.dialog
      .open(BillCard, {
        width: '70vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  onDelete() {
    this.service.deleteBill(this.billDeleted).subscribe((res: any) => {
      if (res.rv > 0) {
        this.service.getBill();
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
    this.BillSExcel$ = this.service.getDataForExcel().pipe(
      map((value) => value[0].Data),
      tap((value) => {
        setTimeout(() => {
          ExportTOExcelShared(this.table.nativeElement);
        }, 300);
      })
    );
  }
}
