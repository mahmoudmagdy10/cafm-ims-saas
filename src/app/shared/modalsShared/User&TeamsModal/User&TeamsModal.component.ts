import { shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { UsersAndTeamsService } from './user&TeamsModal.service';
import { confirmDeleteComponent } from '../../confirmDelete/confirmDelete.component';
@Component({
  selector: 'User-TeamsModal',
  templateUrl: 'User&TeamsModal.component.html',
  styleUrls: ['User&TeamsModal.component.scss'],
})
export class UserAndTeamsModal implements OnInit {
  @ViewChild('confirmTeams')
  confirmTeams: confirmDeleteComponent;
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
    // if (
    //   this.itemsCheckedTeams.length != 0 ||
    //   this.itemsCheckedUsers.length != 0
    // ) {
    // } else {
    //   this.toastr.error('Should Choose Users Or Teams');
    // }
    const body = {
      assignmentId:
        this.itemsCheckedTeams
          .map((value) => {
            return value.Code;
          })
          .join(',') ||
        this.itemsCheckedUsers
          .map((value) => {
            return value.Code;
          })
          .join(',')
          ? this.assignmentId
          : null,
      locationId: localStorage.getItem('defaultLocation'),
      teamIDs: this.itemsCheckedTeams
        .map((value) => {
          return value.Code;
        })
        .join(','),
      userIDs: this.itemsCheckedUsers
        .map((value) => {
          return value.Code;
        })
        .join(','),
    };
    if (!body.userIDs && !body.teamIDs) {
      this.dialogRef.close({
        AssignmentID: null,
      });
    } else {
      this.service.SaveUsersAndTeamsSelected([body], 'true').subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.dialogRef.close({
              AssignmentID: res.rv,
              itemsCheckedTeams: res.AssignmentTeamTxt,
              itemsCheckedUsers: res.AssignmentUserTxt,
              itemsCheckedTeamsIDs: this.itemsCheckedTeams,
              itemsCheckedUsersIDs: this.itemsCheckedUsers,
            });
          } else {
          }
        },
        (err) => {}
      );
    }
  }

  Close() {
    this.dialogRef.close();
  }
  confirmUserAndTeams() {
    this.confirmTeams.openModal();
  }
}
