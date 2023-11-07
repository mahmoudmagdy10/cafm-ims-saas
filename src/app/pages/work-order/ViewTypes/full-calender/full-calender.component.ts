import { map } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { workOrderService } from '../../workOrder.service';
import * as moment from 'moment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CalendarOptions, EventChangeArg } from '@fullcalendar/core';

@Component({
  selector: 'app-full-calender',
  templateUrl: './full-calender.component.html',
  styleUrls: ['./full-calender.component.scss'],
})
export class FullCalenderComponent implements OnInit {
  options: CalendarOptions;
  @Output() openCardTask: EventEmitter<any> = new EventEmitter();
  @Input() editable: boolean = true;
  @Input() permissions: any;
  @Output() refreshData: EventEmitter<any> = new EventEmitter();
  @Output() refreshDataPagination: EventEmitter<any> = new EventEmitter();

  CalenderList$!: Observable<any>;
  selectedCalenderPageWork: any = 1;
  RowCountCalender: any = 50;

  constructor(
    private service: workOrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.resetSelectedpage$.subscribe((value) => {
      this.selectedCalenderPageWork = 1;
      this.service.selectedCalenderPageWork = 1;
    });
    this.options = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
      ],
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      // ,timeGridWeek
      events: [],
      editable: this.permissions.PagePermissions.WorkOrdersEdit,
      dayMaxEvents: true,
      navLinks: true,
      eventClick: this.permissions.PagePermissions.WorkOrdersShowCard && this.handleEventClick.bind(this),
      eventChange: this.permissions.PagePermissions.WorkOrdersEdit && this.eventChange.bind(this),
      datesSet: this.datesSet.bind(this),
    };
    this.CalenderList$ = this.service.CalenderList$;
    this.CalenderList$.pipe(
      map((Data) => {
        return Data?.Data?.map((value: any) => {
          return {
            ...value,
            title: value.TaskName,
            start: value.StartDate,
            end: value.DueDate,
            color: value.PriorityColor,
          };
        });
      })
    ).subscribe((value) => {
      this.options.events = value;
    });
  }
  handleEventClick(event: any) {
    this.openCardTask.emit(event.event.extendedProps);
  }
  eventChange(event: EventChangeArg) {
    this.service
      .CalenderUpateDate({
        ids: event.event.extendedProps.ID,
        startDate: moment(event.event.start).format('YYYY-MM-DD HH:mm'),
        dueDate: moment(event.event.end || event.event.start).format(
          'YYYY-MM-DD HH:mm'
        ),
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
  }
  datesSet(DatesSetArg: any) {
    this.service.FromDueDateForCalender = DatesSetArg?.start;
    this.service.ToDueDateForCalender = DatesSetArg?.end;
    this.service.getDataCalender();
  }
  changeListPage() {
    this.service.selectedCalenderPageWork = this.selectedCalenderPageWork;
    this.refreshData.emit();
  }
  selectedRowCount(RowCountCalender: any) {
    this.RowCountCalender = RowCountCalender;
    this.service.RowCountCalender = RowCountCalender;
    // this.service.getAllTask({});
    this.refreshData.emit();
  }
}
