import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeAssetsComponent } from '../../Tree/tree-assets/tree-assets.component';

@Component({
  selector: 'app-assets-field',
  templateUrl: './assets-field.component.html',
  styleUrls: ['./assets-field.component.scss'],
})
export class AssetsFieldComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  AssetSelected: string = '';
  AssetSelectedId: number = 0;
  @Input() AssetsMultiSelect: any;
  @Output() changeValue = new EventEmitter();
  ngOnInit(): void {}
  opentree() {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: {
        AssetsWithLazyLoading: true,
        multiSelect: this?.AssetsMultiSelect,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        if (!this?.AssetsMultiSelect) {
          this.AssetSelected = result?.AssetName;
          this.AssetSelectedId = result?.ID;
        } else {
          this.AssetSelected = result
            ?.map((value: any) => value?.AssetName)
            .join(',');
          this.AssetSelectedId = result
            ?.map((value: any) => value?.ID)
            .join(',');
        }
        this.changeValue.emit(this.AssetSelectedId)
      }
    });
  }
}
