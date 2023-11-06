import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AddInitialStock } from '../../modelsCard/add-initial-stock/add-initial-stock.component';
import { TransferBetweenWarehouses } from '../../modelsCard/transfer-between-warehouses/transfer-between-warehouses.component';
import { MatDialog } from '@angular/material/dialog';
import { MoveWorkSite } from '../../modelsCard/move-work-site/move-work-site.component';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';

@Component({
  selector: 'app-movment-history',
  templateUrl: './movment-history.component.html',
})
export class MovmentHistoryComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}
  Transactions$: Observable<any>;
  Codes$: Observable<any>;
  Stores$: Observable<any>;
  IDInitStore: number;
  movmentFilterForm = new UntypedFormGroup({
    TransactionTypeId: new UntypedFormControl(null),
    FromDate: new UntypedFormControl(''),
    ToDate: new UntypedFormControl(''),
    StorId: new UntypedFormControl(null),
  });
  ngOnInit(): void {
    this.Transactions$ = this.service.Transactions$;
    this.Codes$ = this.service.Codes$;
    this.Stores$ = this.service.Stores$;
    this.movmentFilterForm.valueChanges.subscribe((value) => {
      this.service.getTransactions(value);
    });
  }
  AddInitialStock() {
    const dialogRef = this.dialog
      .open(AddInitialStock, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  TransferBetweenWarehouses() {
    const dialogRef = this.dialog
      .open(TransferBetweenWarehouses, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  MoveWorkSite() {
    const dialogRef = this.dialog
      .open(MoveWorkSite, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  onDelete() {
    this.service.deleteTransaction(this.IDInitStore).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.service.getTransactions();
          this.service.updateItemEdit({
            InStockQuantity: res.Parts[0].InStockQuantity,
            ReservedQuantity: res.Parts[0].ReservedQuantity,
            AveragePrice: res.Parts[0].Price,
          });
        } else {

        }
      },
      (err) => {

      }
    );
  }
}
