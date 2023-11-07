import { ToastrService } from 'ngx-toastr';
import { assetsScreenService } from './../../../assetsScreen.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';

@Component({
  selector: 'depreciation',
  templateUrl: 'depreciation.component.html',
})
export class depreciationComponent implements OnChanges, OnInit {
  constructor(
    public assetsService: assetsScreenService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}
  IsEdit: boolean = false;
  @Output() EditInAssets = new EventEmitter();

  ngOnInit(): void {
    this.formDepreciation.valueChanges.subscribe((value) => {
      this.IsEdit = true;
    });
  }
  @Input() data: any;
  @Input() code: any;
  formDepreciation = new UntypedFormGroup({
    AssetId: new UntypedFormControl(),
    PurchaseCost: new UntypedFormControl(),
    SalvageValue: new UntypedFormControl(),
    UsefulLife: new UntypedFormControl(),
    DepreciationStartDate: new UntypedFormControl(),
    DepreciationTaskAssignmentId: new UntypedFormControl(),
  });
  IsDepreciationEnabled = new UntypedFormControl();
  itemsCheckedTeams: any[] = [];
  itemsCheckedUsers: any[] = [];
  valueViewTeamsAndUser: any[];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.data.AssetsCapitalDepreciation.length > 0) {
        this.formDepreciation.patchValue(
          this.data.AssetsCapitalDepreciation[0]
        );
        this.itemsCheckedTeams =
          this.data.AssetsCapitalDepreciation[0].DepreciationTaskAssignmentTeamTxt;
        this.itemsCheckedUsers =
          this.data.AssetsCapitalDepreciation[0].DepreciationTaskAssignmentUserTxt;
      }
      this.diabledOrEnabledDepreciation(this.data.IsDepreciationEnabled, true);
      this.IsDepreciationEnabled.setValue(this.data.IsDepreciationEnabled);
      this.formDepreciation.get('AssetId')?.setValue(this.data.ID);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.formDepreciation.controls['DepreciationTaskAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.formDepreciation.controls['DepreciationTaskAssignmentId'].setValue(
          result.AssignmentID
        );
        this.itemsCheckedTeams = result.itemsCheckedTeams;
        this.itemsCheckedUsers = result.itemsCheckedUsers;
        this.saveChange();
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
  saveChange() {
    if (this.IsEdit) {
      this.assetsService
        .saveCapitalDepreciation({
          ...this.formDepreciation.value,
        })
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {

            } else {

            }
          },
          (err) => {

          }
        );
    }
    this.IsEdit = false;
  }

  diabledOrEnabledDepreciation(event: any, noRequest?: boolean) {
    console.log(
      'this.data.IsDepreciationEnabled',
      this.data.IsDepreciationEnabled
    );
    this.data.IsDepreciationEnabled = event;
    if (event) {
      this.formDepreciation.enable();
    } else {
      this.formDepreciation.disable();
    }
    if (!noRequest) {
      this.EditInAssets.emit();
    }
  }
}
