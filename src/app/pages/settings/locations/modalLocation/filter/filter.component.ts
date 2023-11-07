import { switchMap, tap } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonService } from 'src/app/modules/auth/services/common.service';
import { LocationService } from '../../locations.service';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Component({
  selector: 'app-copy-setting',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterLocationComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;
  Codes: any;
  AssetSelected: any;
  SearchOfParts$!: Observable<any>;
  lablesFilter: any;

  constructor(
    public dialogRef: MatDialogRef<FilterLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private service: LocationService,
    private commanService: CommonService,
    private _viewDataFilterService: ViewDataFilterService
  ) {
    this.FormFilter = this.fb.group({
      LocationName: [''],
    });
  }
  get FormValue() {
    return this.FormFilter.value;
  }
  ngOnInit(): void {
    this.FormFilter.patchValue(this.data.filters);
    this.SearchOfParts$ = this.FormFilter.get(
      'LocationName'
    )!.valueChanges.pipe(
      switchMap((value: string) => {
        return value ? this.commanService.search('Parts', value) : of([]);
      })
    );
  }
  // onSearch() {
  //   this.dialogRef.close(this.FormFilter.value);
  // }
  Filter() {
    this.lablesFilter = [];
    if (this.FormValue.LocationName) {
      this.lablesFilter.push({
        label: 'Location Name',
        value: this.FormValue.LocationName,
      });
    }
    this._viewDataFilterService.setDataFilter('locations', {
      forview: this.lablesFilter,
      params: {
        ...this.FormFilter.value,
      },
    });

    this.service.GetLocationAndSubLocation();
    this.dialogRef.close();
  }

  Close() {
    this.dialogRef.close();
  }
}
