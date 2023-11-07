import { ViewDataFilterService } from './../../shared/components/view-data-filter/view-data-filter.service';
import { map, tap, skip } from 'rxjs/operators';
import { AuthService } from './../../modules/auth/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddProcurementOrder } from './modals/add-procurement-order/add-procurement-order.component';
import { BudgetManagement } from './modals/budget-management/budget-management.component';
import { ProcurementManagementFilter } from './modals/filter/filter.component';
import { procurementOrderCard } from './modals/procurement-order-card/procurement-order-card.component';
import { ProcurementManagementService } from './procurement-management.service';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';

@Component({
  selector: 'app-procurement-management',
  templateUrl: './procurement-management.component.html',
  styleUrls: ['./procurement-management.component.scss'],
})
export class ProcurementManagementComponent implements OnInit, OnDestroy {
  ProcurementOrderID: number;
  ProcurementOrders$: Observable<any>;
  Codes$: Observable<any>;
  interval: any;
  subscription: Subscription;
  subscriptionForDataFilter: Subscription;
  cur: string = localStorage.getItem('currencyName')!;

  ProcurementOrderIDDeleted: number;
  constructor(
    public dialog: MatDialog,
    private service: ProcurementManagementService,
    private toster: ToastrService,
    private auth: AuthService,
    private _viewDataFilterService: ViewDataFilterService
  ) {}

  ngOnInit(): void {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('procurementManagement', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.service.getProcurementOrder();
      });
    this.Codes$ = this.service.Codes$;
    this.service.getBudget();
    this.service.getCodes();
    this.service.getProcurementOrder();
    this.ProcurementOrders$ = this.service.procurementOrders$;
    this.Refresh();
  }
  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.service.getBudget();
          this.service.getCodes();
          this.service.getProcurementOrder();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.service.getBudget();
        this.service.getCodes();
        this.service.getProcurementOrder();
      }
    });
  }
  onDelete() {
    this.service
      .deleteProcurementOrder(this.ProcurementOrderIDDeleted)
      .subscribe((res: any) => {
        if (res.rv > 0) {
          this.service.getProcurementOrder();
        } else {
          this.toster.error(res.Msg);
        }
      });
  }
  filter() {
    const dialogRef = this.dialog
      .open(ProcurementManagementFilter, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  AddProcurementOrder() {
    const dialogRef = this.dialog
      .open(AddProcurementOrder, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  procurementOrderCard(ID: any) {
    this.service.POId = ID;
    this.service.getOrderEdit();
    this.service.getBill();
    const dialogRef = this.dialog
      .open(procurementOrderCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      this.service.getProcurementOrder();
    });
  }

  BudgetManagement() {
    const dialogRef = this.dialog
      .open(BudgetManagement, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  ArrayToString(arr: any) {
    if (arr) {
      return arr
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
    }
  }
  @ViewChild('TABLE') table: ElementRef;
  PrecExcel$: Observable<any>;
  export() {
    // this.PrecExcel$ =
    this.service.getDataForExcel();

    // .pipe(
    //   tap((value) => {
    //     setTimeout(() => {
    //       ExportTOExcelShared(this.table.nativeElement);
    //     }, 300);
    //   })
    // );
  }
}
