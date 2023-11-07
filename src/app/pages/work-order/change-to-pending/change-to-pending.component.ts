import { ToastrService } from 'ngx-toastr';
import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'app-change-to-pending',
  templateUrl: './change-to-pending.component.html',
  styleUrls: ['./change-to-pending.component.scss'],
})
export class ChangeToPendingComponent implements OnInit {
  codes$: Observable<any>;
  formPending = new UntypedFormGroup({
    ID: new UntypedFormControl([]),
    Note: new UntypedFormControl([], Validators.required),
    ReasonTypeId: new UntypedFormControl([], Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<ChangeToPendingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: workOrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formPending.patchValue(this.data);
    this.codes$ = this._service.Codes$;
  }
  changeToPending() {
    if (this.formPending.invalid) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    } else {
      this._service.ChangeToPending(this.formPending.value).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.dialogRef.close('tm');
          } else {
          }
        },
        (err) => {}
      );
    }
  }
  close() {
    this.dialogRef.close();
  }
}
