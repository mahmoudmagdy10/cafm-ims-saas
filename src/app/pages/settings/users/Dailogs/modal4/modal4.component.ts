import { UsersService } from './../../users.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
@Component({
  selector: 'modal4',
  templateUrl: 'modal4.component.html',
})
export class modal4Component implements OnInit {
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Input('userId') userId: any;

  constructor(
    private toastr: ToastrService,
    private usersService: UsersService
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
          .ChangePassword({ ...this.form.value, userID: this.userId })
          .subscribe(
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
        this.toastr.error('تاكد من تطابق كلمة المرور و تأكيدها');
      }
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
