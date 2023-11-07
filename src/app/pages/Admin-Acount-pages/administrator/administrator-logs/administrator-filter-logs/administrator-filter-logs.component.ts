import { administratorService } from './../../administrator.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-administrator-filter-logs',
  templateUrl: './administrator-filter-logs.component.html',
  styleUrls: ['./administrator-filter-logs.component.scss'],
})
export class AdministratorFilterLogsComponent implements OnInit {
  @Output() afterSearch: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() handleClickFilter: EventEmitter<any> = new EventEmitter();
  @Input() userId: number;
  @Input() showLabelsFilter: boolean;
  pageDirection: string;

  FormFilter = new UntypedFormGroup({
    Name: new UntypedFormControl(''),
    logdetails: new UntypedFormControl(''),
    // LocationId: new FormControl(),
  });
  constructor(private administratorService: administratorService) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    if (!this.showLabelsFilter) {
      this.FormFilter.reset();
    }
  }

  onSearch() {
    this.administratorService
      .getAdministratorLogs(this.userId, this.FormFilter.get('Name')?.value)
      .subscribe((res: any) => {
        this.handleClickFilter.emit({
          filterData: this.FormFilter.value,
          dataLogs: res?.Data,
        });
        this.onCancel();
      });
  }
  onCancel() {
    this.cancel.emit(true);
  }
}
