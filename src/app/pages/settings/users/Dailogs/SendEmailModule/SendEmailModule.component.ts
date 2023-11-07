import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UsersService } from '../../users.service';
@Component({
  selector: 'SendEmailUser',
  templateUrl: './SendEmailModule.component.html',
})
export class SendEmailUser implements OnInit {
  @Input('sendTo') sendTo: any;
  @Input('UserCheckedId') UserCheckedId: any;
  //text: string;

  public Editor = ClassicEditor;

  FormSendEmail = new UntypedFormGroup({
    title: new UntypedFormControl(),
    text: new UntypedFormControl(),
    // sendTo: new FormControl(),
  });

  @Output() afterSendEmail: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(private _usersService: UsersService) {}
  ngOnInit() {}
  sendEmail() {
    if(this.sendTo){
      const body = {
        email: this.sendTo,
        title: this.FormSendEmail.get('title')?.value,
        text: this.FormSendEmail.get('text')?.value,
      };
      this._usersService.sendEmail(body).subscribe((res: any) => {
        if (res.rv > 0) {
          this.afterSendEmail.emit();
        } else {
        }
      });
    }else {
      const body = {
        userIds: this.UserCheckedId.join(', '),
        subject: this.FormSendEmail.get('title')?.value,
        emailBody: this.FormSendEmail.get('text')?.value,
      };
      this._usersService.sendUsersEmail(body).subscribe((res: any) => {
        if (res.rv > 0) {
          this.afterSendEmail.emit();
        } else {
        }
      });
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
