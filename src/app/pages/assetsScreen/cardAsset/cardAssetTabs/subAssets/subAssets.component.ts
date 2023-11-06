import { ViewAsTreeComponent } from './../../../table-assets/view-as-tree/view-as-tree.component';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChildComponent } from '../../cardAssetModals/AddChild/AddChild.component';

@Component({
  selector: 'sub-assets',
  templateUrl: 'subAssets.component.html',
})
export class subAssetsComponent implements AfterViewInit {
  constructor(public dialog: MatDialog) {}
  ngAfterViewInit(): void {
    // this.viewAsTree.getTree();
  }
  @Input() data: any;
  @Input() code: any;
  @ViewChild('viewAsTree') viewAsTree: ViewAsTreeComponent;

  addChild() {
    const dialogRef = this.dialog.open(AddChildComponent, {
      width: '70vw',
      data: {
        code: this.code,
        PerantName: this.data.AssetName,
        dataEdit: this.data,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
}
