import { assetsScreenService } from './../../../../assetsScreen.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-identification-description-modal',
  templateUrl: './identification-description-modal.component.html',
  styleUrls: ['./identification-description-modal.component.scss'],
})
export class IdentificationDescriptionModalComponent implements OnInit {
  Description: any;
  FormGroup!: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<IdentificationDescriptionModalComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private service: assetsScreenService
  ) {}
  ngOnInit() {
    this.Description = this.data?.IdentificationDescription;
  }
  Close() {
    this.dialogRef.close();
  }
}
