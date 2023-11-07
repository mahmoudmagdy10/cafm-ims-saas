import { switchMap, skip, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, FormArray } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SparePartService } from '../../spare-parts.service';

@Component({
  selector: 'spare-parts-card',
  templateUrl: 'spare-parts-card.component.html',
})
export class StoreCard implements OnInit, OnDestroy {
  itemEdit$: Observable<any>;
  codes$: Observable<any>;
  Supscription: Subscription;
  cur: string = localStorage.getItem('currencyName')!;
  canSendRequest: boolean = true;
  partsStorageManagementEditPermission: boolean = true;
  cardForm = new UntypedFormGroup({
    cardSparePartForm: new UntypedFormGroup(
      {
        ID: new UntypedFormControl(''),
        PartName: new UntypedFormControl(''),
        PartNumber: new UntypedFormControl(''),
        CategoryId: new UntypedFormControl(''),
        InStockQuantity: new UntypedFormControl(''),
        ReservedQuantity: new UntypedFormControl(''),
        AveragePrice: new UntypedFormControl(''),
      },
      { updateOn: 'blur' }
    ),
    storeMangmentForm: new UntypedFormGroup(
      {
        InStockQuantity: new UntypedFormControl(''),
        ReservedQuantity: new UntypedFormControl(''),
        AveragePrice: new UntypedFormControl(''),
        MinThreshold: new UntypedFormControl(''),
        MaxThreshold: new UntypedFormControl(''),
        StaleDays: new UntypedFormControl(''),
        ThresholdAssignmentId: new UntypedFormControl(''),
      },
      { updateOn: 'blur' }
    ),
  });
  constructor(
    public dialogRef: MatDialogRef<StoreCard>,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.itemEdit$ = this.service.itemEdit$;
    this.codes$ = this.service.Codes$.pipe(
      tap((codes) => {
        if(codes){
          this.partsStorageManagementEditPermission = codes?.PagePermissions?.PartsStorageManagementEdit;
        }
      })
    );
    this.itemEdit$.subscribe((value) => {
      if (!value.NotPatch) {
        this.cardForm.controls.cardSparePartForm.patchValue(value);
        this.cardForm.controls.storeMangmentForm.patchValue(value);
      }
    });

    this.Supscription = this.cardForm.valueChanges
      .pipe(
        skip(2),
        switchMap((value) => {
          return this.service.addSpareParts({
            ...value.cardSparePartForm,
            ...value.storeMangmentForm,
          });
          // }
        })
      )
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

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

  ngOnDestroy(): void {
    this.Supscription.unsubscribe();
  }
}
