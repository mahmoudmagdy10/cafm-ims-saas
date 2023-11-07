import { Observable } from 'rxjs';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-vertical-template',
  templateUrl: './vertical-template.component.html',
  styleUrls: ['./vertical-template.component.scss'],
})
export class VerticalTemplateComponent implements OnInit {
  @Input() taskEdit$: Observable<any>;
  @Input() preview: boolean = false;
  @Output() timeConsuming = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
