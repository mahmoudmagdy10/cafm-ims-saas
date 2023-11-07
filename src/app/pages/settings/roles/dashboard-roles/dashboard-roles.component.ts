import { RolesService } from './../roles.service';
import { Observable, of } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dashboard-roles',
  templateUrl: './dashboard-roles.component.html',
  styleUrls: ['./dashboard-roles.component.scss'],
})
export class DashboardRolesComponent implements OnInit {
  codes$: Observable<any>;
  FormGroup: UntypedFormGroup;
  selectedCodes: number[] = [];
  constructor(
    public dialogRef: MatDialogRef<DashboardRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private service: RolesService
  ) {
    this.FormGroup = this.fb.group({
      id: [],
      forUserId: [],
      dashBoardReportIDs: [],
    });
  }
  ngOnInit(): void {
    this.service.getCodeRoles().subscribe((codes: any) => {
      this.codes$ = of(codes); // Use RxJS 'of' to create an observable from codes object
      this.service
        .GetReportsDashBorad(this.data?.data?.RoleId)
        .subscribe((val) => {
          val.forEach((item: any) => {
            this.selectedCodes.push(item?.ID);

            codes?.ReportsDashBorad?.forEach((element: any) => {
              if (element?.Code == item?.ID) {
                element.DashBoardReportIDs = true;
              }
            });
          });
        });
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
    this.service
      .saveReportsDashBorad({
        ...this.FormGroup.value,
        RoleId: this.data?.data?.RoleId,
        DashBoardReportIDs: this.selectedCodes.join(','), // استخدام المصفوفة المعدلة هنا
      })
      .subscribe((val: any) => {
        if (val.rv > 0) {
          this.Close();
        }
      });
  }
}
