import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-request-foreign-service',
  templateUrl: './request-foreign-service.component.html',
})
export class RequestForeignServiceComponent implements OnInit {
  foreignServiceForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<RequestForeignServiceComponent>,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.foreignServiceForm = this.fb.group({
      itemType: [2],
      serviceName: [''],
      quantity: [''],
    });
  }

  ngOnInit(): void {}
  onSave() {
    this.dialogRef.close(this.foreignServiceForm.value);
  }
  Close() {
    this.dialogRef.close();
  }
}
