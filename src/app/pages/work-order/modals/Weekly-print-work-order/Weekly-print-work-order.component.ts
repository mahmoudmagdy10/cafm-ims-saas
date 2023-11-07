import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { workOrderService } from '../../workOrder.service';
import { Observable, observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-Weekly-print-work-order',
  templateUrl: './Weekly-print-work-order.component.html',
  styleUrls: ['./Weekly-print-work-order.component.scss'],
})
export class WeeklyPrintWorkOrderComponent implements OnInit {
  printWeekly!: UntypedFormGroup;
  loadingPrint: boolean = false;
  Codes$!: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<WeeklyPrintWorkOrderComponent>,
    private translateService: TranslateService,
    private _workOrderService: workOrderService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.printWeekly = this.fb.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      TaskStatusId: [null],
    });
  }

  ngOnInit() {
    this.Codes$ = this._workOrderService.Codes$.pipe(
      map((value) => {
        return {
          ...value,
          TaskTypeId: value.TaskTypeId.map((value: any) => {
            if (value.Code == 134) {
              return { ...value, disabled: true };
            } else {
              return value;
            }
          }),
        };
      })
    );
  }

  Close() {
    this.dialogRef.close();
  }
  Print() {
    this.loadingPrint = true;
    this._workOrderService.printWeekly(this.printWeekly.value).subscribe(
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
