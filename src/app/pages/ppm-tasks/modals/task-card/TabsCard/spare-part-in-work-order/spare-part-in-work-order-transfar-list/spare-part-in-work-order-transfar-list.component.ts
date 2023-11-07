import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-spare-part-in-work-order-transfar-list',
  templateUrl: './spare-part-in-work-order-transfar-list.component.html',
  styleUrls: ['./spare-part-in-work-order-transfar-list.component.scss']
})
export class SparePartInWorkOrderTransfarListComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SparePartInWorkOrderTransfarListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,

  ) {}

  ngOnInit(): void {
  }
  Close(){
    this.dialogRef.close()
  }
}
