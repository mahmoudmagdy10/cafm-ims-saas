import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { UsersService } from '../../users.service';
@Component({
  selector: 'modal2',
  templateUrl: 'modal2.component.html',
})
export class modal2Component implements OnInit {
  idRoles: any;
  idLocation: any;
  @Input('dataUser') dataUser: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  @Input('codes') codes: any;

  constructor(
    private usersService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  form = new UntypedFormGroup({
    RoleId: new UntypedFormControl(null, Validators.required),
    LocationId: new UntypedFormControl(null, Validators.required),
  });

  checkRoles(id: any) {
    this.idRoles = id;
  }
  checkLocation(id: any) {
    this.idLocation = id;
  }

  saveRolesLocation() {
    if (this.form.valid) {
      this.usersService
        .UsersLocationRoles({
          userId: this.dataUser.UserId,
          roleId: this.form.get('RoleId')?.value,
          locationId: this.form.get('LocationId')?.value,
        })
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.idLocation = null;
              this.idRoles = null;
              this.afterSave.emit();
              this.form.reset();
            } else {
            }
          },
          (err) => {}
        );
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
