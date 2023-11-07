import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';

@Component({
  selector: 'app-vendor-card',
  templateUrl: './vendor-card.component.html',
  styleUrls: ['./vendor-card.component.scss'],
})
export class VendorCardComponent implements OnInit {
  dataCard: any;
  constructor(
    public dialogRef: MatDialogRef<VendorCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _logsByComponentTypeService: LogsByComponentTypeService
  ) {
    this.dataCard = this.data;
    this._logsByComponentTypeService?.startUse('Vendors', this.dataCard.ID);
  }

  ngOnInit(): void {}

  Close() {
    this.dialogRef.close();
  }
}
