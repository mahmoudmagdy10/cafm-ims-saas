import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import * as moment from 'moment';
import { PmsService } from '../../pms.service';
import { CalendarOptions, EventChangeArg } from '@fullcalendar/core';
import { Observable } from 'rxjs';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-view-calender',
  templateUrl: './view-calender.component.html',
})
export class ViewCalenderComponent implements OnInit {
  options: CalendarOptions ;
  @Output() openCard: EventEmitter<any> = new EventEmitter();
  @Output() Refresh: EventEmitter<any> = new EventEmitter();

  @Input() permissions: any;
  CalenderList$!: Observable<any>;
  selectedCalenderPage: any = 1;
  RowCountCalender: any = 50;
  loading = false;
  constructor(private service: PmsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.service.resetSelectedpage$.subscribe((value) => {
      this.selectedCalenderPage = 1;
      this.service.selectedCalenderPage = 1;
    });
    this.options = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
      ],
      initialDate: moment(new Date()).format('YYYY-MM-DD'),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      // ,timeGridWeek,timeGridDay
      events: [],
      editable: this.permissions.PagePermissions.PMScheduleEdit,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventClick:
        this.permissions.PagePermissions.PMScheduleEdit &&
        this.handleEventClick.bind(this),
      eventChange:
        this.permissions.PagePermissions.PMScheduleEdit &&
        this.eventChange.bind(this),
      datesSet: this.datesSet.bind(this),
    };
    this.CalenderList$ = this.service.AllSchedulesTimeCalender$;
    this.service.AllSchedulesTimeCalender$.pipe(
      map((Data) => {
        if (Data?.Data) {
          this.loading = false;
        } else {
          this.loading = true;
        }
        return Data?.Data?.map((value: any) => {
          return {
            ...value,
            title: value.TaskName,
            start: value.ScheduleDate,
            end: value.ScheduleDate,
            color: value.WorkOrderID ? '#42f56c' : '',
          };
        });
      })
    ).subscribe((value) => {
      this.options.events = value;
    });
  }
  handleEventClick(event: any) {
    if (!event.event.extendedProps.WorkOrderID) {
      this.openCard.emit(event.event.extendedProps.PreventiveMaintenanceId);
    } else {
      this.openLink(event.event.extendedProps.WorkOrderID);
    }
  }
  eventChange(event: EventChangeArg) {
    if (!event.event.extendedProps.WorkOrderID) {
      this.service
        .CalenderUpateDate({
          ID: event.event.extendedProps.scheduletimeid,
          startDate: moment(event.event.start).format('YYYY-MM-DD HH:mm'),
        })
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {
            } else {
              event.revert();
            }
          },
          (err) => {
            event.revert();
          }
        );
    } else {
      event.revert();
    }
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

  datesSet(DatesSetArg: any) {
    this.service.getAllSchedulesTimeCalender({
      FromDate: DatesSetArg?.start,
      ToDate: DatesSetArg?.end,
    });
    (this.service.FromDate = DatesSetArg?.start),
      (this.service.ToDate = DatesSetArg?.end);
  }
  changeListPage() {
    this.service.selectedCalenderPage = this.selectedCalenderPage;
    this.service.getAllSchedulesTimeCalender({
      FromDate: this.service.FromDate,
      ToDate: this.service.ToDate,
    });
    this.Refresh.emit();
  }
  selectedRowCount(RowCountCalender: any) {
    this.RowCountCalender = RowCountCalender;
    this.service.RowCountCalender = RowCountCalender;
    this.Refresh.emit();
  }
}
