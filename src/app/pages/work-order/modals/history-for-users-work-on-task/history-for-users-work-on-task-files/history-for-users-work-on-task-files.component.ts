import { environment } from './../../../../../../environments/environment.prod';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-history-for-users-work-on-task-files',
  templateUrl: './history-for-users-work-on-task-files.component.html',
  styleUrls: ['./history-for-users-work-on-task-files.component.scss'],
})
export class HistoryForUsersWorkOnTaskFilesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<HistoryForUsersWorkOnTaskFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}
  Files: any;
  Avatar = environment.Avatar;

  ngOnInit(): void {
    this.Files = this.data?.map((img: any) => {
      return {
        previewImageSrc: this.Avatar + img?.FilePath,
        thumbnailImageSrc: this.Avatar + img?.FilePath,
        alt: 'Description for Image 1',
        title: 'Title 1',
      };
    });
  }
  Close() {
    this.dialogRef.close();
  }
}
