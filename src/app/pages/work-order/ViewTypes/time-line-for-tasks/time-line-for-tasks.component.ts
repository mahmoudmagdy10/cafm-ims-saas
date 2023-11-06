import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {Component,OnInit,Output} from '@angular/core';
import { workOrderService } from '../../workOrder.service';
import { map, filter, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { CalendarOptions, EventChangeArg } from '@fullcalendar/core';
@Component({
  selector: 'app-time-line-for-tasks',
  templateUrl: './time-line-for-tasks.component.html',
  styleUrls: ['./time-line-for-tasks.component.scss'],
})
export class TimeLineForTasksComponent implements OnInit {
  constructor(public service: workOrderService,private toastr:ToastrService) {}
  Tasks$: Observable<any>;
  @Output() openCardTask: EventEmitter<any> = new EventEmitter();
  // @Input() resourceAreaHeaderContent: any;
  // @Input() resourceAreaWidth: any;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
    ],
    // resourceAreaWidth: 200,
    slotDuration: '00:05:00', //time slot. Jumps between 5 and 5 minutes
    // slotLabelInterval: 2,
    scrollTime: '12:00:00',
    // slotMinTime: '12:00:00',
    // slotMaxTime: '16:00:00',
    height: 700,
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'resourceTimelineWeek',
    displayEventTime: true,
    headerToolbar: {
      left: 'today prev,next',
      center: 'title',
      right:
        'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth,resourceTimelineYear',
    },
    // resourceAreaHeaderDidMount: function (info:any) {},
    // resourceTimelineDay,
    themeSystem: 'bootstrap',
    // resourceAreaHeaderContent: 'User Group',
    // resourceAreaColumns: [],
    views: {
      Monthly: {
        type: 'resourceTimeline',
        duration: { months: 24 },
        buttonText: 'Monthly',
        slotLabelInterval: {
          months: 1,
        },
      },
      Quarterly: {
        type: 'resourceTimeline',
        duration: { years: 4 },
        buttonText: 'Quarterly',
        slotLabelInterval: {
          month: 3,
        },
      },
      Biannually: {
        type: 'resourceTimeline',
        duration: { years: 4 },
        buttonText: 'Biannually',
        slotLabelInterval: {
          month: 6,
        },
      },
      Annually: {
        type: 'resourceTimeline',
        duration: { years: 4 },
        buttonText: 'Annually',
        slotLabelInterval: {
          year: 1,
        },
      },
    },
    eventDidMount: function (info: any) {
      //
    },
    // resources: [],

    events: [],
    nowIndicator: true,
    // resourceLabelDidMount: function (info) {
    //
    // },
    // resourceLabelContent: function (arg) {
    //   return {
    //     html:
    //       `<span style="color: ${arg.resource.extendedProps.colorTitle};"><i class="${arg.resource.extendedProps.icon}"></i></span>` +
    //       ' ' +
    //       `<span class="font-2">${arg.resource.title}</span>`,
    //   };
    // },
    eventContent: function (arg :any) {
      //${arg.event.extendedProps.RealCompletionTime}%<

      return {
        html: `<div class="progress" style='height: 35px; background-color:${arg.event.extendedProps.colorCompltion+'33'};
            '>
            <div class="progress-bar"
             role="progressbar"
             style="width: ${arg.event.extendedProps.CompletionRatio||0}%;
             background-color:${arg.event.extendedProps.colorCompltion}"
              aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">${arg.event.extendedProps.CompletionRatio}</div>
          </div>
        `,
      };
      //
    },

    editable: false,

    eventClick: this.handleEventClick.bind(this),
    eventChange: this.eventChange.bind(this),
  };

  ngOnInit(): void {
    this.Tasks$ = this.service.AllTaskObz$.pipe(
      filter((value) => !!value),
      map((value) => value?.Data),
      tap((value) => {
        if (value) {
          let resources: any = [];
          let events: any = [];
          value.forEach((task: any) => {
            resources.push({
              title: task.TaskName,
              id: task.ID,
            });
            events.push({
              ...task,
              resourceId: task.ID,
              title: task.TaskName,
              start: task.StartDate,
              end: task.DueDate,
              color: '#ffffff00',
              colorCompltion: task.PriorityColor,
              CompletionRatio: task.CompletionRatio,
            });
          });
          // this.calendarOptions.resources = [...resources];
          this.calendarOptions.events = [...events];
        }
      })
    );

    // this.calendarOptions.resourceAreaColumns = [...this.resourceAreaColumns];
    // this.calendarOptions.resourceAreaHeaderContent =
    //   this.resourceAreaHeaderContent;
    // this.calendarOptions.resourceAreaWidth = this.resourceAreaWidth;
    // this.calendarOptions.height = this.height;
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

}
