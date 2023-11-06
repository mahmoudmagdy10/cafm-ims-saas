import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UsersService } from '../../users.service';

@Component({
  selector: 'modal-add-user',
  templateUrl: 'modalAddUser.component.html',
})
export class AddUserComponent implements OnInit {
  @Input('codes') codes: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  isSuperAdmin: boolean = false;
  constructor(
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    
  }
  formAddUser = new UntypedFormGroup({
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    emailConfirmation: new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
    ]),
    firstName: new UntypedFormControl(null, Validators.required),
    lastName: new UntypedFormControl(null, Validators.required),
    jobTile: new UntypedFormControl(null, Validators.required),
    phoneNumber: new UntypedFormControl(null),
    RoleId: new UntypedFormControl(null, Validators.required),
    LocationId: new UntypedFormControl(Number(localStorage.getItem('defaultLocation')) || null, Validators.required),
    IsSuperUser: new UntypedFormControl(false),
    WorkHourRate: new UntypedFormControl(null),
  });
  ngOnInit(): void {
    this.isCheckSuperUser();
  }

  AddUser() {
    if (this.formAddUser.invalid) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    } else {
      if (
        this.formAddUser.get('email')?.value ==
        this.formAddUser.get('emailConfirmation')?.value
      ) {
        this.usersService
          .addUser({ ...this.formAddUser.value, userId: 0 })
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                this.formAddUser.reset();
                this.afterSave.emit();
              } else {
              }
            },
            (err) => {}
          );
      } else {
        this.toastr.error('البريد لا يطابق تاكيد البريد');
      }
    }
  }
  onCancel() {
    this.cancel.emit();
  }
  isCheckSuperUser() {
    this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperUser') || '');
  }
}
