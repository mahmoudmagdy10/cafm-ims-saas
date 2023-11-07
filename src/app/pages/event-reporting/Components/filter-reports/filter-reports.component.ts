import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventReportingService } from '../../event-reporting.service';
import { MaintenanceRequestService } from 'src/app/public/maintenance-request/maintenance-request.service';
import { TagsmanagementModalService } from 'src/app/pages/settings/configurations/modals/tagsmanagementModal/tagsmanagement-modal.service';

@Component({
  selector: 'app-filter-reports',
  templateUrl: './filter-reports.component.html',
  styleUrls: ['./filter-reports.component.scss']
})
export class FilterReportsComponent implements OnInit {
  @Output() filterData: EventEmitter<any> = new EventEmitter<any>();
  @Input() isClearFilter: boolean = false;
  constructor(
    private eventReportingService: EventReportingService,
    private maintenanceRequestService: MaintenanceRequestService,
    private tagsmanagementService: TagsmanagementModalService,
    ) { }
    FormFilter = new UntypedFormGroup({
      RequesterName: new UntypedFormControl(''),
      RequesterEmail: new UntypedFormControl(''),
      Priority: new UntypedFormControl(''),
      dept: new UntypedFormControl(''),
    });
    priorityOptions: any[] = [];
    tagsDropdownOptions: any[] = [];

  ngOnInit(): void {
    this.maintenanceRequestService.getCodeWorkRequest(localStorage.getItem('defaultLocation')).subscribe((res: any)=> {
      this.priorityOptions = [{ code: null, Name: 'Select' } , ...res.PriorityId];
      this.tagsDropdownOptions = [{ code: null, Name: 'Select' }, ...res.TagsId];
    });
    if(this.isClearFilter){
      this.clearFilter();
    }
  }

  Close() {
    // this.dialogRef.close(this.FormFilter.value);
  }

  handleFilterReport(){
    this.eventReportingService.getEventReporting(this.FormFilter.value);
    this.filterData.emit(this.FormFilter.value);
  }

  clearFilter() {
    this.FormFilter.get('RequesterName')?.setValue('');
    this.FormFilter.get('RequesterEmail')?.setValue('');
    this.FormFilter.get('Priority')?.setValue(null);
    this.FormFilter.get('dept')?.setValue(null);
  }

}
