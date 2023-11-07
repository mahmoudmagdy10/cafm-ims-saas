import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-two-way-factory',
  templateUrl: './two-way-factory.component.html',
  styleUrls: ['./two-way-factory.component.scss'],
})
export class TwoWayFactoryComponent implements OnInit {
  Code = new UntypedFormControl(null, Validators.required);
  isLoading$: Observable<boolean>;

  constructor(
    public dialogRef: MatDialogRef<TwoWayFactoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.authService.isLoading$;
  }
  login() {
    this.authService
      .login('/Token/CodeLogin', this.data.email, '', this.Code.value)
      .subscribe((res) => {
        if (res?.rv > 0) {
        } else {
          this.toastr.error(res?.Msg);
        }
      });
  }
  Close() {
    this.dialogRef.close(this.Code.value);
  }
}
