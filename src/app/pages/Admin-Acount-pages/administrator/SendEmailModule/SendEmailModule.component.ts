import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { administratorService } from './../administrator.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-SendEmail',
  templateUrl: './SendEmailModule.component.html',
  styleUrls: ['./SendEmailModule.component.scss'],
})
export class SendEmailModuleComponent implements OnInit {
  //text: string;

  public Editor = ClassicEditor;
  FormSendEmail = new UntypedFormGroup({
    subject: new UntypedFormControl(),
    emailBody: new UntypedFormControl(),
  });

  @Output() afterSendEmail: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  @Input('itemCamSendEmail') itemCamSendEmail: any;

  constructor(
    public administratorService: administratorService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {}
  sendEmail() {
    const body = {
      companyIds: this.itemCamSendEmail.CompanyId,
      ...this.FormSendEmail.value,
      ...this.administratorService.filter,
    };
    this.administratorService.sendEmailtoAllCam(body).subscribe((res: any) => {
      if (res.rv > 0) {

        this.afterSendEmail.emit();
      } else {

      }
    });
  }
  onCancel() {
    this.cancel.emit();
  }
}
