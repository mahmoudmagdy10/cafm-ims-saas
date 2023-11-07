import { ToastrService } from 'ngx-toastr';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { switchMap } from 'rxjs/operators';
import { CommonService } from './../../../../../modules/auth/services/common.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'add-bond',
  templateUrl: 'add-bond.component.html',
})
export class AddBond implements OnInit {
  PartName = new UntypedFormControl();
  SearchOfParts$: Observable<any>;
  Stores$: Observable<any>;
  listOfBond: any[] = [];
  bondForm = new UntypedFormGroup({
    ID: new UntypedFormControl(0),
    StoreId: new UntypedFormControl('', Validators.required),
    AdjustmentName: new UntypedFormControl('', Validators.required),
    AdjustmentDate: new UntypedFormControl('', Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<AddBond>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commanService: CommonService,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.OnSearch();
    this.Stores$ = this.service.Stores$;
    if (this.data) {
      this.bondForm.patchValue(this.data);
      this.listOfBond = this.data.PartsAdjustmentsDetails;
    }
    if (!this.bondForm.get('StoreId')?.value) {
      this.PartName.disable();
    }
    this.bondForm.get('StoreId')?.valueChanges.subscribe((value) => {
      if (value) {
        this.PartName.enable();
      }
    });
  }

  OnSearch() {
    this.SearchOfParts$ = this.PartName.valueChanges.pipe(
      switchMap((value: string) => {
        return value ? this.commanService.search('Parts', value) : of([]);
      })
    );
  }
  onSelectPart(item: any) {
    this.service
      .getPartStockQuantity(item.Id, this.bondForm.get('StoreId')!.value)
      .subscribe((value) => {
        if (!this.listOfBond.find((value) => value.PartID == item.Id)) {

          this.listOfBond.push({
            ...item,
            PartID: item.Id,
            Id: 0,
            StockQty: value[0].InStockQuantity,
            AdjustmentQty: '',
          });
        }

        this.PartName.reset();
      });
  }
  Close() {
    this.dialogRef.close();
  }
  save() {
    if (this.bondForm.valid) {
      this.service
        .addPartAdjustments({
          ...this.bondForm.value,
          partsAdjustmentsDetails: this.listOfBond,
        })
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.service.getPartAdjustments();

              this.dialogRef.close();
            } else {

            }
          },
          (err) => {


          }
        );
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  deletePart(ID: any) {
    this.listOfBond.forEach((value, index) => {
      if (value.Id == ID) {
        this.listOfBond.splice(index, 1);
      }
    });
  }
}
