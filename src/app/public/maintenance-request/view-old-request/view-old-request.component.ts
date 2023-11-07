import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-view-old-request',
  templateUrl: './view-old-request.component.html',
})
export class ViewOldRequestComponent implements OnInit {
  formControl = new UntypedFormControl('', [Validators.required, Validators.email]);
  pageDirection: string;
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ViewOldRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.pageDirection = this.data.pageDirection;
  }
  save() {
    if (this.formControl.valid) {
      this.toastr.success(
        this.pageDirection == 'rtl'
          ? 'تم ارسال الرابط الى بريدك الخاص'
          : 'The link has been sent to your inbox.'
      );
      this.formControl.reset();
      this.dialogRef.close();
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  onClose() {
    this.dialogRef.close();
  }
}
