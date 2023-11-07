import { switchMap, tap } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WorkOrderPartsTransactionService } from '../work-order-parts-transaction.service';
import { CommonService } from 'src/app/modules/auth/services/common.service';

@Component({
  selector: 'app-copy-setting',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterTransactionComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;
  Codes: any;
  AssetSelected: any;
  SearchOfParts$!: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<FilterTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private service: WorkOrderPartsTransactionService,
    private commanService: CommonService
  ) {
    this.FormFilter = this.fb.group({
      SearchText: [''],
      // Date:['']
    });
  }

  ngOnInit(): void {
    this.FormFilter.patchValue(this.data.filters);
    this.SearchOfParts$ = this.FormFilter.get('SearchText')!.valueChanges.pipe(
      switchMap((value: string) => {
        return value ? this.commanService.search('Parts', value) : of([]);
      })
    );
  }
  onSearch() {
    this.dialogRef.close(this.FormFilter.value);
  }
  // Filter() {
  //   this.lablesFilter = [];
  //   if (this.FormFilter.value.SearchText) {
  //     this.lablesFilter.push({
  //       label: 'Name',
  //       value: this.FormFilter.value.Name,
  //     });
  //   }
  //   if (this.FormFilter.value.Date) {
  //     this.lablesFilter.push({
  //       label: 'Number',
  //       value: this.FormFilter.value.Number,
  //     });
  //   }
  //   this.service.getWorkOrderPartsTransaction();
  //   this.dialogRef.close();
  // }
  get FormValue() {
    return this.FormFilter.value;
  }
  lablesFilter: any[] = [];

  Close() {
    this.dialogRef.close();
  }
}
