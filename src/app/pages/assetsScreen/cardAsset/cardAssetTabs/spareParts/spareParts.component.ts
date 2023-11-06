import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestSparePartComponent } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/request-spare-part/request-spare-part.component';
import { assetsScreenService } from '../../../assetsScreen.service';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { StoreCard } from 'src/app/pages/stores/modals/spare-parts-card/spare-parts-card.component';

@Component({
  selector: 'spare-parts',
  templateUrl: 'spareParts.component.html',
})
export class sparePartsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public assetsService: assetsScreenService,
    private toastr: ToastrService,
    private _SparePartService: SparePartService
  ) {}
  parts: any = [];
  @Input() data: any;

  ngOnInit(): void {}
  AddSparePart() {
    const dialogRef = this.dialog
      .open(RequestSparePartComponent, {
        width: '60vw',
        data: {
          noQuantity: true,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value: any[]) => {
      if (value) {
        this.parts = [
          ...this.parts,
          ...value.map((value) => {
            return {
              partId: value.partId,
            };
          }),
        ];
        this.assetsService
          .linkpartWithAsset(
            this.parts.map((value: any) => {
              return {
                ...value,
                assetId: this.data.ID,
              };
            })
          )
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                if (!this.data.AssetsParts) {
                  this.data.AssetsParts = [];
                }
                this.data.AssetsParts = [...this.data.AssetsParts, ...res.data];
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
  deleteSparePart(PartId: any) {
    this.assetsService
      .deleteSparePart({ PartId: PartId, AssetId: this.data.ID })
      .subscribe(
        (res: any) => {
          if (res) {
            this.data.AssetsParts.forEach((element: any, index: any) => {
              if (element.PartId == PartId) {
                this.data.AssetsParts.splice(index, 1);
              }
            });
          } else {
          }
        },
        (err) => {}
      );
  }
  SparePartCard(ID: any) {
    this._SparePartService.getItemEdit(ID);
    this._SparePartService.getTransactions();
    this._SparePartService.getCodes();
    const dialogRef = this.dialog
      .open(StoreCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
}
