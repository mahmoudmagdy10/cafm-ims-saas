import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTask implements OnInit {
  constructor(public dialogRef: MatDialogRef<CreateTask>) {}

  ngOnInit(): void {}

  Close() {
    this.dialogRef.close();
  }
}
