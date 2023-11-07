import { MatSelectModule } from '@angular/material/select';
import { TreeAssetsComponent } from './../../../shared/components/Tree/tree-assets/tree-assets.component';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { assetsScreenService } from '../assetsScreen.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { tap } from 'rxjs/operators';
import { TreeAssetsLocationComponent } from 'src/app/shared/components/Tree/tree-assets copy/tree-assets.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-assets',
  templateUrl: './filter-assets.component.html',
})
export class FilterAssetsComponent implements OnInit, OnDestroy {
  CodesAssetTree$: Observable<any>;
  fields: any[] = [];
  listFieldsFilter: any[] = [];
  CodesAsste: any;
  form = new UntypedFormGroup({
    FieldControl: new UntypedFormControl(),
    AssetName: new UntypedFormControl(),
    AssetType: new UntypedFormControl(),
    AssetSubLocation: new UntypedFormControl(),
    SubAssetId: new UntypedFormControl(),
    isUnssignAssetId: new UntypedFormControl(),
    SubAsseSelected: new UntypedFormControl(),
  });
  pageDirection: string;
  AssetSelectedIDS: any;
  unSubscripe: Subscription;
  codes$: Observable<any>;
  lablesFilter: any;
  AssetSelected: any;
  Codes: any;
  isUnssignAssetId:{ code: number; Name: string }[]=[];
  constructor(
    public dialogRef: MatDialogRef<FilterAssetsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public assetsService: assetsScreenService,
    private toster: ToastrService,
    public fieldManagmentService: FieldManagmentService,
    private _viewDataFilterService: ViewDataFilterService,
    public dialog: MatDialog,
    private TranslateService: TranslateService
  ) {
    this.isUnssignAssetId = [
      {
        code: 0,
        Name: this.TranslateService.instant('ASSETS_ASSOCIATED_WITH_PM'),
      },
      {
        code: 1,
        Name: this.TranslateService.instant('ASSETS_NOT_ASSOCIATED_WITH_PM'),
      },
    ];
  }

  ngOnInit(): void {
    this.codes$ = this.assetsService.codes$.pipe(
      tap((val) => {
        this.Codes = val;
      })
    );
    this.pageDirection = document.dir;

    this.unSubscripe = this.fieldManagmentService.DataFeild$.subscribe(
      (value) => {
        this.fields = value.map((res: any, index: any) => {
          return {
            fieldId: res.ID,
            FieldTypeId: res.FieldTypeId,
            Name: res.Name,
            FieldsOptions: res.FieldsOptions
              ? res.FieldsOptions.map((value: any) => {
                  return {
                    Code: value.ID,
                    Name: value.OptionName,
                  };
                })
              : null,
            fromValue: '',
            toValue: '',
          };
        });
      }
    );

    if (this.data?.filters) {
      this.form.patchValue(this.data?.filters);
      if (this.data?.filters.SubAssetId) {
        this.AssetSelected = this.form.get('SubAsseSelected')?.value;
      }
      if (this.data?.filters.Filter) {
        // Check if 'Filter' is defined
        try {
          const Filter = JSON.parse(this.data?.filters.Filter);

          if (Array.isArray(Filter)) {
            Filter.forEach((element: any) => {
              this.AddFieldFilter(element.FieldId, {
                fromValue: element.fromValue,
                toValue: element.toValue,
              });
            });
          } else {
            console.error('Invalid JSON format for Filter');
          }
        } catch (error) {
          console.error('Error parsing Filter JSON:', error);
        }
      } else {
        console.error('Filter is not defined in this.data.filters');
      }
    }

    this.assetsService.CodesAssetTree();
    this.CodesAssetTree$ = this.assetsService.codesAssetTree$.pipe(
      tap((val) => {
        this.CodesAsste = val;
      })
    );
  }
  AddFieldFilter(fieldId: any, valueField?: any) {
    if (fieldId) {
      this.fields.forEach((value: any, index: any) => {
        if (fieldId == value.fieldId) {
          this.listFieldsFilter.push({ ...value, ...valueField });
          this.fields.splice(index, 1);
        }
      });
      this.clearFieldControl();
    } else {
      this.toster.error('please choose field ');
    }
  }
  deleteFieldFilter(item: any) {
    this.fields.push(item);
    this.listFieldsFilter.forEach((value: any, index: any) => {
      if (item.fieldId == value.fieldId) {
        this.listFieldsFilter.splice(index, 1);
      }
    });
  }
  ngOnDestroy(): void {
    this.unSubscripe.unsubscribe();
    this.data.code?.Categories.splice(0, 1);
  }
  clearFieldControl() {
    this.form.get('FieldControl')?.setValue(null);
  }
  findTypeToField(item: any) {
    const TypeToField = [2, 3, 4];
    return TypeToField.find((value: any) => value == item);
  }
  SaveValueField(idField: any, newValue: any, isTo?: boolean) {
    this.listFieldsFilter.forEach((item) => {
      if (item.fieldId == idField) {
        if (isTo) {
          item.toValue = newValue;
        } else {
          item.fromValue = newValue;
        }
      }
    });
  }
  // onFilter() {
  //   this.lablesFilter = [];
  //   if (this.form.get('AssetName')?.value) {
  //     this.lablesFilter.push({
  //       label: 'AssetName',
  //       value: this.form.get('AssetName'),
  //     });
  //   }
  //   // if (this.FormValue.PriorityId) {
  //   //   this.lablesFilter.push({
  //   //     label: 'PM.MODAL.ADD_PM_TASK.PRIORITY_LEVEL',
  //   //     value: this.Codes.PriorityId.find(
  //   //       (value: any) => value.code == this.FormValue.PriorityId
  //   //     ).Name,
  //   //   });
  //   // }
  //   // if (this.FormValue.TagsId) {
  //   //   this.lablesFilter.push({
  //   //     label: 'PM.MODAL.ADD_PM_TASK.TAGS',
  //   //     value: this.Codes.TagsId.find(
  //   //       (value: any) => value.code == this.FormValue.TagsId
  //   //     ).Name,
  //   //   });
  //   // }
  //   // if (this.FormValue.AssetId) {
  //   //   this.lablesFilter.push({
  //   //     label: 'PM.MODAL.FILTER.ASSET',
  //   //     value: this.AssetSelected,
  //   //   });
  //   //   console.log('value', this.Codes);
  //   // }
  //   // if (this.FormValue.AssignmentTeamId) {
  //   //   this.lablesFilter.push({
  //   //     label: 'PM.MODAL.FILTER.WORK_TEAM',
  //   //     value: this.Codes.LocationTeams.find(
  //   //       (value: any) => value.Code == this.FormValue.AssignmentTeamId
  //   //     ).Name,
  //   //   });
  //   // }
  //   // if (this.FormValue.AssignmentUserId) {
  //   //   this.lablesFilter.push({
  //   //     label: 'PM.MODAL.FILTER.ASSIGNED_TO',
  //   //     value: this.Codes.LocationUsers.find(
  //   //       (value: any) => value.Code == this.FormValue.AssignmentUserId
  //   //     ).Name,
  //   //   });
  //   // }
  //   this._viewDataFilterService.setDataFilter('Asset', {
  //     forview: this.lablesFilter,
  //     params: {
  //       AssetSelected: this.AssetSelected,
  //       ...this.form.value,
  //     },
  //   });

