import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'apply-complete',
  templateUrl: './apply-complete.component.html',
  styleUrls: ['./apply-complete.component.scss'],
})
export class ApplyCompleteComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ApplyCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: workOrderService,
    private Router: Router
  ) {}
  pageDirection: any;
  InternalNumber: any;
  RequestDescription: any;
  ngOnInit(): void {
    this.pageDirection = document.dir;
    this.InternalNumber = this.service.WorkOrderOpened?.InternalNumber;
    this.RequestDescription = this.service.WorkOrderOpened?.TaskDescription;
  }
  close(action?: string) {
    this.dialogRef.close({
      action: action,
      data: { ...this.data, InternalNumber: this.InternalNumber },
    });
  }
  FilterAsCompletedTask() {
    this.Router.navigate(['WorkOrder/workOrderCompleted'], {
      queryParams: {
        TaskNumber: this.service.WorkOrderOpened?.InternalNumber,
      },
    });
    this.dialogRef.close();
  }
  OpenCardForTask() {
    this.Router.navigate(['WorkOrder/workOrderCompleted'], {
      queryParams: { TaskIDForCard: this.service.WorkOrderOpened?.ID },
    });
  }
}
