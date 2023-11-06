import { Observable, observable } from 'rxjs';
import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ppmTasksService } from '../../ppm-tasks.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Weekly-print-ppm-task',
  templateUrl: './Weekly-print-ppm-task.component.html',
  styleUrls: ['./Weekly-print-ppm-task.component.scss'],
})
export class WeeklyPrintPpmTaskComponent implements OnInit {
  printWeekly!: UntypedFormGroup;
  loadingPrint: boolean = false;
  loadingTransferPrint: boolean = false;
  Codes$!: Observable<any>;
  Codes: any;
  totalcount: number;
  isShedule$: Observable<any>;

  @ViewChild('confirmdeleteTransfer')
  confirmdeleteTransfer: confirmDeleteComponent;
  constructor(
    public dialogRef: MatDialogRef<WeeklyPrintPpmTaskComponent>,
    private translateService: TranslateService,
    private _ppmTasksService: ppmTasksService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.printWeekly = this.fb.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      TaskStatusId: [null],
    });
  }

  ngOnInit() {
    this.Codes$ = this._ppmTasksService.Codes$
      .pipe
      // map((value) => {
      //   return {
      //     ...value,
      //     TaskTypeId: value.TaskTypeId.map((value: any) => {
      //       if (value.Code == 134) {
      //         return { ...value, disabled: true };
      //       } else {
      //         return value;
      //       }
      //     }),
      //   };
      // })
      ();
    this.isShedule$ = this._ppmTasksService.isShedule$;
  }
  Close() {
    this.dialogRef.close();
  }
  Print() {
    this.loadingPrint = true;
    this._ppmTasksService.printWeekly(this.printWeekly.value).subscribe(
      (val: any) => {
        if (val.rv > 0) {
          this.loadingPrint = false;

          // this.toastr.success(val.Msg);
        } else {
          this.loadingPrint = false;

          // this.toastr.error(val.Msg);
        }
      },
      (err: any) => {
        this.loadingPrint = false;
      }
    );
  }
  confirmTransfer() {
    this.confirmdeleteTransfer.openModal();
  }
  TransferMessg: boolean = true;
  Transfer() {
    const startDate = new Date(this.printWeekly.value.FromDate);
    const endDate = new Date(this.printWeekly.value.ToDate);
    const oneWeekLater = new Date(
      startDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    if (endDate.getTime() > oneWeekLater.getTime()) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'أقصى فترة مسموح بها للترحيل هي اسبوعية او اقل'
          : 'Maximum allowable period to convert PPM into Work Orders is One Week.'
      );
      return;
    }

    this.loadingTransferPrint = true;
    let totalCount = 1;
    const subscription = this._ppmTasksService
      .Transfer(this.printWeekly.value)
      .subscribe((result: any) => {
        if (result) {
          totalCount = result.TotalCount;
          if (totalCount === 0) {
            this.loadingTransferPrint = false;
            this.toastr.success(
              document.dir == 'rtl'
                ? `تم الترحيل بنجاح.  total remain record: ${result.TotalCount}`
                : `Transfered successfully.  total remain record: ${result.TotalCount}`
            );
          } else {
            if (this.TransferMessg) {
              this.toastr.error(
                document.dir == 'rtl'
                  ? `ما زالت عملية الترحيل قائمة.  total remain record: ${result.TotalCount}`
                  : `The deportation process is ongoing.  total remain record: ${result.TotalCount}`
              );
              this.TransferMessg = false;
            }
            this.loadingTransferPrint = true;
            this.Transfer();
          }
        }
      });
    (err: any) => {
      this.loadingTransferPrint = false;
    };
  }
  changeDate() {
    this.printWeekly
      .get('ToDate')
      ?.setValue(this.printWeekly.get('FromDate')!.value);
  }
}
