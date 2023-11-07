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
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'app-according-to-users',
  templateUrl: './according-to-users.component.html',
  styleUrls: ['./according-to-users.component.css'],
})
export class AccordingToUsersComponent implements OnInit, OnDestroy {
  @Output() openCardTask: EventEmitter<any> = new EventEmitter();
  @Output() resetInstructionFromTasks: EventEmitter<any> = new EventEmitter();
  @Output() openLink: EventEmitter<any> = new EventEmitter();
  @Output() openHistoryWorkersForTask: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  accordingToUsers$: Observable<any>;
  IDDeleted: number;
  subscription: Subscription;
  codes$: Observable<any>;
  accordingToUsers: any;
  CardOpened: any;
  isShedule$: Observable<any>;
  selectedUserPage = 1;
  RowCountUser: any = 50;
  constructor(
    public dialog: MatDialog,
    public service: ppmTasksService,

    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.codes$ = this.service.Codes$;
    this.isShedule$ = this.service.isShedule$;
    this.service.resetSelectedpage$.subscribe((value) => {
      this.selectedUserPage = 1;
      this.service.selectedUserPage = 1;
    });
    this.accordingToUsers$ = this.service.DataTasksGroup$.pipe(
      map((value) => {
        {
          return {
            data: value.DataGtoup?.map((value: any, index: any) => {
              return { ...value, showMore: index == 0 ? true : false };
            }),
            Setting: value?.Setting,
          };
        }
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
  get workOrderCompleted() {
    return this.service.workOrderCompleted;
  }
  ActionOnTable() {
    this.subscription = this.service.ActionUnSelected.subscribe((ID: any) => {
      this.accordingToUsers$.pipe(
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
    this.accordingToUsers$
      .pipe(
        tap((value) => {
          value?.forEach((value: any) => {
            value?.WorkOrders?.forEach((element: any) => {
              element.checked = false;
            });
          });
        })
      )
      .subscribe();
    this.service.WorkOrderSelected = [];
    this.subscription?.unsubscribe();
  }
  openCard(item: any) {
    this.CardOpened = item.ID;
    this.openCardTask.emit(item);
  }
  changeUserPage() {
    this.service.selectedUserPage = this.selectedUserPage;
    this.refresh.emit();
  }
  selectedRowCount(RowCountUser: any) {
    this.RowCountUser = RowCountUser;
    this.service.RowCountUser = RowCountUser;
    this.refresh.emit();
  }
}
