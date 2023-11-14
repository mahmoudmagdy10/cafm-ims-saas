import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { workOrderService } from '../../workOrder.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @Output() openCardTask: EventEmitter<any> = new EventEmitter();
  @Output() resetInstructionFromTasks: EventEmitter<any> = new EventEmitter();
  @Output() openLink: EventEmitter<any> = new EventEmitter();
  @Output() openHistoryWorkersForTask: EventEmitter<any> = new EventEmitter();
  @Output() refreshData: EventEmitter<any> = new EventEmitter();
  @Output() refreshDataPagination: EventEmitter<any> = new EventEmitter();

  selectedListPage: any = 1;
  RowCount: any = 50;

  constructor(
    public service: workOrderService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}
  get workOrderCompleted() {
    return this.service.workOrderCompleted;
  }

  List$: Observable<any> = of([]);
  subscription: Subscription;
  IDDeleted: any;
  codes$: Observable<any>;
  List: any = [];
  groupedItems: any;
  DateAndTime$!: Observable<any>;
  currentDateTime: any;
  isShedule$: Observable<any>;
  ngOnInit(): void {
    this.selectedListPage = this.service.selectedListPage;
    this.service.resetSelectedpage$.subscribe((value) => {
      this.selectedListPage = 1;
      this.service.selectedListPage = 1;
    });

    this.codes$ = this.service.Codes$;
    this.List$ = this.service.AllTaskObz$.pipe(
      tap((value) => {
        if (value) {
          this.List = value?.Data?.map((item: any) => {
            if (!item.TechnicalData) item.TechnicalData = [];
            return {
              ...item,
              isTC: item?.isTC == 1 ? true : false,
            };
          });
        }
      })
    );
    this.ActionOnTable();

    this.DateAndTime$ = this.service.DateAndTime$.pipe(
      tap((val) => {
        this.currentDateTime = new Date(val);
      })
    );
  }
  fixWithDateToday(item: any) {
    let date = this.workOrderCompleted
      ? new Date(item?.CompletionDate)
      : this.currentDateTime;
    // console.log('date', date);
    return moment(new Date(item?.DueDate)).isBefore(date);
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
  selectOrUnSelectAllWorkOrder(event: any) {
    if (event.target.checked == true) {
      this.List.forEach((element: any) => {
        if (element?.checked == false) {
          element.checked = true;
          this.service.WorkOrderSelected.push(element);
        }
      });
    } else {
      this.List.forEach((element: any) => {
        if (element?.checked == true) {
          element.checked = false;
          this.service.WorkOrderSelected.push(element);
        }
      });
    }
  }
  ActionOnTable() {
    this.subscription = this.service.ActionUnSelected.subscribe((ID: any) => {
      this.List.forEach((value: any) => {
        if (value) {
          value.Data?.forEach((element: any) => {
            if (element.ID == ID) {
              element.checked = false;
            }
          });
        }
      });

      this.cdr.detectChanges();
    });
  }
  ngOnDestroy(): void {
    this.List?.forEach((element: any) => {
      element.checked = false;
    });

    this.service.WorkOrderSelected = [];
    this.subscription?.unsubscribe();
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
  get CardOpened() {
    return this.service.CardOpened;
  }
  openCard(item: any) {
    this.service.CardOpened = item.ID;
    this.openCardTask.emit(item);
  }
  changeListPage() {
    this.service.selectedListPage = this.selectedListPage;
    this.refreshData.emit();
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this.service.RowCount = RowCount;
    this.refreshData.emit();

    // this.refreshDataPagination.emit();
  }
}
