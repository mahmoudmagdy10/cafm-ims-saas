import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs/operators';
import { SopTemplateCard } from 'src/app/pages/TemplatesForSop/modals/SopTemplateCard/SopTemplateCard.component';

@Component({
  selector: 'app-basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.scss'],
})
export class BasicDataComponent implements OnInit {
  formEditTask: UntypedFormGroup;
  @Input() itemEdit: any;
  AssetInfo = { label: '', ID: 0 };
  Muints: any = [];
  Hours: any = [];
  sopOptions: any = [];
  itemsCheckedTeams: any[];
  itemsCheckedUsers: any[];
  AssetSelected: any;
  codes$: Observable<any>;
  @Output() handleSelectSop: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: UntypedFormBuilder,
    private service: PmsService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
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
        SelectedSOP: [],
        IsStackedPM: [],
      },
      { updateOn: 'blur' }
    );
  }

  ngOnInit(): void {
    this.codes$ = this.service.CodeObz$.pipe(
      tap((res) => {
        console.log('codes', res);
        this.sopOptions = res.SOP;
        console.log('sopOptions: ', this.sopOptions);
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
    console.log('12345', this.itemEdit);
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
    this.formEditTask.patchValue(this.itemEdit);
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
  openAsset() {
    const AssetId = this.formEditTask.controls['AssetId']?.value;
    if (AssetId) {
      const url: string = window.location.href;

      const hostAssets: string =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `Asset/card/${AssetId}`;
      window.open(hostAssets, '_blank');
    } else {
      this.toastr.error(
        document.dir == 'rtl' ? 'يرجى اختيار أصل' : 'Please select assets'
      );
    }
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

  viewSOP(){
    console.log('sop view', this.formEditTask?.controls['SelectedSOP']?.value);
    const sopId = this.formEditTask?.controls['SelectedSOP']?.value;
    this.service.getCodePms();
    const dialogRef = this.dialog
    .open(SopTemplateCard, {
      width: '70vw',
      data: { ID: sopId, isCommingFromPPMTask: true },
      disableClose: true,
    })
    .addPanelClass('cmms-custom-modal');
  }
  handleSelectedSop(){
    this.handleSelectSop.emit(this.formEditTask?.controls['SelectedSOP']?.value || 1);
  }
}
