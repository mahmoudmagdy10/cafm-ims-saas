import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs/operators';
import { TemplatesForSopService } from 'src/app/pages/TemplatesForSop/TemplatesForSop.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-basic-data-SopTemplate',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss'],
})
export class BasicDataSopTemplateComponent implements OnInit {
  formEditTask: UntypedFormGroup;
  @Input() itemEdit: any;
  AssetInfo = { label: '', ID: 0 };
  Muints: any = [];
  Hours: any = [];
  itemsCheckedTeams: any[];
  itemsCheckedUsers: any[];
  AssetSelected: any;
  codes$: Observable<any>;
  ScheduleType: { code: number; Name: string }[] = [];
  constructor(
    private fb: UntypedFormBuilder,
    private service: TemplatesForSopService,
    public dialog: MatDialog,
    private toastr: ToastrService,
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
    this.formEditTask = this.fb.group(
      {
        ID: [],
        TaskName: [],
        TaskDescription: [],
        AssetId: [],
        TaskAssignmentId: [],
        EstimatedTimeH: [],
        EstimatedTimeM: [],
        TagsId: [],
        PriorityId: [],
        IsStackedPM: [],
        ScheduleTypeId: [],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {
    this.codes$ = this.service.CodeObz$.pipe(
      tap((res) => {
        if (res?.PagePermissions?.PMEdit) {
          this.formEditTask.enable({ emitEvent: false });
        } else {
          this.formEditTask.disable({ emitEvent: false });
        }
        if (res?.PagePermissions?.PMPriorityEdit) {
          this.formEditTask.get('PriorityId')?.enable({ emitEvent: false });
        } else {
          this.formEditTask.get('PriorityId')?.disable({ emitEvent: false });
        }
      })
    );
    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
    this.ReturnDataToForm();
    this.Edit();
  }
  Edit() {
    const Save$ = this.formEditTask.valueChanges.pipe(
      switchMap((value: any) => {
        return this.service.addNewPms({
          ...value,
          TagsId: JSON.stringify(value.TagsId),
          EstimatedTime: Math.ceil(
            Number(value.EstimatedTimeH * 60) + Number(value.EstimatedTimeM)
          ),
        });
      })
    );
    Save$.subscribe(
      (res: any) => {
        if (res.rv > 0) {
        } else {
        }
      },
      (err) => {}
    );
  }
  ReturnDataToForm() {
    this.formEditTask.patchValue({
      ...this.itemEdit,
      ScheduleTypeId: this.itemEdit.ScheduleTypeId,
    });
    var hours = Math.floor(this.itemEdit.EstimatedTime / 60);
    var minutes = this.itemEdit.EstimatedTime % 60;
    this.formEditTask.controls['EstimatedTimeH'].setValue(hours);
    this.formEditTask.controls['EstimatedTimeM'].setValue(minutes);
    this.AssetInfo.label = this.itemEdit.AssetName;
    this.AssetInfo.ID = this.itemEdit.AssetId;
    this.AssetSelected = this.itemEdit.AssetName;
    this.itemsCheckedTeams = this.itemEdit.TaskAssignmentTeamTxt;
    this.itemsCheckedUsers = this.itemEdit.TaskAssignmentUserTxt;
  }

  chooseAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.formEditTask.controls['TaskAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formEditTask.controls['TaskAssignmentId'].setValue(
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
      data: { data: Assets, AssetInfo: this.AssetInfo || null },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.formEditTask.controls['AssetId'].setValue(result.ID);
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
}
