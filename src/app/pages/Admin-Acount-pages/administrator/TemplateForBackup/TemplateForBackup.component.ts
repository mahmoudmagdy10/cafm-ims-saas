import { Subscription } from 'rxjs/internal/Subscription';
import { tap, finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { administratorService } from '../administrator.service';

@Component({
  selector: 'TemplateForBackup',
  templateUrl: './TemplateForBackup.component.html',
})
export class TemplateForBackup implements OnInit {
  constructor(
    private tostar: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TemplateForBackup>,
    private administratorService: administratorService
  ) {}

  TemplateName = new UntypedFormControl();
  TemplateScript = new UntypedFormControl();
  IDFieldDeleted: number;
  IndexFieldDeleted: number;
  unsubscribe: Subscription[] = [];
  TemplatesForBackup$: Observable<any>;
  ngOnInit(): void {
    this.getTemplates();
  }
  getTemplates() {
    this.TemplatesForBackup$ =
      this.administratorService.getTemplatesForBackup();
  }
  addTemplates(Name: string, Script: any, ID: any) {
    if (Name.trim() != '') {
      this.administratorService
        .addTemplateForBackup({ Title: Name, Script: Script, Id: ID })
        .subscribe((value: any) => {
          // if (value.rv > 0) {
            this.tostar.success(value.Msg);
            this.TemplateName.reset();
            this.TemplateScript.reset();
            this.getTemplates();
          // } else {
          //   this.tostar.error(value.Msg);
          // }
        });
    }
  }
  onDelete() {
    this.administratorService
      .deleteTemplateForBackup(this.IDFieldDeleted)
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
