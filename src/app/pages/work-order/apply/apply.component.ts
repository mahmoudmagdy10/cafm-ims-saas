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
  InternalNumber: any;
  RequestDescription: any;
  ngOnInit(): void {
    this.pageDirection = document.dir;
    const nameAndNumberTask = this.data.Msg.split('>')[1];
    const nameTask = nameAndNumberTask.split(':')[1];
    const NumberTask = nameAndNumberTask.split(':')[0];
    this.InternalNumber = NumberTask;
    this.RequestDescription = this.data.TaskDescription;
  }
  close(action?: string) {
    this.dialogRef.close({ action: action, data: {...this.data,InternalNumber:this.InternalNumber} });
  }
}
