import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PriorityModalService } from './priority-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'praiortyModal',
  templateUrl: 'praiortyModal.component.html',
  styleUrls: ['./../modal.component.scss'],
})
export class praiortyComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<praiortyComponent>,
    private service: PriorityModalService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.service.getPraiorty().subscribe((value) => {
      this.prioritys = value;
    });
  }
  IndexRowDeleted: number;
  IdRowDeleted: number;
  prioritys: Array<{
    PriorityId: 0;
    PriorityOrder: number;
    PriorityColor: any;
    PriorityNameEn: string;
    PriorityName: string;
  }> = [];
  Close() {
    this.dialogRef.close();
  }
  addPriority() {
    this.prioritys.push({
      PriorityId: 0,
      PriorityOrder: 0,
      PriorityColor: '#000000',
      PriorityNameEn: 'new',
      PriorityName: 'جديد',
    });
  }

  onSave() {
    this.prioritys.forEach((value: any, index: number) => {
      value.PriorityOrder = index;
    });
    this.service.Addpraiorty(this.prioritys).subscribe(
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
      this.service
        .Deletepraiorty({ priorityId: this.IdRowDeleted })
        .subscribe((res: any) => {
          if (res.rv > 0) {
            this.prioritys.splice(this.IndexRowDeleted, 1);

          } else {

          }
        });
    } else {
      this.prioritys.splice(this.IndexRowDeleted, 1);
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.prioritys, event.previousIndex, event.currentIndex);
  }
}
