import { Subscription } from 'rxjs/internal/Subscription';
import { tap, finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { administratorService } from '../administrator.service';

@Component({
  selector: 'TemplateForBackupForCompany',
  templateUrl: './TemplateForBackupForCompany.component.html',
})
export class TemplateForBackupForCompany implements OnInit {
  constructor(
    private tostar: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TemplateForBackupForCompany>,
    private administratorService: administratorService
  ) {}

  TemplateValue = new UntypedFormControl();
  IDFieldDeleted: number;
  IndexFieldDeleted: number;
  unsubscribe: Subscription[] = [];
  TemplateForBackupForCompany$: Observable<any>;
  TemplatesForBackup$: Observable<any>;
  ngOnInit(): void {
    this.getTemplates();
  }
  getTemplates() {
    this.TemplateForBackupForCompany$ =
      this.administratorService.getTemplateForBackupForCompany(this.data.ID);
    this.TemplatesForBackup$ =
      this.administratorService.getTemplatesForBackup();
  }
  addTemplates() {
    this.administratorService
      .addTemplateForBackupForCompany({
        TemplateId: this.TemplateValue.value,
        ID: this.data.ID,
      })
      .subscribe((value: any) => {
        if (value.rv > 0) {
          this.tostar.success(value.Msg);
          this.getTemplates();
        } else {
          this.tostar.error(value.Msg);
        }
      });
  }
  onDelete() {
    this.administratorService
      .deleteTemplateForBackupForCompany(this.IDFieldDeleted)
      .subscribe((value: any) => {
        if (value.rv > 0) {
          this.tostar.success(value.Msg);
          this.getTemplates();
        } else {
          this.tostar.error(value.Msg);
        }
      });
  }
  Close() {
    this.dialogRef.close();
  }
}
