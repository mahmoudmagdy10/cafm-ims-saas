import { Observable, of } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.scss'],
})
export class DashboardUsersComponent implements OnInit {
  codes$: Observable<any>;
  FormGroup: UntypedFormGroup;
  selectedCodes: number[] = [];
  constructor(
    public dialogRef: MatDialogRef<DashboardUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private usersService: UsersService
  ) {
    this.FormGroup = this.fb.group({
      id: [],
      forUserId: [],
      dashBoardReportIDs: [],
    });
  }
  ngOnInit(): void {
    this.usersService.getCodeRoles().subscribe((codes: any) => {
      this.codes$ = of(codes);
      if (codes?.ReportsTemplate) {
        this.usersService
          .GetReportsDashBorad(this.data?.data?.UserId)
          .subscribe((val: any) => {
            val.forEach((item: any) => {

              this.selectedCodes.push(item?.ID);
              codes?.ReportsTemplate?.forEach((element: any) => {
                if (element?.Code == item?.ID) {
                  element.DashBoardReportIDs = true;
                }
              });
            });
          });
      }
    });
  }
  Close() {
    this.dialogRef.close();
  }
  updateSelectedReports(reportCode: number, isChecked: boolean) {
    if (isChecked) {
      // إضافة الـ Code إلى المصفوفة إذا كانت محددة
      if (!this.selectedCodes.includes(reportCode)) {
        this.selectedCodes.push(reportCode);
      }
    } else {
      // إزالة الـ Code من المصفوفة إذا تم إلغاء تحديدها
      const index = this.selectedCodes.indexOf(reportCode);
      if (index !== -1) {
        this.selectedCodes.splice(index, 1);
      }
    }
  }

  save() {
    this.usersService
      .saveReportsDashBorad({
        ...this.FormGroup.value,
        forUserId: this.data?.data?.UserId,
        DashBoardReportIDs: this.selectedCodes.join(','), // استخدام المصفوفة المعدلة هنا
      })
      .subscribe((val: any) => {
        if (val.rv > 0) {
          this.Close();
        }
      });
  }
}
