import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-movement-record',
  templateUrl: './movement-record.component.html',
  styleUrls: ['./movement-record.component.scss'],
})
export class MovementRecordComponent implements OnInit {
  @Input() dataEdit: any;
  @Input() preview: boolean = false;

  constructor() {}

  ngOnInit(): void {

    this.dataEdit.WorkOrderLogs = this.dataEdit.WorkOrderLogs?.reverse();
  }
}
