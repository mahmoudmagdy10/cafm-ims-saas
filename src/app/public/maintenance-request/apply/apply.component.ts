import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ApplyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  pageDirection: any;
  dataTask: any;
  WRTitleOptionId: number;
  ngOnInit(): void {
    this.dataTask = this.data.data;
    this.WRTitleOptionId = this.data.WRTitleOptionId;
    this.pageDirection = this.data.pageDirection;
  }
  close() {
    this.dialogRef.close();
  }
}
