import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
})
export class CardSparePartImageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CardSparePartImageComponent>,
    @Inject(MAT_DIALOG_DATA) public Params: any,
    public service: SparePartService,
    private toastr: ToastrService
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
      PartId : this.Params.ID,
      Image: this.fileToReturn,
    };
    this.service.addImage(body).subscribe(
      (res: any) => {
        if (res?.rv > 0) {

          this.dialogRef.close(res.data[0])
        } else {

        }
      },
      (err) => {
        this.toastr.error(err.message);
      }
    );
  }
  Close() {
    this.dialogRef.close();
  }
}
