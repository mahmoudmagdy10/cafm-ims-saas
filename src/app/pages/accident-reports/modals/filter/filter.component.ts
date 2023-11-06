import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AccidentReportsService } from '../../accident-reports.service';

@Component({
  selector: 'app-copy-setting',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterIncidentReportComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<FilterIncidentReportComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private service: AccidentReportsService
  ) {
    this.FormFilter = this.fb.group({
      InternalNumber: [''],
      Title: [''],
      CategoryId: [''],
      IncidentDateFrom: [''],
      IncidentDateTo: [''],
    });
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;

    this.Codes$ = this.service.getCodeObz$();
    this.FormFilter.patchValue(this.data.filters);
  }
  onSearch() {
    this.service.getIncidentReports(this.FormFilter.value);
    this.dialogRef.close(this.FormFilter.value);
  }
  Close() {
    this.dialogRef.close();
  }
}
