import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProcurementManagementService } from '../../../../procurement-management.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'add-receipt',
  templateUrl: 'add-receipt.component.html',
})
export class AddReceipt implements OnInit {
  PurchaseOrdersItems$: Observable<any>;
  codes$: Observable<any>;

  billForm = new UntypedFormGroup({
    ID: new UntypedFormControl(0),
    PoId: new UntypedFormControl(),
    BillDate: new UntypedFormControl('', Validators.required),
    BillAssignmentId: new UntypedFormControl('', Validators.required),
  });
  purchaseOrdersBillsItems: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddReceipt>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private service: ProcurementManagementService,
    private toastr: ToastrService
  ) {}
  billCheckedTeams = [];
  billCheckedUsers = [];
  ngOnInit(): void {
    this.codes$ = this.service.Codes$;

    if (this.data) {
      this.billForm.patchValue(this.data);
      this.billCheckedTeams = this.data.PurchaseOrders[0].POAssignmentTeamTxt;
      this.billCheckedUsers = this.data.PurchaseOrders[0].POAssignmentUserTxt;
      this.billForm
        .get('BillAssignmentId')
        ?.setValue(this.data.PurchaseOrders[0].POAssignmentId);
      this.billForm.get('PoId')?.setValue(this.data.POId);

      if (this.data.PurchaseOrders[0].PurchaseOrdersBillsItems) {
        this.purchaseOrdersBillsItems =
          this.data.PurchaseOrders[0].PurchaseOrdersBillsItems.map(
            (value: any) => {
              return {
                id: value.BillsItemId,
                itemId: value.ItemId,
                billId: value.BillId,
                receivedQuantity: value.ReceivedQuantity,
                Quantity: value.Quantity,
                ServiceName: value.ItemName,
                Type: value.ItemType,
                PartName: value.ItemName,
                storeId: value?.StoreId,
              };
            }
          );
      }
    } else {
      this.PurchaseOrdersItems$ = this.service.PurchaseOrdersItems$.pipe(
        tap((item) => {
          if (item) {
            this.billForm.get('PoId')?.setValue(item[0].POId);
            if (item) {
              this.purchaseOrdersBillsItems = item.map((value: any) => {
                return {
                  id: 0,
                  itemId: value.ID,
                  billId: 0,
                  receivedQuantity: 0,
                  Quantity: value.Quantity - value.TotalReceived,
                  ServiceName: value.ServiceName,
                  Type: value.ItemType,
                  PartName: value.PartName,
                  storeId: value?.StoreId,
                };
              });
            }
          }
        })
      );
    }
    this.service.getBill();
  }
  addBill() {
    if (
      this.purchaseOrdersBillsItems.find(
        (value: any) => value.storeId == undefined && value.Type != 2
      ) ||
      this.billForm.invalid ||
      !this.purchaseOrdersBillsItems.find(
        (value: any) => value.receivedQuantity != 0
      )
    ) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    } else {
      if (
        this.purchaseOrdersBillsItems.find(
          (value: any) => value.receivedQuantity > value.Quantity
        )
      ) {
        this.toastr.error(
          document.dir == 'rtl'
            ? 'الكمية المدخلة اكبر من المسموح بها    '
            : 'InValid Received Quantity'
        );
      } else {
        this.service
          .addBill({
            ...this.billForm.value,
            purchaseOrdersBillsItems: this.purchaseOrdersBillsItems,
          })
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                this.service.getBill();

                this.dialogRef.close();
              } else {
              }
            },
            (err) => {}
          );
      }
    }
  }
  choosePOAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.billForm.controls['BillAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.billForm.controls['BillAssignmentId'].setValue(
          result.AssignmentID
        );
        this.billCheckedTeams = result.itemsCheckedTeams;
        this.billCheckedUsers = result.itemsCheckedUsers;
      }
    });
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
  Close() {
    this.dialogRef.close();
  }
}
