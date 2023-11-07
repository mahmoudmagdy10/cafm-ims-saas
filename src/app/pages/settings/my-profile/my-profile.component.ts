import { environment } from 'src/environments/environment';
import { tap, finalize, shareReplay } from 'rxjs/operators';
import { AuthService } from './../../../modules/auth/services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  NgModule,
  Component,
  ElementRef,
  VERSION,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { MyProfileService } from './my-profille.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FilePond, FilePondOptions } from 'filepond';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  private ctx: CanvasRenderingContext2D;

  constructor(
    private service: MyProfileService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}
  ngAfterViewInit(): void {
    this.getDataProfile();
  }
  name = 'Angular ' + VERSION.major;

  imgProfile: string;
  fileToReturn: File;
  imgCanvas: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  display: boolean = false;
  actionChange: boolean = false;
  interval: any;
  DataProfile$: Observable<any>;
  @ViewChild('signature') signature: ElementRef<any>;

  sig: SignaturePad;
  formProfile = new UntypedFormGroup({
    UserName: new UntypedFormControl('', Validators.required),
    Email: new UntypedFormControl('', Validators.required),
    FirstName: new UntypedFormControl('', Validators.required),
    LastName: new UntypedFormControl('', Validators.required),
    PhoneNumber: new UntypedFormControl(''),
    TwoFactorEnabled: new UntypedFormControl('', Validators.required),
    LanguageCode: new UntypedFormControl('', Validators.required),
    RefreshDuration: new UntypedFormControl('', Validators.required),
    IsEmailNotification: new UntypedFormControl('', Validators.required),
  });

  subscription: Subscription;
  Avatar=environment.Avatar

  ngOnInit() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(
          () => {
            this.getDataProfile();
            this.clearCanvas();
          },
          +TimerRefresh
        );
      } else if (value == 'now') {
        this.getDataProfile();
        this.clearCanvas();
      }
    });
  }

  clearCanvas() {
    this.sig.clear();
    this.imgCanvas = '';
  }

  getDataProfile() {
    this.DataProfile$ = this.service.getDataProfile().pipe(
      tap((value) => {
        this.formProfile.patchValue({ ...value });
        localStorage.setItem('avatarPath', value.AvatarPath);
        this.imgCanvas = value.SignaturePath;
      }),
      finalize(() => {
        setTimeout(() => {

          this.sig = new SignaturePad(this.signature.nativeElement);
        }, 500);
      })
    );
  }

  onEditProfile() {
    if (this.formProfile.valid) {
      if (this.actionChange == true) {
        this.service.saveEdit(this.formProfile.value).subscribe(
          (res: any) => {
            if (res.rv > 0) {

            } else {

            }
          },
          (err) => {

          }
        );
      }
      this.actionChange = false;
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }

  ActionChange() {
    this.actionChange = true;
  }
  saveCanvas() {
    var image = new Image();
    image.src = this.sig.toDataURL();
    var SigFile = this.base64ToFile(image.src, 'png');

    this.service.EditCanvas(SigFile).subscribe(
      (res: any) => {
        if (res.rv > 0) {

        } else {

        }
      },
      (err) => {

      }
    );
  }

  showEditImage() {
    this.display = true;
  }

  fileChangeEvent(event: any): void {
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
  }
  loadImageFailed() {
    /* show message */
  }

  saveImg() {
    this.service.saveImageProfile(this.fileToReturn).subscribe(
      (res: any) => {
        if (res?.rv > 0) {

          this.display = false;
          this.getDataProfile();
        } else {

        }
      },
      (err) => {
        this.toastr.error(err.message);
      }
    );
  }
  @ViewChild('myPond')
  myPond!: FilePond;

  pondOptions: FilePondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop files here...',
    acceptedFileTypes: ['image/jpeg, image/png'],
    allowReorder: true,
    maxFiles: 5,
  };

  pondFiles: FilePondOptions['files'] = [
    {
      source: 'assets/photo.jpeg',
      options: {
        type: 'local',
      },
    },
  ];

  pondHandleInit() {

  }

  pondHandleAddFile(event: any) {

  }

  pondHandleRemoveFile(event: any) {

  }

  pondHandleActivateFile(event: any) {

  }

  uploadFiles() {

  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
}
