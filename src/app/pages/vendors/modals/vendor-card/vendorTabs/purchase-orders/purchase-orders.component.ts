import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorCardComponent } from './../../vendor-card.component';
import { ToastrService } from 'ngx-toastr';
import { VendorsService } from 'src/app/pages/vendors/vendors.service';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
})
export class PurchaseOrdersComponent implements OnInit {
  dataCard: any;
  constructor(
    private serviceVen: VendorsService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<VendorCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataCard = this.data;
  }
  Codes$: Observable<any>;
  ngOnInit(): void {
    this.Codes$ = this.serviceVen.getCodeObz$();
  }
}
