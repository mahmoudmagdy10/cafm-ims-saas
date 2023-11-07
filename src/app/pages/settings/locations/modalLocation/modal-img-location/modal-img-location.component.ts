import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-img-location',
  templateUrl: './modal-img-location.component.html',
  styleUrls: ['./modal-img-location.component.scss']
})

export class ModalImgLocationComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalImgLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}