import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { assetsScreenService } from './../../../assetsScreen.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
})
export class CardImageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CardImageComponent>,
    @Inject(MAT_DIALOG_DATA) public Params: any,
    public assetsService: assetsScreenService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  imgProfile: string;
  fileToReturn: File;
  imgCanvas: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  ngOnInit(): void {}
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
    const body = {
      AssetId: this.Params.idAsset,
      Image: this.fileToReturn,
    };
    this.assetsService.addImageForAsset(body).subscribe(
      (res: any) => {
        if (res?.rv > 0) {
          this.assetsService.getAssetsById(this.Params.idAsset).subscribe((res)=> {
            this.imgProfile = res?.Data?.[0].ImagePath;
            this.Close();
          })
          this.assetsService.refreahAssetsById();
          this.cdr.detectChanges();
        } else {
        }
      },
      (err) => {
        this.toastr.error(err.message);
      }
    );
  }
  Close() {
    this.dialogRef.close({ imagePath: this.imgProfile });
  }
}
