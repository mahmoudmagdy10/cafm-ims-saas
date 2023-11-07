import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ViewAsTreeComponent } from 'src/app/pages/assetsScreen/table-assets/view-as-tree/view-as-tree.component';

@Component({
  selector: 'single-select-tree-assets',
  templateUrl: './tree-assets.component.html',
})
export class TreeAssetsLocationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TreeAssetsLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toster: ToastrService,
    private translate: TranslateService
  ) {}
  itemSelected: any;
  @ViewChild('TreeForDynamic') TreeForDynamic: ViewAsTreeComponent;
  ngOnInit(): void {}

  onSave() {
    console.log(
      'this.TreeForDynamic?.selectedFile',
      this.TreeForDynamic?.selectedFile
    );
    if (this.itemSelected && !this.data?.AssetsWithLazyLoading) {
      this.dialogRef.close(this.itemSelected);
    } else if (this.TreeForDynamic?.selectedFile) {
      if (
        this.TreeForDynamic?.selectedFile?.isAsset ||
        // (this.TreeForDynamic?.selectedFile.isAsset) ||
        this.cheakArrayIsAssets(this.TreeForDynamic?.selectedFile) ||
        this.data?.canChooseSubLocation
      ) {
        this.dialogRef.close(this.TreeForDynamic?.selectedFile);
      } else {
        this.dialogRef.close(this.TreeForDynamic?.selectedFile);
      }
    } else {
      this.toster.error(
        document.dir == 'rtl' ? 'يجب تحديد أصل' : 'Please select an asset'
      );
    }
  }
  Close() {
    this.dialogRef.close();
  }
  // viewAssets(test: any) {}
  cheakArrayIsAssets(Assets: any) {
    if (Array.isArray(Assets)) {
      return !Assets.some((value: any) => !value?.isAsset);
    } else {
      return false; // Return false for non-array inputs
    }
  }
}
