import { environment } from 'src/environments/environment';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from './../../locations.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { MapCardComponent } from 'src/app/shared/components/google-map/dilogGoogleMapSingleMarker/map-card/map-card.component';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ModalImgLocationComponent } from '../modal-img-location/modal-img-location.component';
import { AsideMenuService } from 'src/app/services/aside-menu.service';

@Component({
  selector: 'modalEdit',
  templateUrl: 'modalEdit.component.html',
})
export class modalEditComponent implements OnInit {
  DateAndTime$!: Observable<any>;
  ArrFiles: any[] = [];
  displayEditImage: boolean = false;
  disabled: boolean = false;
  fileToReturn: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileUUID: any;
  imgLocation: any = 'assets/media/avatars/location.png';
  loading$ = new BehaviorSubject(false);
  loadingImage$ = new BehaviorSubject(false);
  imageFile = new UntypedFormControl(null);
  extraServices :any[]= [];
  loading = false;
  ClientAcceptanceRequied = new UntypedFormControl(null);
  hasOwnTagsOnly = new UntypedFormControl(null);
  HasOwnPriorityOnly = new UntypedFormControl(null);
  HasOwnReasonOnly = new UntypedFormControl(null);
  formEdit = new UntypedFormGroup({
    LocationId: new UntypedFormControl(null, Validators.required),
    LocationName: new UntypedFormControl(null, Validators.required),
    TimeZoneId: new UntypedFormControl(null, Validators.required),
    AverageWage: new UntypedFormControl(0),
    WorkingDayCount: new UntypedFormControl(null, Validators.required),
    DailyWorkingHours: new UntypedFormControl(null, Validators.required),
    PhoneNumber: new UntypedFormControl(null),
    Address: new UntypedFormControl(null),
    ExtraInformation: new UntypedFormControl(null),
    Longitude: new UntypedFormControl(null),
    Latitude: new UntypedFormControl(null),
    Zoom: new UntypedFormControl(null),
    // MinStorageBudgetId: new FormControl(null),
    DefaultBudgetId: new UntypedFormControl(null),
    addedServiceCode : new UntypedFormControl(null)
  });
  data: any;
  filesForm = new UntypedFormGroup({
    File: new UntypedFormControl(),
    StartDate: new UntypedFormControl(),
    EndDate: new UntypedFormControl(),
  });
  WorkingDayCount: any[] = [];
  DailyWorkingHours: any[] = [];
  extraServicesOptions: any[] = [];
  softServiceConfig: any;
  serviceData: any;
  useSoftService = false;

  get ClientAcceptanceValue() {
    return this.ClientAcceptanceRequied.value;
  }

  get savehasOwnTagsOnlyValue() {
    return this.hasOwnTagsOnly.value;
  }
  get HasOwnPriorityOnlyValue() {
    return this.HasOwnPriorityOnly.value;
  }
  get HasOwnReasonOnlyValue() {
    return this.HasOwnReasonOnly.value;
  }
  ClientAcceptanceRequiedCode :{ code: boolean; Name: string }[]=[];
  extraServiceForAllLocation :{ code: boolean; Name: string }[]=[];
  TagsAndPiriorty :{ code: boolean; Name: string }[]=[];
  constructor(
    private asideMenuService: AsideMenuService,
    private translateService: TranslateService,
    private service: LocationService,
    private toster: ToastrService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<modalEditComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public Data: any
  ) {
    this.ClientAcceptanceRequiedCode = [
      { code: true, Name: this.translateService.instant('YES') },
      { code: false, Name: this.translateService.instant('NO') },
    ];
    this.extraServiceForAllLocation = [
      { code: true, Name: this.translateService.instant('YES') },
      { code: false, Name: this.translateService.instant('NO') },
    ];
    this.TagsAndPiriorty = [
      { code: true, Name: this.translateService.instant('YES') },
      { code: false, Name: this.translateService.instant('NO') },
    ];
  }
  ngOnInit(): void {
    this.useSoftService = localStorage.getItem('companyId') === '120';
    this.refreshServiceList();
    this.extraServicesOptions = this.Data.Codes.ExtraServices;
    if (this.Data.disabled) {
      this.formEdit.disable();
      this.filesForm.disable();
      this.ClientAcceptanceRequied.disable();
      this.disabled = true;
    } else {
      this.formEdit.enable();
      this.disabled = false;
    }
    this.getDataById();
    for (var i = 1; i <= 7; i++) {
      this.WorkingDayCount.push(i);
    }
    for (var i = 1; i <= 24; i++) {
      this.DailyWorkingHours.push(i);
    }
    this.service.getDate();
    this.DateAndTime$ = this.service.DateAndTime$.pipe(
      tap((val) => {
      })
    );
  }
  Avatar = environment.Avatar;

