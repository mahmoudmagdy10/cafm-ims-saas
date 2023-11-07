import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-json',
  templateUrl: './view-json.component.html',
  styleUrls: ['./view-json.component.scss'],
})
export class ViewJsonComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ViewJsonComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {}
  JsonAfterFormmate: any;
  ngOnInit(): void {}
  Close() {
    this.dialogRef.close();
  }
  getFormattedParameters(jsonString: string): string {
    try {
      const json = JSON.parse(jsonString);
      return JSON.stringify(json, null, 4);
    } catch (e) {
      return jsonString;
    }
  }
  formate() {
  //   if (JSON.parse(this.Json)) {
  //     this.JsonAfterFormmate = JSON.stringify(
  //       this.Json,
  //       JSON.parse(this.Json),
  //       4
  //     );
  //   } else {
  //     this.JsonAfterFormmate = this.Json;
  //   }
  }
}
