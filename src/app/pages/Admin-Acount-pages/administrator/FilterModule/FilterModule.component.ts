import { administratorService } from './../administrator.service';
import { map } from 'rxjs/operators';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-Filter',
  templateUrl: './FilterModule.component.html',
})
export class FilterModuleComponent implements OnInit {
  Servises: any[];
  SubscriptionStatusName: string;
  SubscriptionTypeName: string;
  codes: any;
  ServiceCode: any[] = [];
  ServiceName: any[] = [];

  selectedCities: any[];
  pageDirection: string;

  FormFilter = new UntypedFormGroup({
    CompanyName: new UntypedFormControl(''),
    SubscriptionStatusId: new UntypedFormControl(),
    SubscriptionTypeId: new UntypedFormControl(),
    StartDate: new UntypedFormControl(''),
    EndDate: new UntypedFormControl(''),
    ServicesID: new UntypedFormControl(''),
  });
  @Output() afterSearch: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(public administratorService: administratorService) {}
  ngOnInit(): void {
    this.pageDirection = document.dir;

    this.administratorService.getCodeCampony().subscribe((Value) => {
      if (Value && Value != 0) {
        this.codes = { ...Value };
        this.Servises = this.codes.ServicesId.map((value: any) => {
          return { code: value.Code, name: value.Name };
        });
      }
    });
  }

  clearFilter() {
    this.FormFilter.reset();

    this.FormFilter.get('CompanyName')?.setValue('');
    this.FormFilter.get('StartDate')?.setValue('');
    this.FormFilter.get('EndDate')?.setValue('');
    this.FormFilter.get('SubscriptionStatusId')?.setValue(null);
    this.FormFilter.get('SubscriptionTypeId')?.setValue(null);
  }
  onSearch() {
    if (this.FormFilter.get('ServicesID')?.value) {
      this.ServiceCode = this.FormFilter.get('ServicesID')?.value.map(
        (value: any) => {
          return value.code;
        }
      );
      this.ServiceName = this.FormFilter.get('ServicesID')?.value.map(
        (value: any) => {
          return value.name;
        }
      );
    }



    this.afterSearch.emit({
      ...this.FormFilter.value,
      SubscriptionStatusId: this.FormFilter.get('SubscriptionStatusId')?.value
        ?.code
        ? this.FormFilter.get('SubscriptionStatusId')?.value?.code
        : '',
      SubscriptionTypeId: this.FormFilter.get('SubscriptionTypeId')?.value?.code
        ? this.FormFilter.get('SubscriptionTypeId')?.value?.code
        : '',
      SubscriptionStatusName: !this.FormFilter.get('SubscriptionStatusId')
        ?.value
        ? ''
        : this.FormFilter.get('SubscriptionStatusId')?.value.name,
      SubscriptionTypeName: !this.FormFilter.get('SubscriptionTypeId')?.value
        ? ''
        : this.FormFilter.get('SubscriptionTypeId')?.value.name,
      ServicesID: this.ServiceCode.join(','),
      ServicesName: this.ServiceName.join(','),
    });
  }
  onCancel() {
    this.cancel.emit();
  }
}
