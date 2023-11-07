import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { filter, map, switchMap } from 'rxjs/operators';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { workOrderService } from '../workOrder.service';
import { ChangeToPendingComponent } from '../change-to-pending/change-to-pending.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-status-task',
  templateUrl: './status-task.component.html',
})
export class StatusTaskComponent implements OnInit {
  constructor(
    public service: workOrderService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}
  TaskStatus$: Observable<any> = of([]);
  @Input() item: any;

  @Input() ID: string | number;
  @Input() permission: boolean;
  @Input() TaskStatusName: string;
  @Input() TaskStatusId: string | number;
  refresh = new BehaviorSubject('');
  ngOnInit(): void {
    this.TaskStatus$ = this.refresh.pipe(
      switchMap((value) => {
        return this.service.Codes$.pipe(
          filter((value) => !!value),
          map((value) =>
            value.TaskStatusId?.map((value: any) => {
              const menuItem: MenuItem = {
                ...value,
                label: value.Name,
                disabled: value.code == this.TaskStatusId,
                command: () => {
                  if (value.code == 5) {
                    this.changeToPending(value.code, value.Name);
                  } else {
                    this.updateStatus(value.code, value.Name);
                  }
                },
              };

              return menuItem;
            })
          )
        );
      })
    );
  }
  updateStatus(newStatus: any, name: any) {
    this.service
      .ChangeStatus({
        ids: this.ID,
        statusId: newStatus,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.TaskStatusId = newStatus;
            this.TaskStatusName = name;
            this.refresh.next('');
          } else {
            this.toastr.error(res.Msg);
          }
        },
        (err) => {}
      );
  }
  changeToPending(newStatus: any, name: any) {
    const dialogRef = this.dialog
      .open(ChangeToPendingComponent, {
        width: '60vw',
        data: { ID: this.ID },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.TaskStatusId = newStatus;
        this.TaskStatusName = name;
      }
    });
  }
}
