import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../../configurations.service';

@Component({
  selector: 'app-reasons-modal',
  templateUrl: './reasons-modal.component.html',
  styleUrls: ['./reasons-modal.component.scss']
})
export class ReasonsModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReasonsModalComponent>,
    private configurationService: ConfigurationService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.configurationService.getEventReason().subscribe((value) => {
      this.reasonsData = value;
    });
  }
  IndexRowDeleted: number;
  IdRowDeleted: number;
  reasonsData: Array<{
    ID: 0;
    ReasonEn: string;
    ReasonAr: string;
  }> = [];
  Close() {
    this.dialogRef.close();
  }
  addReason() {
    this.reasonsData.push({
      ID: 0,
      ReasonEn: 'new',
      ReasonAr: 'جديد',
    });
  }

  onSave() {
    this.configurationService.addReasonsData(this.reasonsData).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.Close();
        } else {

        }
      },
      (err) => {

      }
    );
  }

  onDelete() {
    if (this.IdRowDeleted != 0) {
      this.configurationService
        .deleteReason({ Id: this.IdRowDeleted })
        .subscribe((res: any) => {
          if (res.rv > 0) {
            this.reasonsData.splice(this.IndexRowDeleted, 1);

          } else {

          }
        });
    } else {
      this.reasonsData.splice(this.IndexRowDeleted, 1);
    }
  }
  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.prioritys, event.previousIndex, event.currentIndex);
  // }

}
