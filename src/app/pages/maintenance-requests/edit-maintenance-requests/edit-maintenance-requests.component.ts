import { ToastrService } from 'ngx-toastr';
import { MaintenanceRequestsService } from './../maintenance-requests.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-maintenance-requests',
  templateUrl: './edit-maintenance-requests.component.html',})
export class EditMaintenanceRequestsComponent implements OnInit {
  Code$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<EditMaintenanceRequestsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MaintenanceRequestsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Code$ = this.service.Code$;
  }
  onEdit() {
    this.service.EditWorkRequestGates({ ...this.data, Logo: 10 ,NotifiedEmails:this.data.NotifiedEmails||'test'}).subscribe(
      (res: any) => {
        if (res.rv > 0) {

        } else {

        }
      },
      (err) => {

      }
    );
  }
  onClose(){
    this.dialogRef.close()
  }
}
