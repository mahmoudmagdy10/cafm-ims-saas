import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';

@Component({
  selector: 'app-inventory-managment',
  templateUrl: './inventory-managment.component.html',
})
export class InventoryManagmentComponent implements OnInit, OnChanges {
  @Input() storeMangmentForm: any;
  @Input() partsStorageManagementEditPermission: boolean;
  itemEdit$: Observable<any>;

  constructor(private dialog: MatDialog, private service: SparePartService) {}
  ThresholdAssignmentTeamTxt: any[] = [];
  ThresholdAssignmentUserTxt: any[] = [];
  ngOnInit(): void {
    this.itemEdit$ = this.service.itemEdit$.pipe(
      tap((value) => {
        if (value) {
          this.ThresholdAssignmentTeamTxt = value.ThresholdAssignmentTeamTxt;
          this.ThresholdAssignmentUserTxt = value.ThresholdAssignmentUserTxt;
        }
      })
    );
  }
  ngOnChanges(): void {
    if(!this.partsStorageManagementEditPermission){
      setTimeout(()=> {
        const MaxThreshold = document.getElementById('MaxThreshold');
        const MinThreshold = document.getElementById('MinThreshold');
        if (MinThreshold && MaxThreshold) {
          MaxThreshold.setAttribute('disabled', 'disabled');
          MinThreshold.setAttribute('disabled', 'disabled');
        }
      }, 500)
    }
  }
  get form() {
    return this.storeMangmentForm.value;
  }

  chooseAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.storeMangmentForm.controls['ThresholdAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.storeMangmentForm.controls['ThresholdAssignmentId'].setValue(
          result.AssignmentID
        );
        this.ThresholdAssignmentTeamTxt = result.itemsCheckedTeams;
        this.ThresholdAssignmentUserTxt = result.itemsCheckedUsers;
      }
    });
  }
  ArrayToString(CodesPage: any) {
    if (CodesPage) {
      return CodesPage.map((value: any) => {
        return value.Name;
      }).join(' , ');
    }
  }
}
