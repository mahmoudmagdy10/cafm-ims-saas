import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'icon-field',
  templateUrl: './icon-field.component.html',
})
export class IconFieldComponent implements OnInit {
  @Input() TypeField: any;
  constructor() {}

  ngOnInit(): void {}
}
