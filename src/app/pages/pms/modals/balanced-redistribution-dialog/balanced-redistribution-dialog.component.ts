import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PmsService } from '../../pms.service';

@Component({
  selector: 'app-balanced-redistribution-dialog',
  templateUrl: './balanced-redistribution-dialog.component.html',
  styleUrls: ['./balanced-redistribution-dialog.component.scss'],
})
export class BalancedRedistributionDialogComponent implements OnInit {
  form: UntypedFormGroup;
  Muints: any = [];
  Hours: any = [];
  itemsCheckedTeams: any[];
  itemsCheckedUsers: any[];
  AssetSelected: any;
  codes$: Observable<any>;
  startDate = new Date();
  constructor(
    public dialogRef: MatDialogRef<BalancedRedistributionDialogComponent>,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private service: PmsService,
    private TranslateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      TagsIds: [null],
      startDate: [],
      endDate: [],
    });
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.codes$ = this.service.CodeObz$;
    let FromDate = this.service.FromDate;
    let ToDate = this.service.ToDate;
    this.form.patchValue({ startDate: new Date(), endDate: ToDate });
  }
  Close() {
    this.dialogRef.close();
  }
  BalancedRedistribution() {
    this.service
      .BalancedRedistribution({
        ...this.form.value,
        TagsIds: this.form?.get('TagsIds')?.value?.code,
      })
      .subscribe((val: any) => {
        if (val.rv > 0) {
          this.Close();
        }
      });
  }
}
