import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../../modules/auth/services/auth.service';
import { skip, switchMap, tap, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {Component,OnInit,ViewChild,OnDestroy,ChangeDetectorRef} from '@angular/core';
import { UntypedFormControl, NgForm, UntypedFormGroup, FormControl } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConfigurationService } from './configurations.service';
import { tagsmanagementComponent } from './modals/tagsmanagementModal/tagsmanagementModal.component';
import { praiortyComponent } from './modals/priorityModal/priorityModal.compnent';
import { TranslateService } from '@ngx-translate/core';
import { ReasonsModalComponent } from './modals/reasons-modal/reasons-modal.component';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit, OnDestroy {
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  Codes$: Observable<any>;
  DataConfig$: Observable<any>;
  dataTime: any[] = [];
  pesantAge: any[] = [];
  resSave: any;
  interval: any;
  loadingBackup: boolean = false;
  localionIdControl = new FormControl();
  files: any;
  subscription: Subscription;
  locations: any[];
  isSuperUser = localStorage.getItem('isSuperUser');
  isUserManagerOnLocation = localStorage.getItem('isUserManagerOnLocation');
  ClientAcceptanceRequied : { code: boolean; Name: string }[]=[];
  extraServiceForAllLocation : { code: boolean; Name: string }[]=[];


  constructor(
    private primengConfig: PrimeNGConfig,
    private service: ConfigurationService,
    private toastr: ToastrService,
    private auth: AuthService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.ClientAcceptanceRequied = [
      { code: true, Name: this.translateService.instant('YES') },
      { code: false, Name: this.translateService.instant('NO') },
    ];
    this.extraServiceForAllLocation = [
      { code: true, Name: this.translateService.instant('YES') },
      { code: false, Name: this.translateService.instant('NO') },
    ];
  }

  ConfigurationsForm = new UntypedFormGroup({
    //الإعدادات العامة
    LanguageCode: new UntypedFormControl(),
    CurrencyId: new UntypedFormControl(),
    FisalYear: new UntypedFormControl(),
    WeekStartDay: new UntypedFormControl(),

    //اعدادات الأمان
    AutoUsersLogout: new UntypedFormControl(),
    AutoPasswordExpiration: new UntypedFormControl(),
    AutoPasswordExpirationNotification: new UntypedFormControl(),

    // اعدادات واجهة المستخدم
    AssetPickingShow: new UntypedFormControl(),
    AssetPickingOrder: new UntypedFormControl(),
    AssetManagingShow: new UntypedFormControl(),

    // إعدادات المهام العامة
    WOLogTimeDescription: new UntypedFormControl(),
    WOCompletionNote: new UntypedFormControl(),
    WOPartPricePrinting: new UntypedFormControl(),
    WOExternalCommentNotification: new UntypedFormControl(),
    ClientAcceptanceRequied: new UntypedFormControl(),
    // إعدادات طلب العمل
    WRCaptchaStatus: new UntypedFormControl(),
    WRRequesterViewScope: new UntypedFormControl(),

    // غير محدد
    PartConsumtionMethod: new UntypedFormControl(),
    WOLogTimeMethod: new UntypedFormControl(),
    WRSimiliarityRatio: new UntypedFormControl(),
    InsertionTemplate: new UntypedFormControl(),

    LongTaskRatio: new UntypedFormControl(0),
    WODefaultTemplate: new UntypedFormControl(0),
    WODefaultDueDate: new UntypedFormControl(0),
    ResponseTime: new UntypedFormControl(),
    AVGPriceCalculationMethod: new UntypedFormControl(),
    maxMaintenanceNo: new UntypedFormControl(),
    PPMTaskNameMethod: new UntypedFormControl(),
    ItemsUsedCheckOver: new UntypedFormControl(),
    SchedulingOverlapping: new UntypedFormControl(),
    isExtraServiceForAllLocation: new UntypedFormControl(),
  });

  ngOnInit(): void {   
    this.locations = this.service.locationList.value;
    this.service.getConfiguration();
    for (var i = 1; i <= 48; i++) {
      this.dataTime.push(i);
    }
    for (var i = 10; i <= 90; i = i + 10) {
      this.pesantAge.push(i);
    }
    this.primengConfig.ripple = true;
    this.getCodeConfigurationAndDataConfiguration();

    const SaveConfig$ = this.ConfigurationsForm.valueChanges.pipe(
      skip(1),
      switchMap((data: any) => {
        data.isExtraServiceForAllLocation = data.isExtraServiceForAllLocation ? 1 : 0;
        if (this.ConfigurationsForm.get('AutoPasswordExpiration')?.value == 0) {
          return this.service.saveConfiguration({
            ...data,
            AutoPasswordExpirationNotification: 0,
          });
        } else {
          return this.service.saveConfiguration({ ...data });
        }
      })
    );

    SaveConfig$.subscribe((res) => {
      this.resSave = res;
      if (this.resSave.rv > 0) {
        this.toastr.success(this.resSave.Msg);
      } else {
        this.toastr.error(this.resSave.Msg);
      }
    });

    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.getCodeConfigurationAndDataConfiguration();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.getCodeConfigurationAndDataConfiguration();
      }
    });
  }

  getCodeConfigurationAndDataConfiguration() {
    this.Codes$ = this.service.getCodeConfiguration().pipe(
      map((value: any) => {
        return {
          ...value,
        };
      })
    );
    
    this.DataConfig$ = this.service.Configuration$.pipe(
      tap((dataForm) => {
        console.log('dataForm :>> ', dataForm);
        if (dataForm) {
          this.ConfigurationsForm.patchValue({
            ...dataForm,
            SchedulingOverlapping: dataForm.SchedulingOverlappingMethod,
            FisalYear: new Date(dataForm.FisalYear),
          });
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }

  openPriorty() {
    const dialogRef = this.dialog
      .open(praiortyComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  openReasons() {
    const dialogRef = this.dialog
      .open(ReasonsModalComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  openTags() {
    const dialogRef = this.dialog
      .open(tagsmanagementComponent, {
        width: '70vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  setNewCurancy(data: any[]) {
    let newValue = data.find(
      (value) => value.Code == this.ConfigurationsForm.get('CurrencyId')?.value
    ).Name;

    localStorage.setItem('currencyName', newValue);
  }

  downloadBackupForLocation() {
    this.loadingBackup = true;
    this.service
      .downloadBackupExcelFile(this.localionIdControl.value)
      .subscribe((value: any) => {
        if (value && value != '') {
          let blob = new Blob([value], {
            type: 'application/vnd.ms-excel',
          }); 
          const LocationName = this.locations.find(
            (value: any) => value.LocationId == this.localionIdControl.value
          ).LocationName;

          saveAs(blob, LocationName);
        }
        this.loadingBackup = false;
        this.cdr.detectChanges();
      });
  }


  SaveLogo(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile.type === 'image/png') {
      this.service
        .SaveLogoImg({
          Image: selectedFile,
        })
        .subscribe((res) => {
          this.resSave = res;
          if (this.resSave.rv > 0) {
            this.toastr.success(this.resSave.Msg);
          } else {
            this.toastr.error(this.resSave.Msg);
          }
        });
    } else {
      this.toastr.error('Please select a PNG file.');
    }
  }
}
