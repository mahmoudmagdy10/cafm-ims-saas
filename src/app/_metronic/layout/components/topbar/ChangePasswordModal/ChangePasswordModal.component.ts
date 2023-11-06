import { UsersService } from '../../../../../pages/settings/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
@Component({
  selector: 'ChangePasswordModal',
  templateUrl: 'ChangePasswordModal.component.html',
})
export class ChangePasswordModal implements OnInit {
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(
    private toastr: ToastrService,
    private usersService: UsersService
  ) {}
  form = new UntypedFormGroup({
    oldPassword: new UntypedFormControl(null, Validators.required),
    newPassword: new UntypedFormControl(null, Validators.required),
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
        this.form.get('newPassword ')?.value ==
        this.form.get('confirmNewPassword ')?.value
      ) {
        this.usersService.ChangePassword({ ...this.form.value }).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.form.reset();
              this.onCancel();
            } else {
            }
          },
          (err) => {

          }
        );
      } else {
        this.toastr.error('تاكد ان الحقلين متطابقين!');
      }
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
