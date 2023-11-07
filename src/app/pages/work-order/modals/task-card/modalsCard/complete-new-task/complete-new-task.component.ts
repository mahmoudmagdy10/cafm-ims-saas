import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'complete-new-task',
  templateUrl: './complete-new-task.component.html',
})
export class CompleteNewTask implements OnInit {
  formComplete: UntypedFormGroup;
  Muints: any = [];
  Hours: any = [];
  constructor(
    public dialogRef: MatDialogRef<CompleteNewTask>,
    private toastr: ToastrService,
    private service: workOrderService,

    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder
  ) {
    this.formComplete = this.fb.group({
      hourDefault: [0],
      minDefault: [0],
      hour: [0],
      min: [0],
      note: [],
      IdentificationDescription: [],
    });
  }

  ngOnInit(): void {
    var hours = Math.floor(this.data.dataEdit.RealCompletionTime / 60);
    var minutes = this.data.dataEdit.RealCompletionTime % 60;
    this.formComplete.controls['hourDefault'].setValue(hours);
    this.formComplete.controls['minDefault'].setValue(minutes);
    this.formComplete.controls['hourDefault'].disable();
    this.formComplete.controls['minDefault'].disable();
    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
  }
  Close() {
    this.dialogRef.close();
  }
  InstructionCompleted() {
    const body = {
      Id: this.data.dataEdit.ID,
      time: Math.ceil(
        +this.formComplete.controls['hour'].value * 60 +
          +this.formComplete.controls['min'].value
      ),
      note: this.formComplete.controls['note'].value,
      IdentificationDescription:
        this.formComplete.controls['IdentificationDescription'].value,
    };
    this.service.InstructionCompleted(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.dialogRef.close('completed');
        } else {
        }
      },
      (err) => {}
    );
  }
  Reject() {
    const body = {
      Id: this.data.dataEdit.ID,
      note: this.formComplete.controls['note'].value,
      IdentificationDescription:
        this.formComplete.controls['IdentificationDescription'].value,
    };
    this.service.Reject(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.dialogRef.close('completed');
        } else {
        }
      },
      (err) => {}
    );
  }
}
