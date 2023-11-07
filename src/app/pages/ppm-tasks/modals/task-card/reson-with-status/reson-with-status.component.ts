import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reson-with-status',
  templateUrl: './reson-with-status.component.html',
  styleUrls: ['./reson-with-status.component.scss'],
})
export class ResonWithStatusComponent implements OnInit {
  @Input() dataEdit: any;
  constructor() {}

  ngOnInit(): void {}
}
