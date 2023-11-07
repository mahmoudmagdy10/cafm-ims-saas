import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-field-show-in-table',
  templateUrl: './field-show-in-table.component.html',
})
export class FieldShowInTableComponent implements OnInit {
  SearchFields = new UntypedFormControl();
  feildsViewInTable: any[] = [];
  @Input() DataFeild$:Observable<any>
  @Output() sendFeildsViewInTable: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ViewFieldInTableAsset(event: any, item: any) {
    if (event.target.checked == true) {
      this.feildsViewInTable.push(item);
      this.sendFeildsViewInTable.emit(this.feildsViewInTable);
    } else {
      this.feildsViewInTable.forEach((value: any, index: any) => {
        if (item.ID == value.ID) {
          this.feildsViewInTable.splice(index, 1);
          this.sendFeildsViewInTable.emit(this.feildsViewInTable);
        }
      });
    }
  }
}
