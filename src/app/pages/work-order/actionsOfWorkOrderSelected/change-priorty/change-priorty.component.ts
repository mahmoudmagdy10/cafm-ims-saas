import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { workOrderService} from '../../workOrder.service';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-change-priorty',
  templateUrl: './change-priorty.component.html',
  styleUrls: ['./change-priorty.component.scss'],
})
export class ChangePriortyComponent implements OnInit {
  Codes$: Observable<any>;
  PriorityId = new UntypedFormControl();

  constructor(
    public dialogRef: MatDialogRef<ChangePriortyComponent>,
    private toastr: ToastrService,
        private service: workOrderService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
  }
  onChange() {
    this.service
      .ChangePriority({
        ids: this.service.WorkOrderSelected.map((value) => value.ID).join(','),
        priorityId: this.PriorityId.value,
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
