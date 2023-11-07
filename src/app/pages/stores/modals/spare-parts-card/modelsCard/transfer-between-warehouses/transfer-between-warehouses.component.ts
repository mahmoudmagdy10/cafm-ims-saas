import { tap } from 'rxjs/operators';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'transfer-between-warehouses',
  templateUrl: 'transfer-between-warehouses.component.html',
})
export class TransferBetweenWarehouses implements OnInit {
  codes$: Observable<any>;
  itemEdit$: Observable<any>;
  Stores$: Observable<any>;
  InStockQuantity: number = 0;
  AveragePrice: number = 0;

  moveBetweenStore = new UntypedFormGroup({
    partId: new UntypedFormControl(),
    storeId: new UntypedFormControl(),
    quantity: new UntypedFormControl(),
    toStoreId: new UntypedFormControl(),
  });
  constructor(
    public dialogRef: MatDialogRef<TransferBetweenWarehouses>,
    private service: SparePartService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Stores$ = this.service.Stores$;

    this.codes$ = this.service.Codes$;
    this.itemEdit$ = this.service.itemEdit$.pipe(
      tap((value) => {
        this.moveBetweenStore.patchValue({ partId: value.ID });
      })
    );
    this.moveBetweenStore.get('storeId')?.valueChanges.subscribe((value) => {
      if (value) {
        this.service
          .getPartStockQuantity(
            this.moveBetweenStore.get('partId')?.value,
            value
          )
          .subscribe((res: any) => {
            this.InStockQuantity = res[0].InStockQuantity;
            this.AveragePrice = res[0].AveragePrice;
          });
      }
    });
  }
  create() {
    this.service
      .PartTransactionFromStore(this.moveBetweenStore.value)
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

            this.service.getTransactions();
            this.service.updateItemEdit({
              InStockQuantity: res.data[0].Parts[0].InStockQuantity,
              ReservedQuantity: res.data[0].Parts[0].ReservedQuantity,
              AveragePrice: res.data[0].Parts[0].Price,
            });
            this.dialogRef.close();
          } else {

          }
        },
        (err) => {


        }
      );
  }
  Close() {
    this.dialogRef.close();
  }
}
