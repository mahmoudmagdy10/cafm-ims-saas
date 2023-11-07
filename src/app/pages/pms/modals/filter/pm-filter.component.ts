import { TranslateService } from '@ngx-translate/core';
import { ViewDataFilterService } from './../../../../shared/components/view-data-filter/view-data-filter.service';
import { tap } from 'rxjs/operators';
import {
  UntypedFormGroup,
  FormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PmsService } from '../../pms.service';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import * as moment from 'moment';

@Component({
  selector: 'pm-filter',
  templateUrl: 'pm-filter.component.html',
})
export class PMFilter implements OnInit {
  formFilter: UntypedFormGroup;
  codes$: Observable<any>;
  AssetSelected: any;
  lablesFilter: any;
  Codes: any;
  foundItem: any;
  ScheduleType: { code: number; Name: string }[] = [];
  constructor(
    public dialogRef: MatDialogRef<PMFilter>,
    private fb: UntypedFormBuilder,
    private service: PmsService,
    public dialog: MatDialog,
    private _viewDataFilterService: ViewDataFilterService,
    private translateService: TranslateService
  ) {
    this.formFilter = this.fb.group({
      TaskName: [],
      PriorityId: [],
      TagsId: [],
      AssetId: [],
      AssignmentTeamId: [],
      AssignmentUserId: [],
      ToDate: [null],
      FromDate: [null],
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
    let filter =
      this._viewDataFilterService.datafilterModel['PPM'].dataFilter?.params;
    this.formFilter.patchValue(filter);
    if (filter.AssetSelected) {
      this.AssetSelected = filter.AssetSelected;
    }
    this.codes$ = this.service.CodeObz$.pipe(
      tap((Codes) => {
        this.Codes = Codes;
      })
    );
  }
  get FormValue() {
    return this.formFilter.value;
  }
  onFilter() {
    this.lablesFilter = [];
    if (this.FormValue.TaskName) {
      this.lablesFilter.push({
        label: 'PM.MODAL.ADD_PM_TASK.NAME',
        value: this.FormValue.TaskName,
      });
    }
    if (this.FormValue.PriorityId) {
      this.lablesFilter.push({
        label: 'PM.MODAL.ADD_PM_TASK.PRIORITY_LEVEL',
        value: this.Codes.PriorityId.find(
          (value: any) => value.code == this.FormValue.PriorityId
        ).Name,
      });
    }
    if (this.FormValue.TagsId) {
      this.lablesFilter.push({
        label: 'PM.MODAL.ADD_PM_TASK.TAGS',
        value: this.Codes.TagsId.find(
          (value: any) => value.code == this.FormValue.TagsId
        ).Name,
      });
    }
    if (this.FormValue.AssetId) {
      this.lablesFilter.push({
        label: 'PM.MODAL.FILTER.ASSET',
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
    if (this.FormValue.AssignmentUserId) {
      this.lablesFilter.push({
        label: 'PM.MODAL.FILTER.ASSIGNED_TO',
        value: this.Codes.LocationUsers.find(
          (value: any) => value.Code == this.FormValue.AssignmentUserId
        ).Name,
      });
    }

    if (this.FormValue.Fromdate) {
      this.lablesFilter.push({
        label: 'DATE_FROM_SCHEDULNG',
        value: moment(this.FormValue.Fromdate).format('YYYY-MM-DD'),
      });
    }
    if (this.FormValue.Todate) {
      this.lablesFilter.push({
        label: 'DATE_TO_SCHEDULNG',
        value: moment(this.FormValue.Todate).format('YYYY-MM-DD'),
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
    this._viewDataFilterService.setDataFilter('PPM', {
      forview: this.lablesFilter,
      params: {
        ScheduleType: this.foundItem?.Name,
        AssetSelected: this.AssetSelected,
        ...this.formFilter.value,
      },
    });

    // this.service.getAllPms();
    this.dialogRef.close();
  }
  chooseAsset(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: {
        data: Assets,
        AssetInfo: { ID: this.formFilter.controls['AssetId'].value },
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.formFilter.controls['AssetId'].setValue(result.ID);
      }
    });
  }
  Close() {
    this.dialogRef.close();
  }
}
