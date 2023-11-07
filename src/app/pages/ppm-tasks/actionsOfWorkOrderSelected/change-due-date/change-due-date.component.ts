import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ppmTasksService } from '../../ppm-tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-due-date',
  templateUrl: './change-due-date.component.html',
  styleUrls: ['./change-due-date.component.scss'],
})
export class ChangeDueDateComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChangeDueDateComponent>,
    private service: ppmTasksService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  DueDate = new UntypedFormControl();

  ngOnInit(): void {}
  onChange() {
    this.service
      .ChangeDueDate({
        ids: this.service.WorkOrderSelected.map((value) => value.ID).join(','),
        dueDate: this.DueDate.value,
        isSoftService : this.IsSoftService()
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
        (err) => {}
      );
  }
  onClose() {
    this.dialogRef.close();
  }

  IsSoftService() {
    const currentRoute = this.router.url;
    const segmentsToCheck = ['CreateSoftServices', 'SoftServiceTasks', 'CompletedSST'];
    return segmentsToCheck.some(segment => currentRoute.includes(segment));
  }
}
