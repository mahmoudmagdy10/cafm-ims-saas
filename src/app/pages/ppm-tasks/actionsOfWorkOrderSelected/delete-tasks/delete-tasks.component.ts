import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'app-delete-tasks',
  templateUrl: './delete-tasks.component.html',
  styleUrls: ['./delete-tasks.component.scss'],
})
export class DeleteTasksComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteTasksComponent>,
    private toastr: ToastrService,
    private service: ppmTasksService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  onDelete() {
    this.service
      .deleteSelected({
        ids: this.service.WorkOrderSelected.map((value) => value.ID).join(','),
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.service.WorkOrderSelected = [];
            this.service.getAllTask({ isPM: true });
            this.dialogRef.close();
          } else {
          }
        },
        (err) => {}
      );
  }
  onClose() {
    this.dialogRef.close();
  }
}
