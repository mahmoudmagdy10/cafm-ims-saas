import { ToastrService } from 'ngx-toastr';
import { UserAndTeamsModal } from './../../../../shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProcurementManagementService } from '../../procurement-management.service';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'add-procurement-order',
  templateUrl: 'add-procurement-order.component.html',
})
export class AddProcurementOrder implements OnInit {
  procurementOrderForm: UntypedFormGroup;
  Codes$: Observable<any>;
  PoCheckedTeams = [];
  PoCheckedUsers = [];
  budgets$: Observable<any>;
  budgets: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProcurementOrder>,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private service: ProcurementManagementService,
    private toastr: ToastrService
  ) {
    this.procurementOrderForm = this.fb.group({
      PoNumber: [],
      VendorId: [null, Validators.required],
      BudgetId: [null, Validators.required],
      PoAssignmentId: [null, Validators.required],
      PoDate: [null, Validators.required],
      ExpectedDelivaryDate: [null, Validators.required],
      NotesToVendor: [],
      ShippingAddress: [],
      PoName: [],
      Notes: [],
    });
  }
  choosePOAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.procurementOrderForm.controls['PoAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.procurementOrderForm.controls['PoAssignmentId'].setValue(
          result.AssignmentID
        );
        this.PoCheckedTeams = result.itemsCheckedTeams;
        this.PoCheckedUsers = result.itemsCheckedUsers;
      }
    });
  }
  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
    this.budgets$ = this.service.budget$.pipe(
      tap((val) => {
        this.budgets = val;
      })
    );
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
  addProcurementOrder() {
    if (this.procurementOrderForm.valid) {
      this.service
        .addProcurementOrder(this.procurementOrderForm.value)
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.service.getProcurementOrder();
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
  OnSelectItem(event: any) {
    let PoAssignment = this.budgets.find((res: any) => res.ID == event.value);
    this.procurementOrderForm.controls['PoAssignmentId'].setValue(
      PoAssignment.BillAssignmentId
    );

    this.PoCheckedTeams = PoAssignment.BillAssignmentTeamTxt;
    this.PoCheckedUsers = PoAssignment.BillAssignmentUserTxt;
  }
}
