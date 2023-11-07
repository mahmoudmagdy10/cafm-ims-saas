import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { Observable } from 'rxjs';
import { PmsService } from '../../pms.service';

@Component({
  selector: 'app-print-report',
  templateUrl: './print-report.component.html',
  styleUrls: ['./print-report.component.scss'],
})
export class PrintPPMReportComponent implements OnInit {
  AssetSelected: any;
  loadingPrint: boolean = false;

  FormReport = new UntypedFormGroup({
    fromDate: new UntypedFormControl(null, Validators.required),
    toDate: new UntypedFormControl(null, Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<PrintPPMReportComponent>,
    public dialog: MatDialog,
    private _toastrService: ToastrService,
    private _pmsService: PmsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
  printReport() {
    this.loadingPrint = true;
    if (this.FormReport.valid) {
      this._pmsService
        .PMReportPrint({ ...this.FormReport.value, PMID: this.data?.ID })
        .subscribe(
          (value) => {
            this.loadingPrint = false;
          },
          (err) => {
            this.loadingPrint = false;
          }
        );
    } else {
      this.loadingPrint = false;

      this._toastrService.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }

  Close() {
    this.dialogRef.close();
  }
}
