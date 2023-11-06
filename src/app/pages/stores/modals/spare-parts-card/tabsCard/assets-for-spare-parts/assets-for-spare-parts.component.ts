import { ToastrService } from 'ngx-toastr';
import { TreeAssetsComponent } from './../../../../../../shared/components/Tree/tree-assets/tree-assets.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';

@Component({
  selector: 'app-assets-for-spare-parts',
  templateUrl: './assets-for-spare-parts.component.html',
})
export class AssetsForSparePartsComponent implements OnInit {
  Codes$: Observable<any>;
  itemEdit$: Observable<any>;
  constructor(
    private service: SparePartService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
    this.itemEdit$ = this.service.itemEdit$;
  }
  opentree(Assets: any, itemEdit: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {

      if (value) {
        const body = {
          partId: itemEdit.ID,
          assetId: value.ID,
          isManual: true,
        };

        this.service.linkPartWithAsset([body]).subscribe(
          (res: any) => {
            if (res.rv > 0) {

              var Assets = itemEdit.Assets;

              if (!Assets) {
                Assets = [];
              }
              Assets.push({
                AssetName: value?.AssetName,
                ID: res.rv,
                AssociatedDate: new Date(),
                TotalUsedQty: 0,
                IsManual: true,
              });

              this.service.updateItemEdit({ Assets: Assets });
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
  deleteLinkPartWithAsset(ID: any, itemEdit: any) {
    this.service
      .deleteLinkPartWithAsset({ AssetId: ID, PartId: itemEdit.ID })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

            const Assets = itemEdit.Assets;

            Assets.forEach((value: any, index: any) => {
              if (value.ID == ID) {
                Assets.splice(index, 1);
              }
            });

            this.service.updateItemEdit({ Assets: Assets });
          } else {

          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
  }
}
