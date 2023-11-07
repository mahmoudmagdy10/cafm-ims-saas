import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PmsService } from '../../pms.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-Weekly-print',
  templateUrl: './Weekly-print.component.html',
  styleUrls: ['./Weekly-print.component.scss'],
})
export class WeeklyPrintComponent implements OnInit {
  printWeekly!: UntypedFormGroup;
  loadingPrint: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<WeeklyPrintComponent>,
    private translateService: TranslateService,
    private _pmsService: PmsService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.printWeekly = this.fb.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
    });
  }

  ngOnInit() {}
  Close() {
    this.dialogRef.close();
  }
  Print() {
    this.loadingPrint = true;
    this._pmsService.printWeekly(this.printWeekly.value).subscribe(
      (val: any) => {
        if (val.rv > 0) {
          this.loadingPrint = false;

          // this.toastr.success(val.msg);
        } else {
          this.loadingPrint = false;

          // this.toastr.error(val.msg);
        }
      },
      (err: any) => {
        console.log('erreer', err);

        this.loadingPrint = false;
      }
    );
  }
  changeDate() {
    this.printWeekly
      .get('ToDate')
      ?.setValue(this.printWeekly.get('FromDate')!.value);
  }
}
