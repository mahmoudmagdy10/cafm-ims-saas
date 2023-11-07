import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { assetsScreenService } from '../../../assetsScreen.service';
import { LinkAssetWithVendorComponent } from '../../cardAssetModals/link-asset-with-vendor/link-asset-with-vendor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'suppliers',
  templateUrl: 'suppliers.component.html',
})
export class suppliersComponent implements OnInit {
  itemSelected: any;
  constructor(
    private assetsScreen: assetsScreenService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}
  @Input() data: any;
  ngOnInit(): void {}
  LinkAssetWithVendor() {
    const dialogRef = this.dialog
      .open(LinkAssetWithVendorComponent, {
        width: '60vw',
        data: {
          noQuantity: true,
          ID: this.data.ID,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value: any[]) => {
      if (value) {
        if (!this.data.Vendors) {
          this.data.Vendors = [];
        }
        this.data.Vendors.push(value);
      }
    });
  }

  deleteAssetWithVendor(body: any) {
    this.assetsScreen
      .deleteAssetWithVendor({
        AssetId: this.data.ID,
        VendorId: body?.ID,
      })
      .subscribe(
        (res: any) => {
          if (res?.rv > 0) {
            if (this.data.Vendors) {
              this.data.Vendors.forEach((element: any, index: any) => {
                if (element.ID == body.ID) {
                  this.data.Vendors.splice(index, 1);
                }
              });
            }
          } else {
          }
        },
        (err) => {}
      );
  }
}
