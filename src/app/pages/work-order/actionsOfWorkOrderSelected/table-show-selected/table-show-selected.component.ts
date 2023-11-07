import { Component, OnInit } from '@angular/core';
import { workOrderService} from '../../workOrder.service';

@Component({
  selector: 'app-table-show-selected',
  templateUrl: './table-show-selected.component.html',
  styleUrls: ['./table-show-selected.component.scss'],
})
export class TableShowSelectedComponent implements OnInit {
  constructor(private service: workOrderService) {}
  get WorkOrderSelected() {
    return this.service.WorkOrderSelected;
  }
  ngOnInit(): void {}
  unSelectItem(ID: any, index: number) {
    this.WorkOrderSelected.splice(index, 1);
    this.service.setActionUnSelected(ID);
  }
}
