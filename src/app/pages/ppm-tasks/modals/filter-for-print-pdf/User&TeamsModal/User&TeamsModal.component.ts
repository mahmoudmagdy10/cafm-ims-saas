import { shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { UsersAndTeamsService } from './user&TeamsModal.service';
@Component({
  selector: 'User-TeamsModal',
  templateUrl: 'User&TeamsModal.component.html',
  styleUrls: ['User&TeamsModal.component.scss'],
})
export class UserAndTeamsModal implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UserAndTeamsModal>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    public service: UsersAndTeamsService,
    private toastr: ToastrService
  ) {}

  SearchLocationTeams = new UntypedFormControl();
  SearchLocationUsers = new UntypedFormControl();
  itemsCheckedTeams: Array<{ Code: string; Name: any }> = [];
  itemsCheckedUsers: Array<{ Code: string; Name: any }> = [];
  assignmentId: number = 0;
  DataUsersAndTeams$: Observable<any>;
  ngOnInit(): void {
    this.EditAssigment();
  }
  EditAssigment() {
    this.assignmentId = this.Data.AssignmentID;
    this.DataUsersAndTeams$ = this.service
      .getUsersAndTeamsByAsID(this.Data.AssignmentID)
      .pipe(shareReplay(1));
    this.DataUsersAndTeams$.subscribe((value) => {
      if (value.Teams) {
        value.Teams.forEach((element: any) => {
          if (element.Checked) {
            this.itemsCheckedTeams.push({
              Code: element.Code,
              Name: element.Name,
            });
          }
        });
      }
      if (value.Users) {
        value.Users.forEach((element: any) => {
          if (element.Checked) {
            this.itemsCheckedUsers.push({
              Code: element.Code,
              Name: element.Name,
            });
          }
        });
      }
    });
  }
  selectLocationTeams(item: any, index: number) {
    if (this.itemsCheckedUsers && this.itemsCheckedUsers.length > 0) {
      this.toastr.error('you can`t select users and Teams in same Time');
    } else {
      item.Checked = !item.Checked;
      if (item.Checked == true) {
        this.itemsCheckedTeams.push({ Code: item.Code, Name: item.Name });
      } else {
        this.itemsCheckedTeams.forEach((value: any, index: any) => {
          if (value.Code == item.Code) {
            this.itemsCheckedTeams.splice(index, 1);
          }
        });
      }
    }
  }
  selectLocationUsers(item: any, index: number) {
    if (this.itemsCheckedTeams && this.itemsCheckedTeams.length > 0) {
      this.toastr.error('you can`t select users and Teams in same Time');
    } else {
      item.Checked = !item.Checked;
      if (item.Checked == true) {
        this.itemsCheckedUsers.push({ Code: item.Code, Name: item.Name });
      } else {
        this.itemsCheckedUsers.forEach((value: any, index: any) => {
          if (value.Code == item.Code) {
            this.itemsCheckedUsers.splice(index, 1);
          }
        });
      }
    }
  }
  onSave() {
    if (
      this.itemsCheckedTeams.length != 0 ||
      this.itemsCheckedUsers.length != 0
    ) {
      const teamIDs= this.itemsCheckedTeams
      .map((value) => {
        return value.Code;
      });
    const userIDs = this.itemsCheckedUsers
      .map((value) => {
        return value.Code;
      })
      const body = {
        // assignmentId: this.assignmentId,
        locationId: localStorage.getItem('defaultLocation'),
        Ids: [...teamIDs, ...userIDs]
      };
      this.service.getUsersAndTeamsSelectedJobtitles(body);
      this.service.userSignatures$.subscribe((res:any)=> {
          this.dialogRef.close({result: res.Data, itemsCheckedUsers: this.itemsCheckedUsers });
      });
    } else {
      this.toastr.error('Should Choose Users Or Teams');
    }
  }

  Close() {
    this.dialogRef.close();
  }
  
  // ngOnDestroy(): void {
  //   this.service.userSignatures$.unsubscribe();
  // }
}
