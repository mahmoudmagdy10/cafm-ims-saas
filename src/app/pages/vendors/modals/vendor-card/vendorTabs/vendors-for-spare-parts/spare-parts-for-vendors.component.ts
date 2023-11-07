import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LinkWithSparePartComponent } from './link-with-sparePart/link-with-spare-part.component';
import { VendorsService } from 'src/app/pages/vendors/vendors.service';

@Component({
  selector: 'spare-parts-for-vendors',
  templateUrl: './spare-parts-for-vendors.component.html',
})
export class SparePartForVendorsComponent implements OnInit {
  @Input() dataCard: any;
  disable: boolean = false;
  constructor(
    private service: VendorsService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.getCodeObz$().pipe(
      tap((codes) => {
        if (codes && !codes?.PagePermissions?.VendorsEdit) {
          this.disable = true;
        }
      })
    );
  }
  openspartPart(itemEdit: any) {
    const dialogRef = this.dialog.open(LinkWithSparePartComponent, {
      width: '60vw',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const body = {
          partId: value.PartID,
          vendorId: itemEdit.ID,
          vendorPartNumber: value.vendorPartNumber,
          vendorPrice: value.vendorPrice,
          isManual: true,
        };

        this.service.linkPartWithVendor(body).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              if (!itemEdit.VendorsParts) {
                itemEdit.VendorsParts = [];
              }
              var newItem = {
                PartName: value.PartName,
                PartNumber: value.vendorPartNumber,
                AveragePrice: value.vendorPrice,
                IsManual: true,
              };
              itemEdit.VendorsParts.push(newItem);

              // this.service.updateItemEdit({ Vendors: Vendors });
            } else {
            }
          },
          (err) => {
            // this.toastr.error(err.Msg);
          }
        );
      }
    });
  }
  deleteLinkPartWithVendor(ID: any, itemEdit: any) {
    this.service
      .deleteLinkPartWithVendor({ VendorId: itemEdit.ID, PartId: ID })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            const Vendors = itemEdit.VendorsParts;

            Vendors?.forEach((value: any, index: any) => {
              if (value.ID == ID) {
                Vendors.splice(index, 1);
              }
            });
            // this.service.updateItemEdit({ Vendors: Vendors });
          } else {
          }
        },
        (err) => {
          // this.toastr.error(err.Msg);
        }
      );
  }
}
