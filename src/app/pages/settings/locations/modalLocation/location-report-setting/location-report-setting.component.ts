import { environment } from 'src/environments/environment';
import { LocationService } from './../../locations.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ImageCutComponent } from 'src/app/shared/components/image-cut/image-cut.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-location-report-setting',
  templateUrl: './location-report-setting.component.html',
  styleUrls: ['./location-report-setting.component.scss'],
})
export class LocationReportSettingComponent implements OnInit {
  LocationReportSetting: UntypedFormGroup;
  logoForReport: any;
  Avatar = environment.Avatar;
  CodeLocation$: Observable<any>;
  codes: any;
  constructor(
    public dialogRef: MatDialogRef<LocationReportSettingComponent>,
    private toastr: ToastrService,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public locationId: any,
    private _locationService: LocationService
  ) {
    this.LocationReportSetting = this.fb.group({
      ID: [null],
      LocationTitle: [],
      FooterText: [],
      showTitleinReport: [],
      showfooterInReport: [],
    });
  }
  LogoFile: any;
  FilePath: any;

  ngOnInit(): void {
    this._locationService
      .getLocationForSettingReport(this.locationId)
      .subscribe((value) => {
        this.LocationReportSetting.patchValue(value);
        this.LogoFile = value?.LogoFile[0];
      });
    this.CodeLocation$ = this._locationService.getCodeLocation();
    this.CodeLocation$.subscribe((value: any) => {
      this.codes = value;
    });
  }
  Close() {
    this.dialogRef.close();
  }
  openChooseImage() {
    const dialogRef = this.dialog.open(ImageCutComponent, {
      width: '50vw',
      data: {
        withOutCopped: true,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // تحويل الحجم إلى كيلوبايت (إذا لزم الأمر)
      const maxSizeInKB = this.codes?.LogoImageSize?.size; // لأنها معتمدة بالفعل على كيلوبايت

      if (result && result?.fileToReturn?.size <= maxSizeInKB * 1024) {
        this.logoForReport = result;
      } else {
        this.toastr.error(
          document.dir == 'rtl'
            ? `الرجاء إختيار صورة يكون حجمها أقل من ${this.codes?.LogoImageSize?.size} كيلوبايت`
            : `Please select an image file with a size less than or equal to ${this.codes?.LogoImageSize?.size} kilobytes`
        );
      }
    });
  }
  onSave() {
    this._locationService
      .saveLocationForSettingReport({
        ...this.LocationReportSetting.value,
        LogoFile: this.logoForReport?.fileToReturn,
        LocationId: this.locationId,
      })
      .subscribe((value: any) => {
        this.toastr.success(value.Msg);
        this.dialogRef.close();
      });
  }
}
