import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'actions-filter',
  templateUrl: 'ActionsFilter.component.html'
})
export class ActionsFilterComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ActionsFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {

  }


}
