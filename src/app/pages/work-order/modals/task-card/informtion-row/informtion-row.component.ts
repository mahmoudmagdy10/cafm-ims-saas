import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { workOrderService } from '../../../workOrder.service';

@Component({
  selector: 'app-informtion-row',
  templateUrl: './informtion-row.component.html',
  styleUrls: ['./informtion-row.component.scss'],
})
export class InformtionRowComponent implements OnInit {
  @Input() dataEdit: any;

  constructor(private service: workOrderService) {}

  ArrayToString(data: any) {
    if (data) {
      return data
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
      // }
    }
  }
  ngOnInit(): void {
  }
}
