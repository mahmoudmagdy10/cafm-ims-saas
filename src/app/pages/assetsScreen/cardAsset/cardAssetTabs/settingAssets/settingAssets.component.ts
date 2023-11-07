import { assetsScreenService } from './../../../assetsScreen.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';

@Component({
  selector: 'setting-assets',
  templateUrl: 'settingAssets.component.html',
})
export class settingAssetsComponent implements OnChanges {
  @Input() data: any;
  @Input() code: any;
  @Output() EditInAssets = new EventEmitter();
  isChange: boolean = false;
  itemsCheckedTeams: any[] = [];
  itemsCheckedUsers: any[] = [];
  dataLocations: any[];
  constructor(
    public assetsService: assetsScreenService,
    public dialog: MatDialog
  ) {
    let locations = localStorage.getItem('locations');
    if (locations) {
      this.dataLocations = JSON.parse(locations);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.itemsCheckedTeams = this.data.WRAssignmentTeamTxt;
      this.itemsCheckedUsers = this.data.WRAssignmentUserTxt;
    }
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
  openDialog() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.data.WRAssignmentId,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.WRAssignmentId = result.AssignmentID;
        this.itemsCheckedTeams = result.itemsCheckedTeams;
        this.itemsCheckedUsers = result.itemsCheckedUsers;
      }
    });
  }
}
