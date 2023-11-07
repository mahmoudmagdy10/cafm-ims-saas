import { Observable } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-defualt-template',
  templateUrl: './defualt-template.component.html',
  styleUrls: ['./defualt-template.component.scss'],
})
export class DefualtTemplateComponent implements OnInit {
  @Input() taskEdit$: Observable<any>;
  @Output() timeConsuming = new EventEmitter();
  @Input()workOrderCompleted:any
  constructor() {}

  ngOnInit(): void {}
}
