import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  UntypedFormGroup,
  FormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PmsService } from '../../pms.service';
import * as moment from 'moment';

@Component({
  selector: 'schedules',
  templateUrl: 'schedules.component.html',
})
export class schedules implements OnInit {
  schedulesForm: UntypedFormGroup;
  daysOfWeek : any[]=[];
  daysOfMonth: any = [];
  monthOfYear: any = [];
  weekDaysValue: any = [];
  minDate = new Date();
  ShedulerType: any = 0;
  dataDays: any[] = [];

  disabled = false;
  constructor(
    public dialogRef: MatDialogRef<schedules>,
    private fb: UntypedFormBuilder,
    private service: PmsService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dataSchedule: any
  ) {
    this.schedulesForm = this.fb.group({
      ID: [],
      PMId: [],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      // OccuranceNo: [''],
      ScheduleTime: ['', Validators.required],
      WeekDays: [null, Validators.required],
      MonthNo: [],
      MonthDay: [null, Validators.required],
      OccuranceNoToSkip: [0],
      IsSkip: [false],
      DueDateDay: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.daysOfWeek = [
      {
        id: 1,
        name: this.translateService.instant('PM.SATURDAY'),
        checked: false,
      },
      { id: 2, name: this.translateService.instant('PM.SUNDAY'), checked: false },
      { id: 3, name: this.translateService.instant('PM.MONDAY'), checked: false },
      {
        id: 4,
        name: this.translateService.instant('PM.TUESDAY'),
        checked: false,
      },
      {
        id: 5,
        name: this.translateService.instant('PM.WEDNESDAY'),
        checked: false,
      },
      {
        id: 6,
        name: this.translateService.instant('PM.THURSDAY'),
        checked: false,
      },
      { id: 7, name: this.translateService.instant('PM.FRIDAY'), checked: false },
    ];
    this.schedulesForm.get('WeekDays')?.setValue([this.daysOfWeek[0]?.id]);

    if (this.dataSchedule) {
      this.schedulesForm.patchValue(this.dataSchedule);
      this.ShedulerType = this.returnIndex(this.dataSchedule?.ScheduleType);
      this.disabled = !!this.dataSchedule?.ScheduleType;
      if (this.disabled) {
        this.schedulesForm.disable();
      }
    }
    if (this.schedulesForm.controls['OccuranceNoToSkip'].value) {
      this.schedulesForm.controls['IsSkip'].setValue(true);
    }
    if (this.dataSchedule.WeekDays) {
      const WeekDaysArr = this.dataSchedule.WeekDays.split(',');
      this.daysOfWeek.forEach((element: any) => {
        if (WeekDaysArr.find((value: any) => value == element.id)) {
          this.weekDaysValue.push(element.id);
          element.checked = true;
        }
      });
    }

    for (var value = 1; value <= 31; value++) {
      this.daysOfMonth.push({ id: value, name: value });
    }
    this.schedulesForm.get('MonthDay')?.setValue(this.daysOfMonth[0]?.id);


    for (var value = 1; value <= 12; value++) {
      this.monthOfYear.push({ id: value, name: value });
    }
    for (var i = 0; i <= 30; i++) {
      this.dataDays.push(i);
    }
  }
  get scheduleTypeValue() {
    return this.schedulesForm.controls['ScheduleType'].value;
  }

  get monthDayValue() {
    return this.schedulesForm.controls['MonthDay'].value;
  }

  checkWeekDaysValue(event: any, id: any) {
    if (event.target.checked) {
      this.weekDaysValue.push(id);
    } else {
      this.weekDaysValue.forEach((element: any, index: any) => {
        if (element == id) {
          this.weekDaysValue.splice(index, 1);
        }
      });
    }
  }
  returnType(Type: number) {
    return Type == 0
      ? 'Daily'
      : Type == 1
      ? 'Weekly'
      : Type == 2
      ? 'Monthly'
      : Type == 3
      ? 'Quarrterly'
      : Type == 4
      ? 'HalfYearly'
      : Type == 5
      ? 'Yearly'
      : '';
  }
  returnIndex(Type: string) {
    return Type == 'Daily'
      ? 0
      : Type == 'Weekly'
      ? 1
      : Type == 'Monthly'
      ? 2
      : Type == 'Quarrterly'
      ? 3
      : Type == 'HalfYearly'
      ? 4
      : Type == 'Yearly'
      ? 5
      : '';
  }
  createOrEditSchedules() {
    if (this.schedulesForm.valid) {
      if (
        this.schedulesForm.get('StartDate')?.value &&
        moment(this.schedulesForm.get('StartDate')?.value).isAfter(
          this.schedulesForm.get('EndDate')?.value
        )
      ) {
        this.toastr.error('Due date cannot be less than the start date');
      } else {
        this.service
          .createOrEditSchedules({
            ...this.schedulesForm.value,
            WeekDays: this.weekDaysValue ? this.weekDaysValue.join(',') : '',
            ScheduleType: this.returnType(this.ShedulerType),
          })
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                this.dialogRef.close(res.data[0]);
                console.log(
                  'TimeExecute',
                  this.schedulesForm.get('TimeExecute')?.value
                );
              } else {
              }
            },
            (err) => {}
          );
      }
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  Close() {
    this.dialogRef.close();
  }
}
