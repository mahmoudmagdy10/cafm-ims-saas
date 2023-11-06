import { DatePipe } from '@angular/common';
import { assetsScreenService } from 'src/app/pages/assetsScreen/assetsScreen.service';
import { tap } from 'rxjs/operators';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'app-filter-Problems',
  templateUrl: './filter-Problems.component.html',
  styleUrls: ['./filter-Problems.component.scss'],
  providers: [DatePipe],
})
export class FilterProblemsComponent implements OnInit {
  listFieldsFilter: any[] = [];
  formFilter: UntypedFormGroup;
  codes$: Observable<any>;
  AssetSelected: any;
  lablesFilter: any;
  codes: any;
  constructor(
    public dialogRef: MatDialogRef<FilterProblemsComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: assetsScreenService,
    private _viewDataFilterService: ViewDataFilterService,
    private datePipe: DatePipe
  ) {
    this.formFilter = this.fb.group({
      // Category: [],
      ProbelmFronDate: [],
      ProbelmToDate: [],
      TaskName: [],
      TeamName: [],
      TaskNo: [],
    });
  }
  get formFilterValue() {
    return this.formFilter.value;
  }
  ngOnInit(): void {
    this.formFilter.patchValue(this.filter.filter);
    // this.codes$ = this.service.Codes$.pipe(
    //   tap((val) => {
    //     this.codes = val;
    //     console.log('val', val);
    //   })
    // );
  }
  onFilter() {
    this.service.getProblemIdentification(this.formFilter.value);
    this.dialogRef.close(this.formFilter.value);
  }
  Close() {
    this.dialogRef.close();
  }
  Filter() {
    this.lablesFilter = [];
    // if (this.formFilterValue.Category) {
    //   this.lablesFilter.push({
    //     label: 'Category',
    //     value: this.formFilterValue.Category,
    //   });
    // }
    if (this.formFilterValue.ProbelmFronDate) {
      this.lablesFilter.push({
        label: 'ASSETS.ASSETCARDMODAL.PROBLEMIDENTIFICATION.Probelm_From_Date',
        value: this.datePipe.transform(
          this.formFilterValue.ProbelmFronDate,
          'yyyy-MM-dd'
        ),
      });
    }
    if (this.formFilterValue.ProbelmToDate) {
      this.lablesFilter.push({
        label: 'ASSETS.ASSETCARDMODAL.PROBLEMIDENTIFICATION.Probelm_TO_Date',
        value: this.datePipe.transform(
          this.formFilterValue.ProbelmToDate,
          'yyyy-MM-dd'
        ),
      });
    }
    if (this.formFilterValue.TaskName) {
      this.lablesFilter.push({
        label: 'ASSETS.ASSETCARDMODAL.PROBLEMIDENTIFICATION.TASK_NAME',
        value: this.formFilterValue.TaskName,
      });
    }
    if (this.formFilterValue.TeamName) {
      this.lablesFilter.push({
        label: 'ASSETS.ASSETCARDMODAL.PROBLEMIDENTIFICATION.TEAM_NAME',
        value: this.formFilterValue.TeamName,
      });
    }
    if (this.formFilterValue.TaskNo) {
      this.lablesFilter.push({
        label: 'ASSETS.ASSETCARDMODAL.PROBLEMIDENTIFICATION.TASK_NO',
        value: this.formFilterValue.TaskNo,
      });
    }
    this._viewDataFilterService.setDataFilter('ProblemIdentification', {
      forview: this.lablesFilter,
      params: {
        AssetSelected: this.AssetSelected,
        ...this.formFilter.value,
      },
    });

    this.service.getProblemIdentification(this.filter?.Data?.ID);
    this.dialogRef.close();
  }
}