  //   const Filter = {
  //     ...this.form.value,
  //     FieldControl: null,
  //   };
  //   this.dialogRef.close(Filter);
  //   this.assetsService.getAssets(Filter);
  // }
  onSearch() {
    this.lablesFilter = [];
    if (this.form.get('AssetName')?.value) {
      this.lablesFilter.push({
        label: 'Asset Name',
        value: this.form.get('AssetName')?.value,
      });
    }
    // if (this.form.get('SubAssetId')?.value) {
    //   this.lablesFilter.push({
    //     label: 'PM.MODAL.FILTER.ASSET',
    //     value: this.AssetSelected,
    //   });
    //   console.log('value', this.Codes);
    // }
    if (this.form.get('SubAssetId')?.value) {
      this.lablesFilter.push({
        label: 'Asset Sub-Location',
        value: this.AssetSelected,
      });
    }
    if (this.form.get('AssetType')?.value) {
      this.lablesFilter.push({
        label: 'Category Name',
        value: this.Codes.Categories.find(
          (value: any) => value.code == this.form.get('AssetType')?.value
        )?.name,
      });
    }
    const selectedCode = this.form.get('isUnssignAssetId')?.value;

    if (selectedCode !== null) {
      const selectedOption = this.isUnssignAssetId.find(
        (value: any) => value.code === selectedCode
      );

      if (selectedOption) {
        this.lablesFilter.push({
          label: 'THE_ASSOCIATION_OF_ASSETS_WITH_PM',
          value: selectedOption.Name,
        });
      }
    }
    const Fields = JSON.stringify(
      this.listFieldsFilter.map((value) => {
        return {
          FieldId: value.fieldId,
          fromValue: value.fromValue,
          toValue: value.toValue || value.fromValue,
        };
      })
    );
    const Filter = {
      ...this.form.value,
      FieldControl: null,
      Filter: Fields == '[]' ? null : Fields,
      // CurrentPage: this.assetsService.selectedPage,
      // AssetSelected: this.AssetSelected,
    };
    this._viewDataFilterService.setDataFilter('Asset', {
      forview: this.lablesFilter,
      params: Filter,
    });
    this.dialogRef.close(Filter);
  }
  Close() {
    this.dialogRef.close();
  }
  chooseAsset(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsLocationComponent, {
      width: '50vw',
      data: {
        data: Assets,
        AssetInfo: { ID: this.form.controls['SubAssetId']?.value },
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        let Asset = result.map((asset: any) => asset.ID);
        this.AssetSelected = result
          .map((asset: any) => asset.AssetName)
          .join(', '); // قم بدمج أسماء الأصول بفاصلة إذا كان هناك أكثر من أصل مختار
        this.form.controls['SubAssetId']?.setValue(Asset);
        this.form.controls['SubAsseSelected']?.setValue(this.AssetSelected);
      }
    });
  }
}
