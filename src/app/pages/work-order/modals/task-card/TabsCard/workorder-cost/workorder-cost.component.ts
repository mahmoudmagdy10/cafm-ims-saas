import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-workorder-cost',
  templateUrl: './workorder-cost.component.html',
  styleUrls: ['./workorder-cost.component.scss'],
})
export class WorkorderCostComponent implements OnInit {
  @Input() dataEdit: any;
  constructor() {}

  ngOnInit(): void {}
}
