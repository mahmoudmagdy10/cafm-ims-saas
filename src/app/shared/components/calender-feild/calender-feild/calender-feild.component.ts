import {
  Component,
  OnInit,
  forwardRef,
  Input,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calender-feild',
  templateUrl: './calender-feild.component.html',
  styleUrls: ['./calender-feild.component.scss'],

  providers: [
    [MessageService],
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalenderFeildComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CalenderFeildComponent,
      multi: true,
    },
  ],
})
export class CalenderFeildComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() submitted: boolean = false;
  @Input() label: string = '';
  onChange: any = () => {};
  onTouch: any = () => {};
  @Input() disabled: boolean = false;
  required: boolean = false;
  @Input() timeOnly: boolean = false;
  @Input() isMonth: boolean = false;
  @Input() showTime: boolean = false;
  @Input() minDate!: Date | string;
  @Input() maxDate!: Date | string;
  @Input() validDate!: string;
  @Input() isLabel: boolean = true;
  @Input() showOnFocus: boolean = false;
  @Input() showIcon: boolean = true;

  @Input() placeholder: string = '';
  @Output() onChangeDate = new EventEmitter();
  MinDate!: Date;
  MaxDate!: Date;
  calenderFieldControl = new UntypedFormControl();
  valueChangesSubscription!: Subscription;
  constructor(
    private messageService: MessageService,
    private _translateService: TranslateService
  ) {}

  writeValue(value: any) {
    if (value && !this.timeOnly) {
      value = value;
    } else if (value && this.timeOnly) {
      if (value.includes('T')) {
        value = value;
      } else {
        const time = '2022-12-25T' + value;
        value = time;
      }
    }
    if (!value && !(this.validDate == 'currentDate')) {
      this.calenderFieldControl.reset(null, { emitEvent: false });
    } else if (!(this.validDate == 'currentDate')) {
      this.calenderFieldControl.setValue(new Date(value), {
        emitEvent: false,
      });
    } else if (this.validDate == 'currentDate') {
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    Object.keys(control.errors! || {}).forEach((key) => {
      if (key == 'required') {
        this.required = true;
        this.calenderFieldControl.setValidators(Validators.required);
      }
    });
    return null;
  }
  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.calenderFieldControl.disable();
    } else {
      this.calenderFieldControl.enable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['submitted']) {
      if (this.submitted && this.calenderFieldControl.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: `${this._translateService.instant(
            this.label
          )} ${this._translateService.instant('Shared.IS_REQUIRED')}`,
          detail: '',
        });
      }
    }
    if (this.minDate) {
      this.MinDate = new Date(this.minDate);
    }
    if (this.maxDate) {
      this.MaxDate = new Date(this.maxDate);
    }
  }
  ngOnInit() {
    this.valueChangesSubscription =
      this.calenderFieldControl.valueChanges.subscribe((value) => {
        if (this.timeOnly) {
          this.onChange(moment(value).format('HH:mm'));
          this.onChangeDate.emit(moment(value).format('HH:mm'));
        } else {
          this.onChange(value);
          this.onChangeDate.emit(value);
        }
      });
    if (this.validDate == 'BirthDate') {
      this.MaxDate = new Date();
    } else if (this.validDate == 'futureDate') {
      this.MinDate = new Date();
    } else if (this.validDate == 'currentDate') {
      setTimeout(() => {
        this.calenderFieldControl.setValue(new Date());
      }, 0);
    }
  }
  ngOnDestroy() {
    this.valueChangesSubscription.unsubscribe();
  }
}
