import { Component, Inject, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-filter-logs',
  templateUrl: './filter-logs.component.html',
  styleUrls: ['./filter-logs.component.scss']
})
export class FilterLogsComponent implements OnInit, OnChanges {

  @Output() afterSearch: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() handleClickFilter: EventEmitter<any> = new EventEmitter();
  @Input() userId: number;
  @Input() showLabelsFilter: boolean;
  pageDirection: string;

  FormFilter = new UntypedFormGroup({
    Name: new UntypedFormControl(''),
    // LocationId: new FormControl(),
  });
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {

  }
  ngOnChanges(): void {
    if(!this.showLabelsFilter){
      this.FormFilter.reset();
    }
  }

  onSearch(){
    this.usersService.getUserLogs(this.userId, this.FormFilter.get('Name')?.value).subscribe((res: any)=> {
      this.handleClickFilter.emit({ filterData: this.FormFilter.value, dataLogs: res?.Data})
      this.onCancel();
  });
  }
  onCancel(){
    this.cancel.emit(true);
  }
}
