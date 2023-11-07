import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ppm-cost',
  templateUrl: './ppm-cost.component.html',
  styleUrls: ['./ppm-cost.component.scss']
})
export class PpmCostComponent implements OnInit {
  @Input() dataEdit: any;

  constructor() { }

  ngOnInit(): void {
  }

}
