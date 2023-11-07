import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-maintenance-time',
  templateUrl: './maintenance-time.component.html',
  styleUrls: ['./maintenance-time.component.scss'],
})
export class MaintenanceTimeComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  @Input() dataEdit: any;
  @Input() preview: any;

  time: number = 0;
  display: any;
  interval: any;
  stop: boolean = true;
  @Output() timeConsuming: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    if (this.dataEdit.TaskStatusId != 3) {
      this.startTimer();
    }
  }

  startTimer() {
    this.stop = true;
    this.interval = setInterval(() => {
      this.time++;
      this.display = this.transform(this.time);
    }, 1000);
  }
  transform(value: number): string {
    var sec_num = value;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    // if (hours < 10) {
    //   hours = 0;
    // }
    // if (minutes < 10) {
    //   minutes = 0;
    // }
    // if (seconds < 10) {
    //   seconds = 0;
    // }
    return hours + ':' + minutes + ':' + seconds;
  }
  pauseTimer() {
    this.stop = false;
    clearInterval(this.interval);
  }
  clearTimer() {
    this.time = 0;
  }
}
