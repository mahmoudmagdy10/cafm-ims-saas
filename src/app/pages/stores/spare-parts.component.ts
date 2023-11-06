import { AuthService } from './../../modules/auth/services/auth.service';
import { filter, skip } from 'rxjs/operators';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { FieldManagmentComponent } from './../../shared/components/FieldManagment/FieldManagment.component';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { SparePartService } from './spare-parts.service';
import { InventoryAndSettlementBonds } from './modals/inventory-and-settlement-bonds/inventory-and-settlement-bonds.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStore } from './modals/stores-management/add-store/add-store.component';
import { StoresFilter } from './modals/filter/stores-filter.component';
import { StoreCard } from './modals/spare-parts-card/spare-parts-card.component';
import { StoresManagement } from './modals/stores-management/stores-management.component';
import { AddSparePartsComponent } from './modals/add-spare-parts/add-spare-parts.component';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss'],
})
export class SparePartsComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService,
    public fieldManagmentService: FieldManagmentService,
    private addFieldService: ViewItemInFieldService,
    private auth: AuthService,
    private _viewDataFilterService: ViewDataFilterService
  ) {}
  spareParts$: Observable<any>;
  feildsViewInTable: any;
  filter: any = {};
  idDeleted: any;
  interval: any;
  subscription: Subscription;
  codes$: Observable<any>;
  subscriptionForDataFilter: Subscription;
  RowCount: any = 50;
  selectedPage = 1;
  ngOnInit(): void {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('sparParts', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.service.getSpareParts();
      });
    this.codes$ = this.service.Codes$;
    this.spareParts$ = this.service.SpareParts$;
    this.fieldManagmentService.ComponentType = 'Store';
    this.addFieldService.ComponentType = 'Store';
    this.getData();
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
          this.getData();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.getData();
      }
    });
  }
  getData() {
    this.service.getStores();
    this.service.getCodes();
    this.service.getSpareParts();
    this.service.getPartAdjustments();
    this.fieldManagmentService.getFeild();
  }
  Filter() {
    const dialogRef = this.dialog
      .open(StoresFilter, {
        width: '60vw',
        data: this.filter,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.filter = value;
      }
    });
  }

  AddSparePart() {
    const dialogRef = this.dialog
      .open(AddSparePartsComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  SparePartCard(ID: any) {
    this.service.getItemEdit(ID);
    this.service.getTransactions();
    const dialogRef = this.dialog
      .open(StoreCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe(() => {
      this.service.getSpareParts();
    });
  }

  StoresManagement() {
    const dialogRef = this.dialog
      .open(StoresManagement, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  InventoryAndSettlementBonds() {
    const dialogRef = this.dialog
      .open(InventoryAndSettlementBonds, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  deleteSparePart() {
    this.service.deleteSpareParts(this.idDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getSpareParts();
        } else {
        }
      },
      (err) => {}
    );
  }
  fieldsManagment() {
    const dialogRef = this.dialog
      .open(FieldManagmentComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }
  ValueField(idFeildsViewInTable: any, Fields: any) {
    if (Fields) {
      for (var i = 0; i < Fields.length; ) {
        if (Fields[i].FieldId == idFeildsViewInTable) {
          return Fields[i].FieldValue;
        } else {
          i = i + 1;
        }
      }
    }
  }
  export() {
    this.service.getDataForExcel();
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  changePage() {
    this.service.getSpareParts();
    this._viewDataFilterService?.updateParams('sparParts', {
      CurrentPage: this.selectedPage,
      RowCount: this.RowCount,
    });
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this.service.RowCount = RowCount;
    this.service.getSpareParts();
  }
}
