import { Observable } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ViewDataFilterService } from './view-data-filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-data-filter',
  templateUrl: './view-data-filter.component.html',
  styleUrls: ['./view-data-filter.component.scss'],
})
export class ViewDataFilterComponent implements OnInit {
  @Input() componentType: string = '';
  @Input() isClear = true;
  @Input() icon: string = '';

  dataFilter$: Observable<any>;
  constructor(
    private _viewDataFilterService: ViewDataFilterService,
    private router: Router
  ) {}

  ngOnInit() {
    this._viewDataFilterService.createInitValueForFilter(this.componentType);
    this.dataFilter$ = this._viewDataFilterService.SelectorFilterByComponent$(
      this.componentType,
      'dataFilter'
    );
  }
  openCardFilter() {
    this._viewDataFilterService.openCardFilter(this.componentType);
  }
  clearFilter() {
    this._viewDataFilterService.clearFilter(this.componentType);
  }
}
