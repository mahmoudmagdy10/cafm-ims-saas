import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { workOrderService } from '../../workOrder.service';
import * as moment from 'moment';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-print-report',
  templateUrl: './print-report.component.html',
  styleUrls: ['./print-report.component.scss'],
})
export class PrintReportComponent implements OnInit {
  AssetSelected: any;
  FormReport = new UntypedFormGroup({
    fromDate: new UntypedFormControl(),
    toDate: new UntypedFormControl(),
    assetsId: new UntypedFormControl(),
  });
  constructor(
    public dialogRef: MatDialogRef<PrintReportComponent>,
    public dialog: MatDialog,
    private _workOrderService: workOrderService,
    private _toastrService: ToastrService
  ) {}
  codes$: Observable<any>;
  ngOnInit(): void {
    this.codes$ = this._workOrderService.Codes$;
  }
  printReport() {
    if (this.FormReport.valid) {
      this._workOrderService
        .printReport(this.FormReport.value)
        .subscribe((res: any) => {});
    } else {
      this._toastrService.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  opentree(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.FormReport.get('assetsId')?.setValue(result.ID);
      }
    });
  }
  Close() {
    this.dialogRef.close();
  }
}
