import { UntypedFormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { workOrderService} from '../../workOrder.service';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss'],
})
export class ChangeStatusComponent implements OnInit {
  Codes$: Observable<any>;
  TaskStatusId = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<ChangeStatusComponent>,
    private toastr: ToastrService,
        private service: workOrderService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
  }
  onChange() {
    this.service
      .ChangeStatus({
        ids: this.service.WorkOrderSelected.map((value) => value.ID).join(','),
        statusId: this.TaskStatusId.value,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

            this.service.WorkOrderSelected = [];
            this.service.getAllTask({});
            this.dialogRef.close();
          } else {

          }
        },
        (err) => {


        }
      );
  }
  onClose() {
    this.dialogRef.close();
  }
}
