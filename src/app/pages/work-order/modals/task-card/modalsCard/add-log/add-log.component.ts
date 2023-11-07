
import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-log',
  templateUrl: './add-log.component.html',
})
export class AddLogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddLogComponent>,
    private toastr: ToastrService,
        private service: workOrderService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  Close() {
    this.dialogRef.close();
  }
}
