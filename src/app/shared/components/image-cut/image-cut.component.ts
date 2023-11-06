import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'image-cut',
  templateUrl: 'image-cut.component.html',
})
export class ImageCutComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImageCutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    this.dialogRef.close({
      croppedImage: this.croppedImage,
      fileToReturn: this.fileToReturn,
    });
  }
  handleUpload(event: any) {
    this.fileToReturn = event?.target?.files[0];
    const reader = new FileReader();
    reader.readAsDataURL((this.fileToReturn = event?.target?.files[0]));
    reader.onload = () => {
      this.croppedImage = reader.result;
    };
  }
  Close() {
    this.dialogRef.close();
  }
}
