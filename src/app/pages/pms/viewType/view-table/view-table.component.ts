import { Observable } from 'rxjs';
import { schedules } from './../../modals/schedules/schedules.component';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { ToastrService } from 'ngx-toastr';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreateTask } from '../../modals/create-task/create-task.component';
import { PrintPPMReportComponent } from '../../modals/print-report/print-report.component';

@Component({
  selector: 'app-view-table',
  templateUrl: './view-table.component.html',
})
export class ViewTableComponent implements OnInit {
  IDDeleted: any;
  @Output() openCard = new EventEmitter<any>();
  @Output() openCardTabUpComing = new EventEmitter<any>();
  selectedPage = 1;
  RowCountPM: any = 50;

  CodeObz$: Observable<any>;

  pmsData$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private service: PmsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$;

    this.pmsData$ = this.service.AllPmsObz$;
  }
  schedules(item: any) {
    const dialogRef = this.dialog
      .open(schedules, {
        minWidth: '60vw',
        maxWidth: '80vw',
        data: { PMId: item.ID },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  CreateTask(ID: any, AssignmentID: any) {
    const dialogRefAssimgment = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: AssignmentID,
        skipInterceptor: 'true',
      },
    });

    dialogRefAssimgment.afterClosed().subscribe((result) => {

      if (result) {
        this.service
          .createWorkOrder({ pmId: ID, taskAssignmentId: result.AssignmentID })
          .subscribe((value) => {
            const dialogRef = this.dialog
              .open(CreateTask, {
                width: '30vw',
                disableClose: true,
              })
              .addPanelClass('cmms-custom-modal');
          });
      }
    });
  }
  deletePMS() {
    this.service.deletePMS(this.IDDeleted).subscribe((res: any) => {
      if (res.rv > 0) {
        this.service.getAllPms();
      } else {
      }
    });
  }
  ArrayToString(data: any) {
    if (data) {
      return data
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
    }
  }
  changePage() {
    this.service.selectedPage = this.selectedPage;
    this.service.getAllPms();
  }
  PMReportPrint(item: any) {
    const dialogRef = this.dialog
      .open(PrintPPMReportComponent, {
        width: '50vw',
        disableClose: true,
        data: {
          ID: item.ID,
        },
        autoFocus: false,
      })
      .addPanelClass('cmms-custom-modal');
  }
  selectedRowCount(RowCountPM: any) {
    this.RowCountPM = RowCountPM;
    this.service.RowCountPM = RowCountPM;
    this.service.getAllPms();
  }
}