  getDataById() {
    if (this.Data.LocationId) {
      this.loading$.next(true);
      this.service
        .getLocationById(this.Data.LocationId)
        .pipe(
          finalize(() => {
            this.loading$.next(false);
          })
        )
        .subscribe((value) => {
          this.formEdit.patchValue(value[0]);
          this.ClientAcceptanceRequied.patchValue(
            value[0].ClientAcceptanceRequied
          );
          this.hasOwnTagsOnly.patchValue(value[0].HasOwnTagsOnly);
          this.HasOwnPriorityOnly.patchValue(value[0].HasOwnPriorityOnly);
          this.HasOwnReasonOnly.patchValue(value[0].HasOwnReasonOnly);
          this.data = value[0];
          this.ArrFiles = this.data.LocationFiles;
          if (value[0].ImagePath) {
            this.imgLocation = this.Avatar + value[0].ImagePath;
          } else {
            this.imgLocation = this.Avatar;
          }
        });
    }
  }
  onAddLocation() {
    if (this.formEdit.valid) {
      if (this.formEdit.controls['WorkingDayCount'].value > 7) {
        this.toster.error('عدد ايام العمل لا تتجاوز 7 ايام ');
      } else if (this.formEdit.controls['DailyWorkingHours'].value > 24) {
        this.toster.error('عدد ساعات العمل لا يجب ان تتجاوز 24 ساعة ');
      } else {
        this.service
          .UpdateLocation({ ...this.formEdit.value })
          .subscribe((res: any) => {
            if (res.rv > 0) {
              this.dialogRef.close('onSave');
              this.formEdit.reset();
            } else {
              this.toster.error(res.Msg);
            }
          });
      }
    } else {
      this.toster.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  showEditImage() {
    this.displayEditImage = true;
  }
  fileChangeEvent(event: any): void {
    this.loadingImage$.next(true);
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

    this.fileToReturn = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name
    );

    return this.fileToReturn;
  }

  base64ToFile(data: any, filename: any) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  imageLoaded() {
    /* show cropper */
  }
  cropperReady() {
    /* cropper ready */
    this.loadingImage$.next(false);

    // this.toster.error("cropperReady");
  }
  loadImageFailed() {
    /* show message */
    this.toster.error('فشل تحميل الصورة');
  }

  openMap() {
    const dialogRef = this.dialog.open(MapCardComponent, {
      width: '50vw',
      data: { ...this.formEdit.value },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formEdit.controls['Longitude'].setValue(result.Longitude);
        this.formEdit.controls['Latitude'].setValue(result.Latitude);
        this.formEdit.controls['Zoom'].setValue(result.Zoom);
      }
    });
  }
  saveImg() {
    const body = {
      LocationId: this.Data.LocationId,
      Image: this.fileToReturn,
    };
    this.service.saveImageLocation(body).subscribe(
      (res: any) => {
        if (res?.rv > 0) {
          this.displayEditImage = false;
          this.getDataById();
          this.imageChangedEvent = null;
          this.croppedImage = null;
          this.imageFile.setValue(null);
        } else {
          this.toster.error(res.Msg);
        }
      },
      (err) => {
        this.toster.error(err.message);
      }
    );
  }
  IsImgLocation(imgLocation: any) {
    if (imgLocation) {
      return true;
    } else {
      return false;
    }
  }
  loadingValue$() {
    return this.loading$.asObservable();
  }
  isloadingImage$() {
    return this.loadingImage$.asObservable();
  }
  Close() {
    this.dialogRef.close();
  }

  uploadFile(value: any) {
    this.filesForm.get('File')?.setValue(value.currentFiles[0]);
  }
  saveNewFile() {
    const data = new FormData();
    data.append('Allfiles[0].File', this.filesForm.get('File')?.value);
    if (this.filesForm.get('StartDate')?.value) {
      data.append(
        'Allfiles[0].StartDate',
        moment(this.filesForm.get('StartDate')?.value).format('YYYY-MM-DD')
      );
    }
    if (this.filesForm.get('EndDate')?.value) {
      data.append(
        'Allfiles[0].EndDate',
        moment(this.filesForm.get('EndDate')?.value).format('YYYY-MM-DD')
      );
    }

    this.service
      .addFileForLocation(this.Data.LocationId, data)
      .subscribe((value: any) => {
        if (!this.ArrFiles) {
          this.ArrFiles = [];
        }
        this.ArrFiles.push(value[0]);
        this.filesForm.reset();
      });
  }
  deleteFile() {
    if (this.fileUUID) {
      this.service
        .deleteFileFromLocation(this.fileUUID)
        .subscribe((res: any) => {
          if (res.rv) {
            this.getDataById();
          } else {
            this.toster.error(res.Msg);
          }
        });
    }
  }
  saveClientAcceptance() {
    this.service
      .saveClientAcceptance({
        ...this.ClientAcceptanceValue,
        ClientAcceptanceRequied: this.ClientAcceptanceValue,
        LocationId: this.Data.LocationId,
      })
      .subscribe();
  }

