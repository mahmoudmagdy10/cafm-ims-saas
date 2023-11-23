import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { PmsService } from '../../pms.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-card-copy',
  templateUrl: 'pm-card.component.html',
})
export class PMcardCopy implements OnInit {
  itemEdit$: Observable<any>;
  CodeObz$: Observable<any>;
  selectedSop: any = null;
  AssetSelected: any;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PMcardCopy>,
    private service: PmsService,
    private toastr: ToastrService,

    @Inject(MAT_DIALOG_DATA) public dataPmCard: any
  ) {}

  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$;
    this.itemEdit$ = this.service.getPmsAsId(this.dataPmCard.ID).pipe(
      map((value) => {
        return { ...value[0], TagsId: JSON.parse(value[0].TagsId) };
      })
    );
    this.service.PMSIdOpened = this.dataPmCard.ID;
    this.service.getInStruction();
  }
  get IsUpComing() {
    return this.dataPmCard.upComingTab;
  }
  Close() {
    this.dialogRef.close();
  }
  opentree(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets, multiSelect: true },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.map((item: any) => item.ID);
        this.service.PMDuplicateForListAssets({
          ListAssetIDs: this.AssetSelected,
        });
      }
    });
  }
  handleSelectedSop(event: any) {
    this.selectedSop = event;
  }
}
