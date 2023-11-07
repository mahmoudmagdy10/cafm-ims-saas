import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NewDashboardService } from './../new-dashboard.service';
import { CommonService } from './../../../modules/auth/services/common.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Component({
  selector: 'app-filter-dashboard',
  templateUrl: './filter-dashboard.component.html',
  styleUrls: ['./filter-dashboard.component.scss'],
})
export class FilterDashboardComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;
  Codes: any;
  AssetSelected: any;
  SearchOfParts$!: Observable<any>;
  lablesFilter: any = [
    {
      label: 'DATE_FROM',
      value: moment(this.FormValue?.FromDate).format('YYYY-MM-DD'),
    },
    {
      label: 'DATE_TO',
      value: moment(this.FormValue?.ToDate).format('YYYY-MM-DD'),
    },
  ];
  chartType: any;
  rangeDates: any = [new Date(), new Date()];
  chartTypes = [
    { label: 'Line Chart', value: 'line' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Bar Chart', value: 'bar' },
  ];
  selectedLastDay: boolean;
  LastDays: { code: string; Name: string }[]=[];
 

  selectedChartType: any;
  submitted: boolean = false;
  dataDashboard$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<FilterDashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private _viewDataFilterService: ViewDataFilterService,
    private _newDashboardService: NewDashboardService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    this.FormFilter = this.fb.group({
      FromDate: [tomorrow, Validators.required],
      ToDate: [today, Validators.required],
      LastDaysID: ['Last7days'], // default radio button if you want
    });
    this.LastDays = [
      {
        code: 'Last24hours',
        Name: this.translateService.instant('LAST_24_HOURS'),
      },
      { code: 'Last7days', Name: this.translateService.instant('LAST_7_DAYS') },
      { code: 'Last15days', Name: this.translateService.instant('LAST_15_DAYS') },
      { code: 'Last30days', Name: this.translateService.instant('LAST_30_DAYS') },
  
      {
        code: 'Last3months',
        Name: this.translateService.instant('LAST_3_MONTHS'),
      },
      {
        code: 'Last6months',
        Name: this.translateService.instant('LAST_6_MONTHS'),
      },
      {
        code: 'Last12months',
        Name: this.translateService.instant('LAST_12_MONTHS'),
      },
      { code: 'custom', Name: this.translateService.instant('OTHER') },
    ];
  }
  get FormValue() {
    return this.FormFilter?.value;
  }
  ngOnInit(): void {
    let filter =
      this._viewDataFilterService.datafilterModel['dashboard'].dataFilter
        ?.params;
    this.FormFilter.patchValue(filter);
  }
  onFilter() {
    this.lablesFilter = [];
    if (this.FormValue.FromDate) {
      this.lablesFilter.push({
        label: 'DATE_FROM',
        value: moment(this.FormValue?.FromDate).format('YYYY-MM-DD'),
      });
    }
    if (this.FormValue.ToDate) {
      this.lablesFilter.push({
        label: 'DATE_TO',
        value: moment(this.FormValue?.ToDate).format('YYYY-MM-DD'),
      });
    }
    this._viewDataFilterService.setDataFilter('dashboard', {
      forview: this.lablesFilter,
      params: {
        ...this.FormFilter.value,
      },
    });
    this._newDashboardService.GetDashboard(this.FormFilter.value);
    // this.service.getAllPms();
    this.dialogRef.close();
  }
  // Filter() {
  //   this.submitted = true;
  //   if (this.FormFilter.valid) {
  //     this._newDashboardService.GetDashboard(this.FormFilter.value);
  //     this.dataDashboard$ = this._newDashboardService.dataDashboard$.pipe(
  //       tap((val) => {
  //         console.log('_newDashboardService', val);
  //       })
  //     );
  //     this.dialogRef.close();
  //   } else {
  //     this.toastr.error(
  //       document.dir == 'rtl'
  //         ? 'يرجى ادخال الحقول المطلوبة'
  //         : 'Enter All Field Required'
  //     );
  //   }
  // }
  onRadioChange(value: any) {
    const currentDate = new Date();
    let startDate = new Date();

    switch (value) {
      case 'Last30days':
        startDate.setDate(currentDate.getDate() - 30);
        break;
      case 'Last15days':
        startDate.setDate(currentDate.getDate() - 15);
        break;
      case 'Last7days':
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case 'Last24hours':
        startDate.setDate(currentDate.getDate() - 1);
        break;
      case 'Last3months':
        startDate.setDate(currentDate.getDate() - 90);
        break;
      case 'Last6months':
        startDate.setDate(currentDate.getDate() - 180);
        break;
      case 'Last12months':
        startDate.setDate(currentDate.getDate() - 365);
        break;
      case 'custom':
        // Handle custom dates with the fields
        break;
      default:
        console.warn('Unexpected value for LastDaysID:', value);
        break;
    }

    if (value !== 'custom') {
      this.FormFilter.get('FromDate')?.setValue(startDate);
      this.FormFilter.get('ToDate')?.setValue(currentDate);

      this.change();
    }
  }

  Close() {
    this.dialogRef.close();
  }
  ChartType(event: any) {
    this.chartType = event.value;
    this._newDashboardService.GetDashboard(this.FormFilter.value);
  }
  changeDate() {
    this.FormFilter.get('ToDate')?.setValue(
      this.FormFilter.get('FromDate')!.value
    );
  }
  change() {
    const fromDate = new Date(this.FormFilter.get('FromDate')?.value);
    const toDate = new Date(this.FormFilter.get('ToDate')?.value);
    this.rangeDates = [fromDate, toDate];

    this.cdRef.detectChanges();
  }
  onDateRangeSelect(event: any) {
    this.FormFilter.get('FromDate')?.setValue(this.rangeDates[0]);
    this.FormFilter.get('ToDate')?.setValue(this.rangeDates[1]);
  }
}
