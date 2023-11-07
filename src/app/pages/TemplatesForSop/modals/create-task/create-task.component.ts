import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskForTemplateSop implements OnInit {
  private audio = new Audio('./../../assets/sounds/tweet.mp3');

  constructor(
    public dialogRef: MatDialogRef<CreateTaskForTemplateSop>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.play();
  }
  Close() {
    this.dialogRef.close();
  }
  play() {
    // this.audio

    this.audio.play();
  }
}
