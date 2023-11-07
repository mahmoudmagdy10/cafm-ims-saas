import { UsersService } from './../../users.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// OnChanges

@Component({
  selector: 'user-Filter',
  templateUrl: './FilterModule.component.html',
})
export class FilterUserComponent implements OnInit {
  SubscriptionStatusName: string;
  SubscriptionTypeName: string;
  @Input('codes') codes: any;
  FilterSearch: any;
  selectedCities: any[];
  @Output() afterSearch: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() handleClickFilter: EventEmitter<any> = new EventEmitter();
  pageDirection: string;

  FormFilter = new UntypedFormGroup({
    Name: new UntypedFormControl(''),
    RoleId: new UntypedFormControl(),
    LocationId: new UntypedFormControl(),
    StatusId: new UntypedFormControl(),
  });

  constructor() {}

  ngOnInit() {
    this.pageDirection = document.dir;
  }
  clearFilter() {
    this.FormFilter.get('Name')?.setValue('');
    this.FormFilter.get('RoleId')?.setValue(null);
    this.FormFilter.get('LocationId')?.setValue(null);
    this.FormFilter.get('StatusId')?.setValue(null);
  }
  onSearch() {
    this.handleClickFilter.emit(true);
    this.afterSearch.emit({
      ...this.FormFilter.value,
      RoleId: this.FormFilter.get('RoleId')?.value?.Code
        ? this.FormFilter.get('RoleId')?.value?.Code
        : '',
      LocationId: this.FormFilter.get('LocationId')?.value?.Code
        ? this.FormFilter.get('LocationId')?.value?.Code
        : '',
      RoleName: !this.FormFilter.get('RoleId')?.value
        ? ''
        : this.FormFilter.get('RoleId')?.value.Name,
      LocationName: !this.FormFilter.get('LocationId')?.value
        ? ''
        : this.FormFilter.get('LocationId')?.value.Name,
      StatusId: this.FormFilter.get('StatusId')?.value?.code
        ? this.FormFilter.get('StatusId')?.value?.code
        : '',
      StatusName: !this.FormFilter.get('StatusId')?.value
        ? ''
        : this.FormFilter.get('StatusId')?.value.name,
    });
  }
  onCancel() {
    this.cancel.emit();
  }
}