  addSoftService() {
    const code = this.formEdit.value.addedServiceCode;
    if(code === null){
      return;
    }
    const payload = {
      locationId: this.Data.LocationId,
      serviceId: code,
      id: 0
    };
  
    this.service.addLocationExtraService(payload).pipe(
      tap((serviceData:any) => {
        const { ServiceId } = serviceData.data[0];
        this.toster.info(this.translateService.instant('SIDEBAR.alerts.updated'));
        this.extraServicesOptions = this.extraServicesOptions.filter(s=> s.code !== ServiceId)
        this.loadExtraServiceData(serviceData, code);
      }),
      catchError(error => {
        if (error.status === 500) {
          this.toster.error('Service already exists', 'الخدمة موجودة بالفعل');
        }
        return throwError(error);
      })
    ).subscribe();
  }
  

  loadExtraServiceData(serviceData: any, code:number) {
    const { LocationId } = this.Data;
    const { ServiceId, Id } = serviceData.data[0];
    this.serviceData = serviceData;
    const payload = {
      locationId: LocationId,
      serviceId: ServiceId,
      id: Id,
    };
    this.getLocationExtraServices(payload);
  }

  getServiceName (service :any) {
    return this.Data.Codes.ExtraServices.find((s:any) => s.code === service.ServiceId).name;
   }
  getLocationExtraServices(payload:any){ 
    this.service.getLoactionExtraService(payload).pipe(
      tap(response => {
       const {Data : oldServices} = response; 
       if (oldServices === null){
        return;
       }
        this.extraServices = [...this.extraServices, ...oldServices].map(s=>({
          ...s,
          name: this.getServiceName(s)
        }));
        this.extraServicesOptions = this.extraServicesOptions.filter(option => {
          return !this.extraServices.some(service => 
            service.name === option.name && service.ServiceId === option.code
          );
        });
        this.asideMenuService.softServiceChanged(this.extraServices);
        this.cdr.detectChanges();
        if (!this.extraServicesOptions.length){
          this.formEdit.get('addedServiceCode')?.disable();
        }
      })
    )
    .subscribe(() => {
      this.formEdit.patchValue({ addedServiceCode: null });
    });
  }
  /* test develop*/
  deleteService(service:any){
    const payload = {
      locationId: service.LocationId,
      id: service.Id 
    };
    this.service.deleteLocationExtraService(payload).pipe(
      tap(()=>  {
        this.extraServices = this.extraServices.filter(f=> f.ServiceId !==service.ServiceId)
        const addToOptions = this.Data.Codes.ExtraServices.filter((s:any) => s.code === service.ServiceId)
        this.extraServicesOptions = [...this.extraServicesOptions, ...addToOptions ];
        this.formEdit.get('addedServiceCode')?.enable();
        this.extraServices.map(s=>({
          ...s,
          name: this.getServiceName(s)
        }));
        this.asideMenuService.softServiceChanged(this.extraServices);
        this.toster.info(this.translateService.instant('SIDEBAR.alerts.updated'));
        this.loading= false;})
    ).subscribe();
  }
  
  refreshServiceList(){
    const { LocationId } = this.Data;
    this.getLocationExtraServices({locationId:LocationId})
  }

  
  savehasOwnTagsOnly() {
    this.service
      .savehasOwnTagsOnly({
        ...this.ClientAcceptanceValue,
        HasOwnTagsOnly: this.savehasOwnTagsOnlyValue,
        HasOwnPriorityOnly: this.HasOwnPriorityOnlyValue,
        HasOwnReasonOnly: this.HasOwnReasonOnlyValue,
        LocationId: this.Data.LocationId,
      })
      .subscribe();
  }

  openFile(link: any) {
    window.open(link, '_blank');
  }

  showFullScreenImg(imgLocation: string): void {
    if(!imgLocation){
      return;
    }
    this.dialog.open(ModalImgLocationComponent, {
      width: '50vw',
      data: { imgLocation }
    });
  }
}
