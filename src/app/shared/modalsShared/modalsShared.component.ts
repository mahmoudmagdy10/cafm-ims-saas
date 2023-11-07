import { UserAndTeamsModal } from './User&TeamsModal/User&TeamsModal.component';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'all-modal-Shared',
  template: ''

})
export class modalsSharedComponent {
  constructor(public dialog: MatDialog) { }

  openDialog(Name:any) {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
       data: {name:Name},
       disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

