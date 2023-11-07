import { environment } from 'src/environments/environment';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MapCardComponent } from 'src/app/shared/components/google-map/dilogGoogleMapSingleMarker/map-card/map-card.component';
import { HistoryForUsersWorkOnTaskFilesComponent } from './history-for-users-work-on-task-files/history-for-users-work-on-task-files.component';

@Component({
  selector: 'app-history-for-users-work-on-task',
  templateUrl: './history-for-users-work-on-task.component.html',
  styleUrls: ['./history-for-users-work-on-task.component.scss'],
})
export class HistoryForUsersWorkOnTaskComponent implements OnInit {
  TechnicalData: any[];
  Avatar = environment.Avatar;

  constructor(
    public dialogRef: MatDialogRef<HistoryForUsersWorkOnTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.TechnicalData = this.data.TechnicalData;

  }
  openMap(item: any) {


    const dataForMAp = {
      Longitude: item.Lan,
      Latitude: item.Lat,
      Zoom: 12,
      Name: item.StatusTitle,
      canNotEdit: true,
      infoWindowContext: `<div class="d-flex align-items-center"> <div
      class="symbol symbol-35px symbol-circle mx-2"
      style="cursor: pointer"
    >
      <div
        class="symbol-label"
        style="background-image:url('${this.Avatar}${item?.TechnicalAvatar}')"
       >
     </div>
      </div> ${item?.TechnicalName}</div>
      <div class="mt-2">${item?.TrackDate} | ${item?.TrackTime}</div>
      `,
    };
    const dialogRef = this.dialog.open(MapCardComponent, {
      width: '50vw',
      data: dataForMAp,
      disableClose: true,
    });
  }
  showFiles(files:any[]){
    const dialogRef = this.dialog.open(HistoryForUsersWorkOnTaskFilesComponent, {
      width: '50vw',
      data: files,
      disableClose: true,
    });
  }
  Close() {
    this.dialogRef.close();
  }
}
