import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDueDateComponent } from '../change-due-date/change-due-date.component';
import { ChangePriortyComponent } from '../change-priorty/change-priorty.component';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { DeleteTasksComponent } from '../delete-tasks/delete-tasks.component';
import { Observable } from 'rxjs';
import { PrintSelectedComponent } from '../print-selected/print-selected.component';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'app-actions-of-work-order-selected',
  templateUrl: './actions-of-work-order-selected.component.html',
  styleUrls: ['./actions-of-work-order-selected.component.scss'],
})
export class ActionsOfWorkOrderSelectedComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _translateService: TranslateService,
    private _workOrderService: ppmTasksService
  ) {}
  @Input() workOrderCompleted: boolean;
  @Output() export = new EventEmitter<any>();
  items: any = [];
  Codes$: Observable<any>;
  ngOnInit(): void {
    this.Codes$ = this._workOrderService.Codes$.pipe(
      tap((code) => {
        if (code) {
          this.items = [];
          if (code?.PagePermissions?.WorkOrdersDelete) {
            this.items.push({
              label: this._translateService.instant(
                'PREVENTIVE_TASKS_MANAGEMENT.ACTIONS_ON_SELECTED.DELETE'
              ),
              icon: 'fa fa-trash fa-lg',
              command: () => {
                this.deleteTask();
              },
            });
          }
          this.items.push({
            label: this._translateService.instant(
              'PREVENTIVE_TASKS_MANAGEMENT.ACTIONS_ON_SELECTED.EDIT_EXPIRY_TASK_DATE'
            ),
            icon: 'fas fa-file-import fa-lg',
            command: () => {
              this.changeDueDate();
            },
          });
          this.items.push({
            label: this._translateService.instant(
              'PREVENTIVE_TASKS_MANAGEMENT.ACTIONS_ON_SELECTED.EDIT_PRAIORITY'
            ),
            icon: 'fas fa-file-import fa-lg',
            command: () => {
              this.changeProirty();
            },
          });
          this.items.push({
            label: this._translateService.instant(
              'PREVENTIVE_TASKS_MANAGEMENT.ACTIONS_ON_SELECTED.EXPORT'
            ),
            icon: 'fas fa-file-import fa-lg',
            command: () => {
              this.export.emit();
            },
          });
          if (code?.PagePermissions?.WorkOrdersPrint) {
            this.items.push({
              label: this._translateService.instant(
                'PREVENTIVE_TASKS_MANAGEMENT.ACTIONS_ON_SELECTED.PRINT_SELECTED'
              ),
              icon: 'fas fa-print',
              command: () => {
                this.printReport();
              },
            });
          }
        }
      })
    );
  }
  printReport() {
    const dialogRef = this.dialog
      .open(PrintSelectedComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }
  changeProirty() {
    const dialogRef = this.dialog
      .open(ChangePriortyComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  changeStatus() {
    const dialogRef = this.dialog
      .open(ChangeStatusComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  changeDueDate() {
    const dialogRef = this.dialog
      .open(ChangeDueDateComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteTask() {
    const dialogRef = this.dialog
      .open(DeleteTasksComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
