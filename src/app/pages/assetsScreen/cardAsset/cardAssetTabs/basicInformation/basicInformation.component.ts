import { environment } from 'src/environments/environment';
import { MapCardComponent } from '../../../../../shared/components/google-map/dilogGoogleMapSingleMarker/map-card/map-card.component';
import { TreeAssetsComponent } from '../../../../../shared/components/Tree/tree-assets/tree-assets.component';
import { CardImageComponent } from './../../cardAssetModals/card-image/card-image.component';
import { BehaviorSubject } from 'rxjs';
import { HistoryFieldComponent } from './../../cardAssetModals/HistoryField/HistoryField.Component';
import { ToastrService } from 'ngx-toastr';
import { assetsScreenService } from './../../../assetsScreen.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'basic-information',
  templateUrl: 'basicInformation.component.html',
})
export class basicInformationComponent implements OnChanges {
  @Input() data: any;
  @Input() code: any;
  imgAssets: string;
  @Output() EditInAssets = new EventEmitter();
  isChange: boolean = false;
  FieldIdDeleted: any;
  LoadingField: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  Avatar = environment.Avatar;
  ParentAssetName: any;
  defaultImageUrl: string = 'assets/media/avatars/factory-machine.png';
  constructor(
    public dialog: MatDialog,
    public assetsService: assetsScreenService,
    private toastr: ToastrService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.data.ImagePath) {
        this.imgAssets = this.Avatar + this.data.ImagePath;
      } else {
        this.imgAssets = '';
      }

      if (!this.data.AssetsFields) {
        this.data.AssetsFields = [];
      }
    }
  }

  AddCardImage() {
    const dialogRef = this.dialog.open(CardImageComponent, {
      width: '30vw',
      data: { idAsset: this.data.ID },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.imgAssets = result?.imagePath;
    });
  }

  SaveNewValue(idField: any, newValue: any) {
    const body = {
      ComponentId: this.data.ID,
      fieldsData: [
        {
          fieldId: idField,
          value: newValue,
        },
      ],
    };
    this.assetsService.addFieldAsset(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
        } else {
        }
      },
      (err) => {}
    );
  }
  SaveNewValueFlie(idField: any, newValue: any, index: any) {
    const body = {
      ComponentId: this.data.ID,
      FieldId: idField,
      Value: newValue,
    };
    this.assetsService.addFieldFileAsset(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          res.output.Data.forEach((element: any) => {
            this.data.AssetsFields[index].Files.push(element);
          });
        } else {
        }
      },
      (err) => {}
    );
  }
  archiveValues(ID: any, type: any) {
    const dialogRef = this.dialog.open(HistoryFieldComponent, {
      width: '50vw',
      data: { ComponentId: this.data.ID, FieldId: ID, FieldType: type },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  deleteFieldInAsset() {
    this.LoadingField.next(true);
    this.assetsService
      .deleteFieldInAsset({
        ComponentId: this.data.ID,
        FieldId: this.FieldIdDeleted,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.data.AssetsFields.forEach((value: any, index: any) => {
              if (value.FieldId == this.FieldIdDeleted) {
                this.data.AssetsFields.splice(index, 1);
              }
            });
            this.LoadingField.next(false);
          } else {
          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
  }
  opentree() {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: {
        canChooseSubLocation: true,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.ID == this.data.ID) {
          this.toastr.error(
            'Not permitted to add a sub-asset to the same asset.'
          );
        } else {
          if (this.data.Childen) {
            if (confirm('All the sub asset will be moved with this action')) {
              this.data.parentId = result.ID;
              this.EditInAssets.emit();
            }
          } else {
            this.ParentAssetName = result.label;
            this.data.parentId = result.ID;
            this.EditInAssets.emit();
          }
        }
      }
    });
  }
  openMap() {
    const dialogRef = this.dialog.open(MapCardComponent, {
      width: '50vw',
      data: {
        ...this.data,
        Name: this.data.AssetsName,
        CenterLongitude: this.data?.loc_log_atitude[0]?.Longitude,
        CenterLatitude: this.data?.loc_log_atitude[0]?.Latitude,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.Longitude = result.Longitude;
        this.data.Latitude = result.Latitude;
        this.data.Zoom = result.Zoom;
        this.EditInAssets.emit();
      }
    });
  }
  ChangeFieldShown(index: number, IsShown: boolean, IDField: any) {
    this.assetsService
      .ChangeFieldShown({
        ComponentId: this.data.ID,
        FieldId: IDField,
        isShown: !IsShown,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.data.AssetsFields[index].IsShown = !IsShown;
          } else {
          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
  }
  get loadingField$() {
    return this.LoadingField.asObservable();
  }
  DuplicateAsset() {
    this.assetsService.DuplicateAsset(this.data.ID).subscribe((rv) => {});
  }
  
  consoleLog() {
  }
}
