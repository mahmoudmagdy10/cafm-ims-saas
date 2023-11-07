import { Observable } from 'rxjs';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-vertical-template',
  templateUrl: './vertical-template.component.html',
  styleUrls: ['./vertical-template.component.scss'],
})
export class VerticalTemplateComponent implements OnInit {
  @Input() taskEdit$: Observable<any>;
  @Output() timeConsuming = new EventEmitter();
  @Input() preview: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
