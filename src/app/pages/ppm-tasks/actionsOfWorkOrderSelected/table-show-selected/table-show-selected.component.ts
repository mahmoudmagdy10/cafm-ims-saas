import { Component, OnInit } from '@angular/core';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'app-table-show-selected',
  templateUrl: './table-show-selected.component.html',
  styleUrls: ['./table-show-selected.component.scss'],
})
export class TableShowSelectedComponent implements OnInit {
  constructor(private service: ppmTasksService) {}
  get WorkOrderSelected() {
    return this.service.WorkOrderSelected;
  }
  ngOnInit(): void {}
  unSelectItem(ID: any, index: number) {
    this.WorkOrderSelected.splice(index, 1);
    this.service.setActionUnSelected(ID);
  }
}
