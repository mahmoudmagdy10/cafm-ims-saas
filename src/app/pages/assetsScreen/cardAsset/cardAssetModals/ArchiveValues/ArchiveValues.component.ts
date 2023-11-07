import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'archive-values',
  templateUrl: 'ArchiveValues.component.html'
})
export class ArchiveValuesComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ArchiveValuesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {

  }


}
