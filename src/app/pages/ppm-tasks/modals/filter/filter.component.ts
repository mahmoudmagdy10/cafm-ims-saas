import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { DatePipe } from '@angular/common';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'app-copy-setting-ppm-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [DatePipe],
})
export class FilterComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;
  Codes: any;
  AssetSelected: any;
  isShedule: any;
  foundItem: any;
  ScheduleType: { code: number; Name: string }[] = [];
  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private service: ppmTasksService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private translateService: TranslateService
  ) {
    this.FormFilter = this.fb.group({
      // UserID: [''],
      // AssignmentUserId: [''],
      AssignmentName: [''],
      // LocationId: [''],
      TaskName: [''],
      PriorityId: [''],
      // TaskStatusId: [''],
      TaskTypeId: [''],
      FromDate: [''],
      ToDate: [''],
      FromMaintenanceDuration: [''],
      ToMaintenanceDuration: [''],
      FromDamageDuration: [''],
      ToDamageDuration: [''],
      TaskNumber: [''],
      CreatedByName: [''],
      AssetId: [''],
      AssignmentTeamId: [null],
      FromDueDate: [''],
      ToDueDate: [''],
      ShowLate: [null],
      ShowInTime: [null],
      CompletionDateFrom: [null],
      CompletionDateTo: [null],
      ScheduleTypeId: [null],
    });
    this.ScheduleType = [
      { code: 0, Name: this.translateService.instant('DAILY') },
      { code: 1, Name: this.translateService.instant('WEEKLY') },
      { code: 2, Name: this.translateService.instant('MONTHLY') },
      { code: 3, Name: this.translateService.instant('QUARTERLY') },
      { code: 4, Name: this.translateService.instant('HALF_YEARLY') },
      { code: 5, Name: this.translateService.instant('YEARLY') },
    ];
  }

  ngOnInit(): void {
    this.isShedule = this.service.isShedule.value;
    this.FormFilter.patchValue(this.data.filters);
    this.Codes$ = this.service.Codes$.pipe(
      tap((value) => {
        this.Codes = value;
      })
    );

    // this.FormFilter.get('FromDate')?.patchValue(this.service.FromDate);
    // this.FormFilter.get('ToDate')?.patchValue(this.service.ToDate);
  }
  onSearch() {
    if (this.FormFilter.controls['ShowLate'].value == 0) {
      this.FormFilter.controls['ShowLate'].setValue('');
      this.FormFilter.controls['ShowInTime'].setValue('');
    }
    if (this.FormFilter.controls['ShowLate'].value == 1) {
      this.FormFilter.controls['ShowInTime'].setValue('');
      this.FormFilter.controls['ShowLate'].setValue('true');
    }
    if (this.FormFilter.controls['ShowLate'].value == 2) {
      this.FormFilter.controls['ShowLate'].setValue('');
      this.FormFilter.controls['ShowInTime'].setValue('true');
    }
    this.lableFilter();
    this.dialogRef.close({
      ...this.FormFilter.value,
      ScheduleType: this.foundItem?.Name,
    });
  }
  get FormValue() {
    return this.FormFilter.value;
  }
  lablesFilter: any[] = [];
  lableFilter() {
    if (this.FormValue.AssignmentName) {
      this.lablesFilter.push({
        label: 'Assigned_To',
        value: this.Codes.LocationUsers.find(
          (value: any) => value.Code == this.FormValue.AssignmentName
        ).Name,
      });
    }
    if (this.FormValue.TaskName) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_NAME',
        value: this.FormValue.TaskName,
      });
    }
    if (this.FormValue.PriorityId) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.PRIORITY_LEVEL',
        value: this.Codes.PriorityId.find(
          (value: any) => value.code == this.FormValue.PriorityId
        ).Name,
      });
    }
    if (this.FormValue.TaskStatusId) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_STATUS',
        value: this.Codes.TaskStatusId.find(
          (value: any) => value.Code == this.FormValue.TaskStatusId
        ).Name,
      });
    }
    if (this.FormValue.TaskTypeId) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_TYPE',
        value: this.Codes.TaskTypeId.find(
          (value: any) => value.Code == this.FormValue.TaskTypeId
        ).Name,
      });
    }
    if (this.FormValue.FromDate) {
      this.lablesFilter.push({
        label: 'DATE_FROM_SCHEDULNG',
        value: this.datePipe.transform(this.FormValue.FromDate, 'yyyy-MM-dd'),
      });
    }
    if (this.FormValue.ToDate) {
      this.lablesFilter.push({
        label: 'DATE_TO_SCHEDULNG',
        value: this.datePipe.transform(this.FormValue.ToDate, 'yyyy-MM-dd'),
      });
    }
    if (
      this.FormValue.ScheduleTypeId !== null &&
      this.FormValue.ScheduleTypeId !== undefined
    ) {
      // Find the corresponding Name based on the code in ScheduleType
      this.foundItem = this.ScheduleType.find(
        (item: any) => item.code === this.FormValue.ScheduleTypeId
      );

      if (this.foundItem) {
        // Push the label and value into the labelsFilter array
        this.lablesFilter.push({
          label: 'Schedule Type',
          value: this.foundItem.Name,
        });
      }
    }
    // if (this.FormValue.FromMaintenanceDuration) {
    //   this.lablesFilter.push({
    //     label:
    //       'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.MAINTENANCE_DURATION_DATE_FROM',
    //     value: this.FormValue.FromMaintenanceDuration,
    //   });
    // }
    // if (this.FormValue.ToMaintenanceDuration) {
    //   this.lablesFilter.push({
    //     label:
    //       'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.MAINTENANCE_DURATION_DATE_TO',
    //     value: this.FormValue.ToMaintenanceDuration,
    //   });
    // }
    // if (this.FormValue.FromDamageDuration) {
    //   this.lablesFilter.push({
    //     label:
    //       'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.BROKEN_DURATION_DATE_FROM',
    //     value: this.FormValue.FromDamageDuration,
    //   });
    // }
    // if (this.FormValue.ToDamageDuration) {
    //   this.lablesFilter.push({
    //     label:
    //       'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.BROKEN_DURATION_DATE_TO',
    //     value: this.FormValue.ToDamageDuration,
    //   });
    // }
    if (this.FormValue.TaskNumber) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_NUMBER',
        value: this.FormValue.TaskNumber,
      });
    }
    if (this.FormValue.CreatedByName) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.CREATED_BY',
        value: this.FormValue.CreatedByName,
      });
    }
    if (this.FormValue.AssetId) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.ADD_MODAL.ASSET',
        value: this.AssetSelected,
      });
    }
    if (this.FormValue.AssignmentTeamId) {
      this.lablesFilter.push({
        label: 'PM.MODAL.FILTER.WORK_TEAM',
        value: this.Codes.LocationTeams.find(
          (value: any) => value.Code == this.FormValue.AssignmentTeamId
        ).Name,
      });
    }
    if (this.FormValue.CompletionDateFrom) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.COMPLETION_DATE_FROM',
        value: this.datePipe.transform(
          this.FormValue.CompletionDateFrom,
          'yyyy-MM-dd'
        ),
      });
    }
    if (this.FormValue.CompletionDateTo) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.COMPLETION_DATE_TO',
        value: this.datePipe.transform(
          this.FormValue.CompletionDateTo,
          'yyyy-MM-dd'
        ),
      });
    }
    if (this.FormValue.FromDueDate) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.DUE_TO_DATE_FROM',
        value: this.datePipe.transform(
          this.FormValue.FromDueDate,
          'yyyy-MM-dd'
        ),
      });
    }
    if (this.FormValue.ToDueDate) {
      this.lablesFilter.push({
        label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.DUE_TO_DATE_TO',
        value: this.datePipe.transform(this.FormValue.ToDueDate, 'yyyy-MM-dd'),
      });
    }
    if (this.FormValue.FromMaintenanceDuration) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.MAINTENANCE_DURATION_DATE_FROM',
        value: this.FormValue.FromMaintenanceDuration,
      });
    }
    if (this.FormValue.ToMaintenanceDuration) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.MAINTENANCE_DURATION_DATE_TO',
        value: this.FormValue.ToMaintenanceDuration,
      });
    }
    if (this.FormValue.FromDamageDuration) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.BROKEN_DURATION_DATE_FROM',
        value: this.FormValue.FromDamageDuration,
      });
    }
    if (this.FormValue.ToDamageDuration) {
      this.lablesFilter.push({
        label:
          'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.BROKEN_DURATION_DATE_TO',
        value: this.FormValue.ToDamageDuration,
      });
    }
    this.service.filterSub.next(this.lablesFilter);
  }
  opentree(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.FormFilter.get('AssetId')?.setValue(result.ID);
      }
    });
  }
  get isCompleted() {
    return this.service.workOrderCompleted;
  }

  Close() {
    this.dialogRef.close();
  }
}
