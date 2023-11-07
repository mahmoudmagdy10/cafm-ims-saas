import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { TemplatesForSopService } from '../../TemplatesForSop.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'addSopTemplate',
  templateUrl: 'addSopTemplate.component.html',
  styleUrls: ['./addSopTemplate.component.scss'],
})
export class addSopTemplate implements OnInit {
  formAddPmTask: UntypedFormGroup;
  Muints: any = [];
  Hours: any = [];
  itemsCheckedTeams: any[];
  itemsCheckedUsers: any[];
  AssetSelected: any;
  codes$: Observable<any>;
  ScheduleType: { code: number; Name: string }[]=[];

  constructor(
    public dialogRef: MatDialogRef<addSopTemplate>,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private service: TemplatesForSopService,
    private translateService: TranslateService
  ) {
    this.ScheduleType = [
    { code: 0, Name: this.translateService.instant('DAILY') },
    { code: 1, Name: this.translateService.instant('WEEKLY') },
    { code: 2, Name: this.translateService.instant('MONTHLY') },
    { code: 3, Name: this.translateService.instant('QUARTERLY') },
    { code: 4, Name: this.translateService.instant('HALF_YEARLY') },
    { code: 5, Name: this.translateService.instant('YEARLY') },
  ];
    this.formAddPmTask = this.fb.group({
      TaskName: ['', Validators.required],
      TaskDescription: [],
      AssetId: [],
      TaskAssignmentId: [],
      EstimatedTimeH: ['0'],
      EstimatedTimeM: ['0'],
      TagsId: [],
      PriorityId: [],
      IsStackedPM: [],
      ScheduleTypeId: [],
    });
  }

  ngOnInit(): void {
    this.codes$ = this.service.CodeObz$;
    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
  }

  chooseAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.formAddPmTask.controls['TaskAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formAddPmTask.controls['TaskAssignmentId'].setValue(
          result.AssignmentID
        );
        this.itemsCheckedTeams = result.itemsCheckedTeams;
        this.itemsCheckedUsers = result.itemsCheckedUsers;
      }
    });
  }
  chooseAsset(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.formAddPmTask.controls['AssetId'].setValue(result.ID);
      }
    });
  }
  ArrayToString(data: any) {
    if (data) {
      return data
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
    }
  }

  addNewPms() {
    if (this.formAddPmTask.valid) {
      const body = {
        ...this.formAddPmTask.value,
        TagsId: JSON.stringify(this.formAddPmTask.controls['TagsId'].value),
        EstimatedTime: Math.ceil(
          +this.formAddPmTask.controls['EstimatedTimeH'].value * 60 +
            +this.formAddPmTask.controls['EstimatedTimeM'].value
        ),
      };

      this.service.addNewPms(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.dialogRef.close('onSave');
          } else {
          }
        },
        (err) => {}
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
}
