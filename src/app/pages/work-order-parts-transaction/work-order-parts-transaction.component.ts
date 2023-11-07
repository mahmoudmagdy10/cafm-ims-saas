import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { TaskCardComponent } from './../work-order/modals/task-card/task-card.component';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { WorkOrderPartsTransactionService } from './work-order-parts-transaction.service';
import { MenuItem } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FilterTransactionComponent } from './filter/filter.component';
import { StoreCard } from '../stores/modals/spare-parts-card/spare-parts-card.component';

@Component({
  selector: 'app-work-order-parts-transaction',
  templateUrl: './work-order-parts-transaction.component.html',
  styleUrls: ['./work-order-parts-transaction.component.scss'],
})
export class WorkOrderPartsTransactionComponent implements OnInit {
  WorkOrderPartsTransaction$: Observable<any>;
  selectedPage = 1;
  RowCount: any = 50;
  selectedStoreId: number;
  selectedTab: boolean = false;
  data: any;
  storeCodes$: Observable<any>;
  Codes$: Observable<any>;
  filterStatuses: MenuItem[]=[];
  dataType: number | null = null;
  constructor(
    private _workOrderPartsTransactionService: WorkOrderPartsTransactionService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private workOrderService: workOrderService,
    private _SparePartService: SparePartService,
    private _sparePartService: SparePartService
  ) {
    this.filterStatuses = [
      {
        label: this.translate.instant('not_Selected'),
        command: () => {
          this.filterByMenu(null);
        },
      },
      {
        label: this.translate.instant('Accepted'),
        command: () => {
          this.filterByMenu(1);
        },
      },
      {
        label: this.translate.instant('Rejected'),
        command: () => {
          this.filterByMenu(0);
        },
      },
    ];
  }

  filterByMenu(isAccepted: any) {
    this._workOrderPartsTransactionService.isAccepted = isAccepted;
    this._workOrderPartsTransactionService.getWorkOrderPartsTransaction();
    this.dataType = isAccepted;
    // activeStatus
    if (isAccepted === null) {
      this.selectedTab = false;
    } else {
      this.selectedTab = true;
    }
  }

  ngOnInit() {
    this._workOrderPartsTransactionService.getCode();
    this.Codes$ = this._workOrderPartsTransactionService.Codes$;
    this._workOrderPartsTransactionService.isAccepted = null;
    this.workOrderService.getCodePreventiveTasks();
    this._workOrderPartsTransactionService.getWorkOrderPartsTransaction();
    this.WorkOrderPartsTransaction$ =
      this._workOrderPartsTransactionService.WorkOrderPartsTransaction$.pipe(
        tap((val) => {
          this.data = val.data;
        })
      );
    this._SparePartService.getStores();
    this.storeCodes$ = this._sparePartService.Stores$.pipe(
      tap((val) => {
      })
    );
  }
  Rejected(item: any) {
    this._workOrderPartsTransactionService.saveWorkOrderPartsTransaction({
      LocationId: item.LocationId,
      uid: item.UID,
      StoreId: this.selectedStoreId || item.StoreId,
      isAccepted: 0,
    });
  }
  Approvel(item: any) {
    this._workOrderPartsTransactionService.saveWorkOrderPartsTransaction({
      LocationId: item.LocationId,
      uid: item.UID,
      StoreId: this.selectedStoreId || item.StoreId,
      isAccepted: 1,
    });
  }
  filter() {
    const dialogRef = this.dialog
      .open(FilterTransactionComponent, {
        width: '30vw',
        disableClose: true,
        data: {
          filters: this._workOrderPartsTransactionService.Filter,
        },
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((dataFilter) => {
      if (dataFilter) {
        this._workOrderPartsTransactionService.Filter = dataFilter;
        this._workOrderPartsTransactionService.getWorkOrderPartsTransaction({
          ...dataFilter,
        });
      }
    });
  }
  changePage() {
    this._workOrderPartsTransactionService.selectedPage = this.selectedPage;
    this._workOrderPartsTransactionService.getWorkOrderPartsTransaction();
  }
  openCard(item: any) {
    const dialogRef = this.dialog.open(TaskCardComponent, {
      width: '80vw',
      data: {
        filter: {
          Id: item.WorkOrderID,
        },
      },
      disableClose: true,
    });
  }
  SparePartCard(ID: any) {
    this._SparePartService.getItemEdit(ID);
    this._SparePartService.getTransactions();
    this._SparePartService.getCodes();
    const dialogRef = this.dialog
      .open(StoreCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this._workOrderPartsTransactionService.RowCount = RowCount;
    this._workOrderPartsTransactionService.getWorkOrderPartsTransaction();
  }
  handleSelectedStore(StoreId: any) {
    this.selectedStoreId = StoreId;
  }
}
