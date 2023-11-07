import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { administratorService } from './../administrator.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  Inject,
} from '@angular/core';
@Component({
  selector: 'modal4',
  templateUrl: 'modal4.component.html',
})
export class modal4Component implements OnInit {
  constructor(
    private toastr: ToastrService,
    private usersService: administratorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<modal4Component>
  ) {}
  form = new UntypedFormGroup({
    newPassword: new UntypedFormControl(null, Validators.required),
    confirmNewPassword: new UntypedFormControl(null, Validators.required),
  });
  ngOnInit(): void {}

  onEdit() {
    if (this.form.invalid) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    } else {
      if (
        this.form.get('newPassword')?.value ==
        this.form.get('confirmNewPassword')?.value
      ) {
        this.usersService
          .ChangePassword({ ...this.form.value, userID: this.data.userId })
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {

                this.onCancel();
              } else {

              }
            },
            (err:any) => {

            }
          );
      } else {
        this.toastr.error('تاكد من تطابق كلمة المرور و تأكيدها');
      }
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
