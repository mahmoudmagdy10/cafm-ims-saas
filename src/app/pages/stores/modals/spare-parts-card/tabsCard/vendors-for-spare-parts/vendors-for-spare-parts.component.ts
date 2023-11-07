import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LinkWithVendorComponent } from '../../modelsCard/link-with-vendor/link-with-vendor.component';

@Component({
  selector: 'app-vendors-for-spare-parts',
  templateUrl: './vendors-for-spare-parts.component.html',
})
export class VendorsForSparePartComponent implements OnInit {
  itemEdit$: Observable<any>;
  constructor(
    private service: SparePartService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.itemEdit$ = this.service.itemEdit$;
  }
  openVendor(itemEdit: any) {

    const dialogRef = this.dialog.open(LinkWithVendorComponent, {
      width: '60vw',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {

      if (value) {
        const body = {
          partId: itemEdit.ID,
          vendorId: value.vendorId,
          vendorPartNumber: value.vendorPartNumber,
          vendorPrice: value.vendorPrice,
          isManual: true,
        };

        this.service.linkPartWithVendor(body).subscribe(
          (res: any) => {
            if (res.rv > 0) {

              if (!itemEdit.Vendors) {
                itemEdit.Vendors = [];
              }

              var Vendors = [...itemEdit.Vendors, res.data[0]];

              this.service.updateItemEdit({ Vendors: Vendors });
            } else {

            }
          },
          (err) => {
            this.toastr.error(err.Msg);
          }
        );
      }
    });
  }
  deleteLinkPartWithVendor(ID: any, itemEdit: any) {
    this.service
      .deleteLinkPartWithVendor({ VendorId: ID, PartId: itemEdit.ID })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

            const Vendors = itemEdit.Vendors;

            Vendors.forEach((value: any, index: any) => {
              if (value.ID == ID) {
                Vendors.splice(index, 1);
              }
            });

            this.service.updateItemEdit({ Vendors: Vendors });
          } else {

          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
  }
}
