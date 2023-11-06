import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddBudget } from './add-budget/add-budget.component';
import { ProcurementManagementService } from '../../procurement-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'budget-management',
  templateUrl: 'budget-management.component.html',
})
export class BudgetManagement implements OnInit {
  budgets$: Observable<any>;
  Codes$: Observable<any>;
  BudgetID: number;
  Avatar=environment.Avatar
  constructor(
    public dialogRef: MatDialogRef<BudgetManagement>,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: ProcurementManagementService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;

    this.budgets$ = this.service.budget$;
  }

  Close() {
    this.dialogRef.close();
  }

  AddOrEditBudget(data?: any) {
    const dialogRef = this.dialog
      .open(AddBudget, {
        width: '60vw',
        data: data,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  onDelete() {
    this.service.deleteBudget(this.BudgetID).subscribe((res: any) => {
      if (res.rv > 0) {

        this.service.getBudget();
      } else {
        this.toster.error(res.Msg);
      }
    });
  }

}
