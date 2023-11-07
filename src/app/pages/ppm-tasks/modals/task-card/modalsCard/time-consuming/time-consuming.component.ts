import { tap } from 'rxjs/operators';
import { merge, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

import { workOrderService } from 'src/app/pages/work-order/workOrder.service';

@Component({
  selector: 'time-consuming',
  templateUrl: './time-consuming.component.html',
  styleUrls: ['./time-consuming.component.scss'],
})
export class TimeConsumingComponent implements OnInit {
  // dialogRef: any;
  formTimeConsuming: UntypedFormGroup;
  Muints: any = [];
  Hours: any = [];
  unsubscribe: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<TimeConsumingComponent>,
    private toastr: ToastrService,
    private service: workOrderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder
  ) {
    this.formTimeConsuming = this.fb.group({
      timeH: [data?.H],
      timeM: [data?.Min],
      logDescription: [''],
      isShowDescription: true,
      isManual: false,
    });
  }

  ngOnInit(): void {
    this.formTimeConsuming.controls['isShowDescription'].valueChanges.subscribe(
      (value) => {
        if (!value) {
          this.formTimeConsuming.controls['logDescription'].disable();
        } else {
          this.formTimeConsuming.controls['logDescription'].enable();
        }
      }
    );
    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
    const hourChange$ = this.formTimeConsuming.controls['timeH'].valueChanges;
    const minChange$ = this.formTimeConsuming.controls['timeM'].valueChanges;
    const change$ = merge(hourChange$, minChange$)
      .pipe(
        tap((value) =>
          this.formTimeConsuming.controls['isManual'].setValue(true)
        )
      )
      .subscribe();
    this.unsubscribe.push(change$);
  }
  Save() {
    const body = {
      ...this.formTimeConsuming.value,
      workOrderId: this.data.ID,
      logDate: new Date(),
      logPeriod:
        +this.formTimeConsuming.controls['timeH'].value * 60 +
        +this.formTimeConsuming.controls['timeM'].value,

      executerId: localStorage.getItem('userID'),
    };
    this.service.addTimeLogs(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.dialogRef.close(res.data[0]);
        } else {

        }
      },
      (err) => {

      }
    );
  }
  Close() {
    this.dialogRef.close(false);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
