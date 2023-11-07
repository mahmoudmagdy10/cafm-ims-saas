import { tap, switchMap, map } from 'rxjs/operators';
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
  selector: 'move-work-site.component',
  templateUrl: 'move-work-site.component.html',
})
export class MoveWorkSite implements OnInit {
  codes$: Observable<any>;
  itemEdit$: Observable<any>;
  toStores$: Observable<any> | undefined;
  Stores$: Observable<any>;
  InStockQuantity: number = 0;
  AveragePrice: number = 0;
  moveBetweenLocation = new UntypedFormGroup({
    storeId: new UntypedFormControl(),
    partId: new UntypedFormControl(),
    quantity: new UntypedFormControl(),
    toStoreId: new UntypedFormControl(),
    toLocationId: new UntypedFormControl(),
  });
  constructor(
    public dialogRef: MatDialogRef<MoveWorkSite>,
    private service: SparePartService,
    public dialog: MatDialog,

    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Stores$ = this.service.Stores$;

    this.codes$ = this.service.Codes$;
    this.itemEdit$ = this.service.itemEdit$.pipe(
      tap((value) => {
        this.moveBetweenLocation.patchValue({ partId: value.ID });
      })
    );
    this.moveBetweenLocation.get('storeId')?.valueChanges.subscribe((value) => {
      if (value) {
        this.service
          .getPartStockQuantity(
            this.moveBetweenLocation.get('partId')?.value,
            value
          )
          .subscribe((res: any) => {
            this.InStockQuantity = res[0].InStockQuantity;
            this.AveragePrice = res[0].AveragePrice;
          });
      }
    });
    this.toStores$ = this.moveBetweenLocation
      .get('toLocationId')
      ?.valueChanges.pipe(
        switchMap((value) => {

          return this.service.getStoresByLocation(value)
        })
      );
  }
  create() {
    this.service
      .PartTransactionFromLocation(this.moveBetweenLocation.value)
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
