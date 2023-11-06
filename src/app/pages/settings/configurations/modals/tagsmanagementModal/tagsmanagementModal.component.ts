import { Observable, observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { TagsmanagementModalService } from './tagsmanagement-modal.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tagsmanagementModal',
  templateUrl: 'tagsmanagementModal.component.html',
  styleUrls: ['./../modal.component.scss'],
})
export class tagsmanagementComponent implements OnInit {
  locations$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<tagsmanagementComponent>,
    private service: TagsmanagementModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.getTags().subscribe((value) => {
      this.Tags = value;
    });
    this.service.getLocation();
    this.locations$ = this.service.locationList$.pipe(
      tap((val) => {
      })
    );
  }
  Tags: Array<{ Id: number; Tag: string; TagOrder: number; LocationId: any }> =
    [];
  IndexRowDeleted: number;
  IdRowDeleted: number;
  Close() {
    this.dialogRef.close();
  }

  AddTags() {
    this.Tags.push({
      Id: 0,
      Tag: 'new',
      TagOrder: 1,
      LocationId: null,
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Tags, event.previousIndex, event.currentIndex);
  }
  onSave() {
    this.Tags.forEach((value: any, index: number) => {
      value.tagOrder = index;
    });
    this.service.AddTags(this.Tags).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.Close();
        } else {
        }
      },
      (err) => {}
    );
  }

  onDelete() {
    if (this.IdRowDeleted != 0) {
      this.service
        .DeleteTags({ ID: this.IdRowDeleted })
        .subscribe((res: any) => {
          if (res.rv > 0) {
            this.Tags.splice(this.IndexRowDeleted, 1);
          } else {
          }
        });
    } else {
      this.Tags.splice(this.IndexRowDeleted, 1);
    }
  }
}
