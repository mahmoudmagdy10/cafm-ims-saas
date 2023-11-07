import { environment } from './../../../../../environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';
import { cardAssetsModalComponent } from './../../cardAsset/cardAssetByModal/cardAssetModal.component';
import { tap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { assetsScreenService } from '../../assetsScreen.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-as-map',
  templateUrl: './display-as-map.component.html',
  styleUrls: ['./display-as-map.component.scss'],
})
export class DisplayAsMapComponent implements OnInit {
  options: any;
  Avatar = environment.Avatar;
  overlays: any[] = [];
  AssetsForDisplayMap$: Observable<any>;
  constructor(
    private _assetsScreenService: assetsScreenService,
    private dialog: MatDialog
  ) {}
  DataAssets: any = [];
  ngOnInit(): void {
    this.AssetsForDisplayMap$ =
      this._assetsScreenService.dataForMap$.pipe(
        tap((value: any) => {
          if (value) {
            this.DataAssets = value;
            this.options = {
              center: { lat: +value[0]?.Latitude|| 29.378586, lng: +value[0]?.Longitude|| 47.990341, },
              zoom: 10,
            };
            value.forEach((asset: any) => {
              if (asset?.Latitude) {
                this.overlays.push(
                  new google.maps.Marker({

                    position: { lat: +asset?.Latitude, lng: +asset?.Longitude },
                    title: asset?.AssetName + ' #' + asset?.ID,
                    // icon: {
                    //   url: this.Avatar + asset.ImagePath,
                    //   scaledSize: { height: 40, width: 40, equals: () => true },
                    // },
                  })
                );
              }
            });
          }
        })
      );
  }
  handleOverlayClick(item: any) {
    let assetSelectedID = this.DataAssets.find(
      (value: any) => value.ID == item?.overlay?.title.split('#')[1]
    )?.ID;
    if (assetSelectedID) {
      this.assetCard(assetSelectedID);
    }
  }
  assetCard(assetSelectedID: any) {
    const dialogRef = this.dialog
      .open(cardAssetsModalComponent, {
        width: '85vw',
        maxWidth: '85vw',
        data: {
          ID: assetSelectedID,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
}
