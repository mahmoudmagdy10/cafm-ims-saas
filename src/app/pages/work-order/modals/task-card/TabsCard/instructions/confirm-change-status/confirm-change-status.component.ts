import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-change-status',
  templateUrl: './confirm-change-status.component.html',
  styleUrls: ['./confirm-change-status.component.scss'],
})
export class ConfirmChangeStatusComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmChangeStatusComponent>,
    private toastr: ToastrService,
    private service: workOrderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  changeStatus() {
    if (this.service.LocationForUser?.coords) {
      this.service.changeStatusCard.next(2);
      this.service.WorkOrderOpened.TaskStatusId = 2;
    } else {
      this.toastr.error('Please Accept Permission To Know Your Location');
    }

    this.Close();
    // this.service
    //   .ChangeStatus({
    //     ids: this.service.WorkOrderOpened.ID,
    //     statusId: 2,
    //   })
    //   .subscribe(
    //     (res: any) => {
    //       if (res.rv > 0) {
    //         this.Close();
    //
    //         this.service.WorkOrderOpened.TaskStatusId = 2;
    //       } else {
    //
    //       }
    //     },
    //     (err) => {
    //
    //     }
    //   );
  }
  notShowAgain($event: any) {
    this.service.WorkOrderOpened.notShowAgain = $event.target.checked;
  }
  Close() {
    this.dialogRef.close();
  }
}
