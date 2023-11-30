import { style } from '@angular/animations';
import { Subscription } from 'rxjs/internal/Subscription';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TaskCardComponent } from './../../modals/task-card/task-card.component';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ppmTasksService } from '../../ppm-tasks.service';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'according-to-created-date',
  templateUrl: './according-to-created-date.component.html',
  styleUrls: ['./according-to-created-date.component.css'],
})
export class DailyWoComponent implements OnInit, OnDestroy {
  @Output() openCardTask: EventEmitter<any> = new EventEmitter();
  @Output() resetInstructionFromTasks: EventEmitter<any> = new EventEmitter();
  @Output() openLink: EventEmitter<any> = new EventEmitter();
  @Output() openHistoryWorkersForTask: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  selectedListPage = 1;
  DailyWo$: Observable<any>;
  IDDeleted: number;
  subscription: Subscription;
  codes$: Observable<any>;
  isShedule$: Observable<any>;
  accordingToUsers: any;
  CardOpened: any;
  RowCountList: any = 50;
  constructor(
    public dialog: MatDialog,
    public service: ppmTasksService,

    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.selectedListPage = this.service.selectedListPage;
    this.codes$ = this.service.Codes$;
    this.isShedule$ = this.service.isShedule$;
    this.service.resetSelectedpage$.subscribe((value) => {
      this.selectedListPage = 1;
      this.service.selectedListPage = 1;
    });
    this.DailyWo$ = this.service.AllTaskObz$.pipe(
      map((value) => {
        let dailyWo = value?.Data?.reduce((acc: any, item: any) => {
          let date = (
            this.service.isShedule.value ? item?.ScheduleDate : item?.StartDate
          )
            ?.toString()
            ?.substring(0, 10);
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
          return acc;
        }, {});
        let arr: any = [];
        for (var key in dailyWo) {
          if (dailyWo.hasOwnProperty(key)) {
            arr.push({ date: key, WorkOrders: dailyWo[key] });
          }
        }
        return { data: arr, Setting: value?.Setting };
      }),
      tap((value) => {
      })
    );
    this.ActionOnTable();
  }
  fixWithDateToday(data: any) {
    return moment(new Date(data)).isSameOrBefore(new Date());
  }
  onDeleteTask() {
    this.service.deleteSelected({ ids: this.IDDeleted.toString() }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getAllTask({});
        } else {
        }
      },
      (err) => {}
    );
  }
  selectWorkOrder(event: any, item: any) {
    if (event.target.checked == true) {
      this.service.WorkOrderSelected.push(item);
    } else {
      this.service.WorkOrderSelected.forEach((value, index) => {
        if (value.ID == item.ID) {
          this.service.WorkOrderSelected.splice(index, 1);
        }
      });
    }
  }
  ActionOnTable() {
    this.subscription = this.service.ActionUnSelected.subscribe((ID: any) => {
      this.DailyWo$.pipe(
        tap((value) => {
          if (value) {
            value.forEach((element: any) => {
              element.WorkOrders.forEach((element: any) => {
                if (element.ID == ID) {
                  element.checked = false;
                }
              });
            });
          }
        })
      );

      this.cdr.detectChanges();
    });
  }
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
    this.service.WorkOrderSelected = [];
    this.subscription?.unsubscribe();
  }
  openCard(item: any) {
    this.CardOpened = item.ID;
    this.openCardTask.emit(item);
  }
  changePage() {
    this.service.selectedListPage = this.selectedListPage;
    this.refresh.emit();
  }
  selectedRowCount(RowCountList: any) {
    this.RowCountList = RowCountList;
    this.service.RowCountList = RowCountList;
    this.refresh.emit();
  }
}
