import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { switchMap, map, shareReplay, tap, finalize } from 'rxjs/operators';
import { ApplyComponent } from './apply/apply.component';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MaintenanceRequestService } from './maintenance-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewOldRequestComponent } from './view-old-request/view-old-request.component';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { ImageCutComponent } from 'src/app/shared/components/image-cut/image-cut.component';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { ViewFieldInItemComponent } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.component';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.scss'],
})
export class MaintenanceRequestComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private Service: MaintenanceRequestService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _viewItemInFieldService: ViewItemInFieldService
  ) {}
  @ViewChild('AdditionalFieldsInPuplic')
  AdditionalFieldsInPuplic: ViewFieldInItemComponent;
  WorkRequest$: Observable<any>;
  Codes$: Observable<any>;
  WorkRequest: any;
  codes: any;
  loadingButton: boolean = false;
  isActivePage: boolean = false;
  loadingData: boolean = false;
  DEBUG = environment.DEBUG;
  WRTitleOptionId: number;
  form = new UntypedFormGroup({
    LocationId: new UntypedFormControl(),
    CompanyId: new UntypedFormControl(),
    AssetId: new UntypedFormControl(),
    TagId: new UntypedFormControl(),
    PriorityId: new UntypedFormControl(),
    RequestTitle: new UntypedFormControl(),
    RequestDescription: new UntypedFormControl(),
    RequesterName: new UntypedFormControl(),
    RequesterPhone: new UntypedFormControl(),
    RequesterEmail: new UntypedFormControl(),
    DueDate: new UntypedFormControl(),
  });
  AssetSelected: any;
  assetId: any;
  pageDirection: string;
  Avatar = environment.Avatar;
  data: any;
  notRipot: boolean = false;
  useCaptcha = true;

  ngOnInit(): void {
    const companyDontUseCaptcha = ['111'];
    const companyId = localStorage.getItem('companyId');
    this.useCaptcha = companyId !== null && !companyDontUseCaptcha.includes(companyId);
    this._viewItemInFieldService.ComponentType = 'WorkRequestGates';
    const idLocation = this._activatedRoute.snapshot.paramMap.get('id');
    this.assetId = this._activatedRoute.snapshot.paramMap.get('AssetID');

    this.WorkRequest$ = this.Service.getWorkRequest({ id: idLocation }).pipe(
      map((value) => {
        sessionStorage.setItem('dynamicFields', JSON.stringify(value[0]));
        return {
          ...value[0],
        };
      }),
      tap((value: any) => {
        this.WRTitleOptionId = value.WRTitleOptionId;
        this.pageDirection =
          value.LanguageCode == 'en' || value.LanguageCode == 'EN'
            ? 'ltr'
            : 'rtl';
        this.isActivePage = value.IsActive;
        this.loadingData = true;
      }),
      shareReplay(1)
    );
    if (this.assetId) {
      this.Service.getAssetByCode(this.assetId).subscribe((value) => {
        this.AssetSelected = value?.Msg;
      });
    } else {
    }

    this.WorkRequest$.subscribe((data) => {
      this.data = data;
      this.Codes$ = this.Service.getCodeWorkRequest(data.LocationId).pipe(
        shareReplay(1)
      );
      this.Codes$.subscribe((value) => {
        this.codes = value;
      });
      this.form.controls['LocationId']?.setValue(data.LocationId);

      this.form.controls['CompanyId']?.setValue(data.CompanyId);

      if (data.WRTitleOptionId == 60)
        this.form.controls['RequestTitle'].setValidators(Validators.required);
      if (data.WRDescriptionOptionId == 60)
        this.form.controls['RequestDescription'].setValidators(
          Validators.required
        );
      // if (data.AssetOptionId == 60)
        // if (data.TaskPriorityOptionId == 60)
          // this.form.controls['AssetId'].setValidators(Validators.required);
          // this.form.controls['priorityId'].setValidators(Validators.required);
      // if (data.TagsOptionId == 60)
      //   this.form.controls['TagId'].setValidators(Validators.required);
      if (data.RequesterNameOptionId == 60)
        this.form.controls['RequesterName'].setValidators(Validators.required);
      if (data.RequesterPhoneOptionId == 60)
        this.form.controls['RequesterPhone'].setValidators(Validators.required);
      if (data.RequesterEmailOptionId == 60)
        this.form.controls['RequesterEmail'].setValidators([Validators.required, Validators.email]);
      if (data.DueDateOptionId == 60)
        this.form.controls['DueDate'].setValidators(Validators.required);

      this.cdr.detectChanges();
    });
  }
  Apply() {
    if (!this.notRipot && !this.DEBUG && this.useCaptcha) {
      return false;
    }
    if (!this.form.value.LocationId) {
      this.toastr.error('Please Reload this Page');
      return false;
    }

    var data: any;
    var result: any;
    if (this.form.valid) {
      this.loadingButton = true;
      const body = {
        ...this.form.value,
        assetcode: this.assetId,
      };

      const WorkRequest = this.Service.SaveWorkRequest(body).pipe(
        switchMap((value: any) => {
          data = value.data;
          result = value;
          this.Service.submited$.next(value?.WorkOrderId);

          return this.AdditionalFieldsInPuplic.saveWorkRequestFields(
            value.rv,
            value?.WorkOrderId
          );
        })
      );

      WorkRequest.pipe(
        finalize(() => {
          this.loadingButton = false;

          this.openSuccess(data);
        })
      ).subscribe(
        (res: any) => {
          if (result?.rv > 0) {
          } else {
            // this.toastr.error(data.Msg);
          }
        },
        (err: any) => {

          //
        }
      );
    } else {
      if(this.form.controls['RequesterEmail'].errors?.email){
        this.toastr.error(
          document.dir == 'rtl'
            ? 'يرجى التحقق من الإميل المدخل'
            : 'Please check the email is currect'
        );
      }else{
        this.toastr.error(
          document.dir == 'rtl'
            ? 'يرجى التحقق من الحقول المطلوبة'
            : 'Please Check All Field Required'
        );
      }
    }
  }
  openSuccess(data: any) {
    const dialogRef = this.dialog
      .open(ApplyComponent, {
        width: '50vw',
        data: { data: data[0], pageDirection: this.pageDirection, WRTitleOptionId: this.WRTitleOptionId },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      this.form.reset({
        LocationId: this.form.get('LocationId')?.setValue(data.LocationId),
        CompanyId: this.form.get('CompanyId')?.setValue(data.CompanyId),
      });
      this.AssetSelected = '';
      document.location.reload();
      this.cdr.detectChanges();
    });
  }
  //

  ViewOldRequest() {
    const dialogRef = this.dialog
      .open(ViewOldRequestComponent, {
        width: '50vw',
        data: { pageDirection: this.pageDirection },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  opentree() {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '80vw',
      data: {
        data: this.codes.AssetId,
        assetInfo: { ID: this.assetId },
        isNotContext: true,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.form.controls['AssetId'].setValue(result.ID);
        this.cdr.detectChanges();
      }
    });
  }
  chooseImage() {
    const dialogRef = this.dialog.open(ImageCutComponent, {
      width: '50vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  showResponse(event: any) {
    this.notRipot = true;
  }
}
