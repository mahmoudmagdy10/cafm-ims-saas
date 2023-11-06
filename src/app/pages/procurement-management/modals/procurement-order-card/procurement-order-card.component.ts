import { ToastrService } from 'ngx-toastr';
import { ProcurementManagementService } from './../../procurement-management.service';
import { tap } from 'rxjs/operators';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'procurement-order-card',
  templateUrl: 'procurement-order-card.component.html',
})
export class procurementOrderCard implements OnInit {
  OrderEdit$: Observable<any>;
  Codes$: Observable<any>;
  notesForReject: string;
  constructor(
    public dialogRef: MatDialogRef<procurementOrderCard>,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: ProcurementManagementService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;

    this.OrderEdit$ = this.service.OrderEdit$;
  }
  changeStatus(poId: any, stageType: any) {
    const body = {
      poId: poId,
      stageType: stageType,
    };
    this.service.changeStatus(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getOrderEdit();
          this.service.getBill();

        } else {

        }
      },
      (err) => {

      }
    );
  }
  orderReject() {
    this.service.OrderReject(this.notesForReject).subscribe(
      (res: any) => {
        if (res.rv > 0) {

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
