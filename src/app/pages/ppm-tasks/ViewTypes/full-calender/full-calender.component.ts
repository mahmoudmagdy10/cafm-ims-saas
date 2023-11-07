import { map } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { ppmTasksService } from '../../ppm-tasks.service';
import * as moment from 'moment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
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
  @Output() refreshData: EventEmitter<any> = new EventEmitter();

  CalenderList$!: Observable<any>;
  selectedCalenderPage: any = 1;
  RowCountCalender: any = 50;
  isLoading: boolean = false;

  constructor(
    private service: ppmTasksService,
  ) { }

  ngOnInit(): void {
    this.service.resetSelectedpage$.subscribe((value) => {
      this.selectedCalenderPage = 1;
      this.service.selectedCalenderPage = 1;
    });
    this.options = {
      initialDate: new Date(),
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      // ,timeGridWeek
      events: [],
      editable: true,
      dayMaxEvents: true,
      navLinks: true,
      eventClick: this.handleEventClick.bind(this),
      eventChange: this.eventChange.bind(this),
      datesSet: this.datesSet.bind(this),
    };
    this.CalenderList$ = this.service.CalenderList$;
    this.CalenderList$.pipe(
      map((Data) => {
        return Data
          ? Data?.Data?.map((value: any) => {
            let isSame = moment(value.StartDate).isSame(value.DueDate);
            return {
              ...value,
              ID: value.ID,
              TaskName: value?.TaskName,
              title: value.TaskName,
              start: moment(value.StartDate).format(
                isSame ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
              ),
              end: moment(value.DueDate).format(
                isSame ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
              ),
              color: value.PriorityColor,
            };
          })
          : [];
      })
    ).subscribe((value) => {
      this.options.events = value;
    });
  }

  handleEventClick(event: any) {
    this.openCardTask.emit(event.event.extendedProps);
  }

  eventChange(event: EventChangeArg) {
    if (event.event.extendedProps.ID) {
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
    } else {
      this.service
        .SheduleUpateDate({
          id: event.event.extendedProps.scheduletimeid,
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
  }

  datesSet(DatesSetArg: any) {
    (this.service.FromDueDateForCalender = DatesSetArg?.start),
      (this.service.ToDueDateForCalender = DatesSetArg?.end);
    this.service.getDataCalender();
  }

  changeListPage() {
    this.service.selectedCalenderPage = this.selectedCalenderPage;
    this.service.getDataCalender({
      FromDate: this.service.FromDueDateForCalender,
      ToDate: this.service.ToDueDateForCalender,
    });
    this.refreshData.emit();
  }

  selectedRowCount(RowCountCalender: any) {
    this.RowCountCalender = RowCountCalender;
    this.service.RowCountCalender = RowCountCalender;
    this.refreshData.emit();
  }
}
