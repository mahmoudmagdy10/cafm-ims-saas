import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { UsersService } from '../../users.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'modal5',
  templateUrl: 'modal5.component.html',
})
export class modal5Component implements OnInit, OnChanges {
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Input('idUser') idUser: any;
  @Input('locationId') locationId: any;
  isSuperAdmin: boolean = false;
  @Input() codes: any;
  imgProfile: string;
  fileToReturn: File;
  imgCanvas: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  display: boolean = false;
  actionChange: boolean = false;
  loading: boolean = false;
  imageControl = new UntypedFormControl();
  constructor(
    private usersService: UsersService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  formAddUser = new UntypedFormGroup({
    // UserName: new FormControl(null, Validators.required),
    JobTitle: new UntypedFormControl(null, Validators.required),
    Email: new UntypedFormControl({ value: null, disabled: false }),
    FirstName: new UntypedFormControl(null, Validators.required),
    LastName: new UntypedFormControl(null, Validators.required),
    PhoneNumber: new UntypedFormControl(null),
    IsSuperUser: new UntypedFormControl(null),
    WorkHourRate: new UntypedFormControl(null),
  });
  Avatar = environment.Avatar;

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.idUser || this.idUser == 0) {
      this.loading = true;
      this.usersService
        .getUserById(this.idUser, this.locationId)
        .subscribe((value) => {
          this.formAddUser.patchValue({ ...value.Data[0] });
          this.loading = false;
          const AvatarPath = value?.Data[0]?.AvatarPath;
          this.imgProfile = AvatarPath
            ? this.Avatar + AvatarPath
            : './assets/media/avatars/avatar.svg';
          this.cdr.detectChanges();
        });
    }
  }
  EditUser() {
    if (this.formAddUser.invalid) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    } else {
      this.usersService
        .addUser({
          ...this.formAddUser.value,
          userId: this.idUser,
          Email: this.formAddUser.get('Email')?.value,
          jobTile: this.formAddUser.get('JobTitle')?.value,
        })
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.formAddUser.reset();
              this.afterSave.emit();
            } else {
            }
          },
          (err) => {}
        );
    }
  }

  showEditImage() {
    this.display = true;
  }

  checkIsSuperUser() {
    this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperUser') || '');
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
    this.usersService
      .saveImageProfile(this.fileToReturn, this.idUser)
      .subscribe(
        (res: any) => {
          if (res?.rv > 0) {
            this.display = false;
            this.loading = true;
            this.usersService
              .getUserById(this.idUser, this.locationId)
              .subscribe((value) => {
                this.formAddUser.patchValue({ ...value.Data[0] });
                const AvatarPath = value?.Data[0]?.AvatarPath;
                this.imgProfile = AvatarPath
                  ? this.Avatar + AvatarPath
                  : './assets/media/avatars/avatar.svg';
                this.loading = false;
                this.imageChangedEvent = '';
                this.cdr.detectChanges();
              });
          } else {
          }
        },
        (err) => {
          this.toastr.error(err.message);
        }
      );
  }

  onCancel() {
    this.cancel.emit();
  }
}
