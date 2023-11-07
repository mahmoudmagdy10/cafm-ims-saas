import { ToastrService } from 'ngx-toastr';
import { UserAndTeamsModal } from './../../../../../../shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { tap, take, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription, of } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProcurementManagementService } from 'src/app/pages/procurement-management/procurement-management.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
})
export class BasicInfoComponent implements OnInit {
  procurementOrderForm: UntypedFormGroup;
  Codes$: Observable<any>;
  PoCheckedTeams = [];
  PoCheckedUsers = [];
  budgets$: Observable<any>;
  orderEdit$: Observable<any>;
  Subscription$ = new Subscription();
  IsSendRequest: boolean = false;
  POEdit: boolean = false;
  constructor(
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private service: ProcurementManagementService,
    private toastr: ToastrService
  ) {
    this.procurementOrderForm = this.fb.group(
      {
        ID: [],
        PONumber: [],
        VendorId: [],
        BudgetId: [],
        POAssignmentId: [],
        PODate: [],
        ExpectedDelivaryDate: [],
        NotesToVendor: [],
        ShippingAddress: [],
        POName: [],
        Notes: [],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$.pipe(
      tap((codes) => {
        if (codes) {
          if (!codes?.PagePermissions?.POEdit) {
            this.procurementOrderForm.disable({ emitEvent: false });
          } else {
            this.procurementOrderForm.enable({ emitEvent: false });
          }
          this.orderEdit$ = this.service.OrderEdit$.pipe(
            tap((value) => {
              if (value) {
                if (value.CanChange&&codes?.PagePermissions?.POEdit) {
                  this.procurementOrderForm.enable({ emitEvent: false });
                } else {
                  this.procurementOrderForm.disable({ emitEvent: false });
                }
                this.procurementOrderForm.patchValue(value, { emitEvent: false });
              }
            })
          );
        }
      })
    );
    this.budgets$ = this.service.budget$;

    this.procurementOrderForm.valueChanges
      .pipe(
        switchMap((formValue) => {
          return this.service.addProcurementOrder(formValue);
        })
      )
      .subscribe(
        (res: any) => {
          if (res) {
            if (res.rv > 0) {
            } else {
            }
          }
        },
        (err) => {}
      );
  }

  choosePOAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.procurementOrderForm.controls['POAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.procurementOrderForm.controls['POAssignmentId'].setValue(
          result.AssignmentID
        );
        this.PoCheckedTeams = result.itemsCheckedTeams;
        this.PoCheckedUsers = result.itemsCheckedUsers;
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
}
