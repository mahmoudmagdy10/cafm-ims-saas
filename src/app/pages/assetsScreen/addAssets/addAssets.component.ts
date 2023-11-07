import { AddImageAssetComponent } from './add-image-asset/add-image-asset.component';
import { assetsScreenService } from './../assetsScreen.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TreeAssetsComponent } from '../../../shared/components/Tree/tree-assets/tree-assets.component';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { tap } from 'rxjs/operators';
import { Observable, observable } from 'rxjs';

@Component({
  selector: 'add-assets',
  templateUrl: 'addAssets.component.html',
})
export class addAssetsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<addAssetsComponent>,
    private service: assetsScreenService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  imageAsset: any;
  perantName: any;
  itemsCheckedTeams: any;
  itemsCheckedUsers: any;
  codes$: Observable<any>;
  isLocation: any;
  addAssetsForm = new UntypedFormGroup({
    assetName: new UntypedFormControl(null, Validators.required),
    categoryId: new UntypedFormControl(null, Validators.required),
    weeklyOperationHours: new UntypedFormControl(),
    insertedDate: new UntypedFormControl(new Date()),
    wrAssignmentId: new UntypedFormControl(null),
    isSimilarityContainer: new UntypedFormControl(),
    isAsset: new UntypedFormControl(),
    notes: new UntypedFormControl(),
    parentId: new UntypedFormControl(),
    assetCost: new UntypedFormControl(),
  });
  ngOnInit() {
    this.isLocation = this.data?.isLocation;
    if (!this.data?.isLocation) {
      this.addAssetsForm.get('isAsset')?.setValue(true);
    }
    this.dialogRef.disableClose = true;

    this.codes$ = this.service.codes$.pipe(
      tap((CodesPage) => {
        if (CodesPage) {
          this.addAssetsForm
            .get('weeklyOperationHours')
            ?.setValue(CodesPage?.WorkingHours?.Name);
        }
      })
    );
    this.addAssetsForm.get('parentId')?.setValue(this.data?.ParentData?.ID);
  }

  onSave() {
    if (this.addAssetsForm.valid) {
      const body = {
        locationId:
          this.data?.ParentData?.LocationId ||
          localStorage.getItem('defaultLocation'),

        ...this.addAssetsForm.value,
      };
      this.service.addAssets(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            if (this.imageAsset) this.saveImg(res.rv);
            this.dialogRef.close(res?.Data);
          } else {
          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }

  Close() {
    this.dialogRef.close();
  }
  openChooseImage() {
    const dialogRef = this.dialog.open(AddImageAssetComponent, {
      width: '50vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.imageAsset = result;
      }
    });
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
        this.addAssetsForm.get('parentId')?.setValue(result.ID);
        this.perantName = result?.label;
      }
    });
  }
  saveImg(idAsset: any) {
    const body = {
      AssetId: idAsset,
      Image: this.imageAsset.fileToReturn,
    };
    this.service.addImageForAsset(body).subscribe();
  }

  openDialog() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER', // {{ "WORKTEAMS.CARDHEADER" | translate }}
        AssignmentID: this.addAssetsForm.controls['wrAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAssetsForm.controls['wrAssignmentId'].setValue(
          result.AssignmentID
        );
        this.itemsCheckedTeams = result.itemsCheckedTeams;
        this.itemsCheckedUsers = result.itemsCheckedUsers;
      }
    });
  }
  reloadCodes() {
    this.service.getCodeAssets();
  }
  ArrayToString(CodesPage: any) {
    if (CodesPage) {
      return CodesPage.map((value: any) => {
        return value.Name;
      }).join(' , ');
    }
  }
}
