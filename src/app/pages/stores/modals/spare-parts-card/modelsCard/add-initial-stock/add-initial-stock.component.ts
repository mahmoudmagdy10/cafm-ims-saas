import { tap } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SparePartService } from '../../../../spare-parts.service';

@Component({
  selector: 'add-initial-stock',
  templateUrl: 'add-initial-stock.component.html',
})
export class AddInitialStock implements OnInit {
  itemEdit$: Observable<any>;
  Stores$: Observable<any>;

  InitialStockForm = new UntypedFormGroup({
    partId: new UntypedFormControl(),
    storeId: new UntypedFormControl(null, Validators.required),
    quantity: new UntypedFormControl(null, Validators.required),
    price: new UntypedFormControl(null, Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<AddInitialStock>,
    private service: SparePartService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Stores$ = this.service.Stores$.pipe(
      tap((val) => {
      })
    );

    this.itemEdit$ = this.service.itemEdit$.pipe(
      tap((value) => {
        this.InitialStockForm.patchValue({ partId: value.ID });
      })
    );
  }

  create() {
    if (this.InitialStockForm.valid) {
      this.service
        .PartTransactionInitialValue(this.InitialStockForm.value)
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
          (err) => {}
        );
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  Close() {
    this.dialogRef.close();
  }
}
