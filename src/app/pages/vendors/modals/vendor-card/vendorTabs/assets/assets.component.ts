import { UntypedFormControl } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VendorsService } from 'src/app/pages/vendors/vendors.service';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit {
  unSubscri: Subscription;
  dataLinkedWithAsset: Observable<any[]> = of([]);
  Codes$: Observable<any>;
  @Input() dataCard: any;
  Search = new UntypedFormControl();
  assetIdDeleted = 0;
  disable: boolean = false;
  constructor(
    private dialog: MatDialog,
    private service: VendorsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.getCodeObz$().pipe(
      tap((code) => {
        if (code?.PagePermissions?.VendorsEdit) {
          this.disable = false;
        }
      })
    );
  }
  opentree(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const body = {
          vendorId: this.dataCard.ID,
          assetId: value.ID,
          isManual: true,
          // workOrderSharedId: this.dataCard,
        };

        this.service.linkAssetWithVendor(body).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              if (!this.dataCard.VendorsAssets) {
                this.dataCard.VendorsAssets = [];
              }
              this.dataCard.VendorsAssets.push({
                AssetName: value?.AssetName,
                ID: res.rv,
              });
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

  deleteAssetWithVendor() {
    this.service
      .deleteAssetWithVendor({
        AssetId: this.assetIdDeleted,
        VendorId: this.dataCard.ID,
      })
      .subscribe(
        (res: any) => {
          if (res?.rv > 0) {
            if (this.dataCard.VendorsAssets) {
              this.dataCard.VendorsAssets.forEach(
                (element: any, index: any) => {
                  if (element.ID == this.assetIdDeleted) {
                    this.dataCard.VendorsAssets.splice(index, 1);
                  }
                }
              );
            }
          } else {
          }
        },
        (err) => {}
      );
  }
  openAsset(ID: any) {
    if (ID) {
      const url: string = window.location.href;

      const hostAssets: string =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `Asset/card/${ID}`;
      window.open(hostAssets, '_blank');
    } else {
      this.toastr.error(
        document.dir == 'rtl' ? 'يرجى اختيار أصل' : 'Please select assets'
      );
    }
  }
}
