import { ToastrService } from 'ngx-toastr';
import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-TC',
  templateUrl: './TC.component.html',
  styleUrls: ['./TC.component.scss'],
})
export class TCComponent implements OnInit {
  files: any;
  Muints: any = [];
  Hours: any = [];
  formCompleteTC = new UntypedFormGroup({
    hour: new UntypedFormControl(0),
    min: new UntypedFormControl(0),
    StatusNotes: new UntypedFormControl('', Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<TCComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _workOrderService: workOrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
  }
  SaveNewValue(files: any) {
    this.files = files;
  }
  TC() {
    if (this.formCompleteTC.valid) {
      const body = {
        Allfiles: this.files,
        WorkOrderid: this.data?.dataEdit?.ID,
        TotalTimeCompleteByMin: Math.ceil(
          +this.formCompleteTC.get('hour')?.value * 60 +
            +this.formCompleteTC.get('min')?.value
        ),
        StatusNotes: this.formCompleteTC.get('StatusNotes')?.value,
      };
      if ((this.files && this.files.length <= 4) || !this.files) {
        if (this.files && this.files.length > 0) {
          if (this._workOrderService.LocationForUser?.coords) {
            this._workOrderService.TC(body).subscribe(
              (res: any) => {
                if (res.StatusCode == 200) {
                  this.toastr.success(res.Message);
                  this.dialogRef.close('ttm');
                } else {
                  this.toastr.error(res.Message);
                }
              },
              (err) => {}
            );
          } else {
            this.toastr.error('Please Accept Permission To Know Your Location');
          }
        } else {
          this.toastr.error(
            document.dir == 'rtl'
              ? 'الرجاء تحميل صورة واحدة على الأقل'
              : 'Please upload at least one picture'
          );
        }
      } else {
        this.toastr.error('you can`t enter more than 4 Pictures');
      }
    } else {
      this.toastr.error(
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
