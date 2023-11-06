import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-pagination-component',
  templateUrl: './pagination-component.component.html',
  styleUrls: ['./pagination-component.component.scss'],
})
export class PaginationComponentComponent implements OnInit, OnChanges {
  listPagination: any = [];
  @Input() Setting: any;
  @Input() selectedPage: number;
  @Input() PerPagenation: number;
  @Input() RowCount: any = 50;
  @Output() selectedPageChange = new EventEmitter();
  @Output() selectedRowCount = new EventEmitter();
  @Input() showPerPage: boolean = true;

  selectRowCount = new UntypedFormControl();
  floatsltr: boolean = false;
  floatsrtl: boolean = false;
  perPaginator: any[] = [5, 10, 25, 50];

  constructor() {}

  ngOnInit() {
    this.selectRowCount.setValue(this.RowCount);
    if (document.dir == 'rtl') {
      this.floatsrtl = true;
    } else {
      this.floatsltr = true;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Setting']) {
      this.listPagination = [];
      if (this.Setting) {
        for (var i = 1; i <= this.Setting[0].TotalPage; i++) {
          this.listPagination.push(i);
        }
      }
    }
    if (this.selectedPage > this.Setting?.[0].TotalPage) {
      this.selectPageFirst();
    }
  }
  selectPage(PageCount: any) {
    if (PageCount == 'next') {
      this.selectedPage = this.selectedPage + 1;
    } else if (PageCount == 'back') {
      this.selectedPage = this.selectedPage - 1;
    } else {
      this.selectedPage = PageCount;
    }
    this.selectedPageChange.emit(this.selectedPage);
  }
  selectPageFirst() {
    this.selectedPageChange.emit((this.selectedPage = 1));
  }
  selectPageFinal() {
    this.selectedPageChange.emit(this.listPagination.length);
  }
  selectPerPage() {
    this.selectedPageChange.emit(this.selectedPage);
  }
  onselectedRowCount(RowCount: any) {
    this.RowCount = RowCount.value;

    this.selectedRowCount.emit(this.RowCount);
  }
}
