import { CreateTask } from './../../modals/create-task/create-task.component';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { style } from '@angular/animations';
import { Subscription } from 'rxjs/internal/Subscription';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { PrintPPMReportComponent } from '../../modals/print-report/print-report.component';

@Component({
  selector: 'according-to-created-date-pms',
  templateUrl: './according-to-created-date-pms.component.html',
  styleUrls: ['./according-to-created-date-pms.component.css'],
})
export class DailyWoPmsComponent implements OnInit, OnDestroy {
  @Output() openCardTask: EventEmitter<any> = new EventEmitter();
  @Output() resetInstructionFromTasks: EventEmitter<any> = new EventEmitter();
  @Output() openHistoryWorkersForTask: EventEmitter<any> = new EventEmitter();
  @Output() openCard = new EventEmitter<any>();
  @Input() permissions: any;

  DailyWo$: Observable<any>;
  IDDeleted: number;
  subscription: Subscription;
  accordingToUsers: any;
  CardOpened: any;
  CodeObz$: Observable<any>;
  selectedPageDaliy = 1;
  accordingData: any;
  RowCountAccordingUser: any = 50;

  constructor(
    public dialog: MatDialog,
    public service: PmsService,

    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$;

    this.DailyWo$ = this.service.AllSchedulesTime$.pipe(
      map((value) => {
        if (value.Data) {
          let dailyWo = value?.Data.reduce((acc: any, item: any) => {
            let date = item?.ScheduleDate?.toString()?.substring(0, 10);
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(item);
            return acc;
          }, {});
          let arr: any = [];
          for (var key in dailyWo) {
            if (dailyWo.hasOwnProperty(key)) {
              arr.push({ date: key, PMs: dailyWo[key] });
            }
          }
          return { data: arr, Setting: value?.Setting };
        }
        return [];
      }),
      tap((value) => {
        this.accordingData = value;
      })
    );
    // this.ActionOnTable();
  }
  fixWithDateToday(data: any) {
    return moment(new Date(data)).isSameOrBefore(new Date());
  }
  onDeleteTask() {
    this.service.deletePMS({ ids: this.IDDeleted.toString() }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getAllPms();
        } else {
        }
      },
      (err) => {}
    );
  }
  selectWorkOrder(event: any, item: any) {
    if (event.target.checked == true) {
      this.service.PPMSelected.push(item?.scheduletimeid);
    } else {
      this.service.PPMSelected.forEach((value, index) => {
        if (value == item?.scheduletimeid) {
          this.service.PPMSelected.splice(index, 1);
        }
      });
    }
  }
  // ActionOnTable() {
  //   this.subscription = this.service.ActionUnSelected.subscribe((ID: any) => {
  //     this.DailyWo$.pipe(
  //       tap((value) => {
  //         if (value) {
  //           value.forEach((element: any) => {
  //             element.WorkOrders.forEach((element: any) => {
  //               if (element.ID == ID) {
  //                 element.checked = false;
  //               }
  //             });
  //           });
  //         }
  //       })
  //     );

  //     this.cdr.detectChanges();
  //   });
  // }
  ngOnDestroy(): void {
    this.DailyWo$.pipe(
      tap((value) => {
        if(!value){
          return;
        }
        value?.forEach((value: any) => {
          value?.WorkOrders?.forEach((element: any) => {
            element.checked = false;
          });
        });
      })
    ).subscribe();
    // this.service.PPMSelected = [];
    // this.subscription?.unsubscribe();
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
  CreateTask(ID: any, AssignmentID: any) {
    const dialogRefAssimgment = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: AssignmentID,
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
  deletePMS() {
    this.service.deletePMS(this.IDDeleted).subscribe((res: any) => {
      if (res.rv > 0) {
        this.service.getAllPms();
      } else {
      }
    });
  }
  handleEventClick(event: any) {
    // if (!event?.WorkOrderID) {
    this.openCard.emit(event.PreventiveMaintenanceId);
    // } else {
    // this.openLink(event.WorkOrderID);
    // }
  }
  openLink(ID: any) {
    const url: string = window.location.href;

    let host =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `WorkOrder/card/${ID}`;
    window.open(host, '_blank');
  }
  changePage() {
    this.service.selectedPageDaliy = this.selectedPageDaliy;
    this.service.getAllSchedulesTime();
  }
  openLinkInWorkOrder(event: any) {
    if (event?.WorkOrderID) {
      this.openLink(event.WorkOrderID);
    } else {
    }
  }
  selectedRowCount(RowCountAccordingUser: any) {
    this.RowCountAccordingUser = RowCountAccordingUser;
    this.service.RowCountAccordingUser = RowCountAccordingUser;
    this.service.getAllSchedulesTime();
  }
}
