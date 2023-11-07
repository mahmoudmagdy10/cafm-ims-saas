import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceRequestsService } from './../maintenance-requests.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-copy-setting',
  templateUrl: './copy-setting.component.html',
})
export class CopySettingComponent implements OnInit {
  dataLocations: any[];
  locationID = new UntypedFormControl();
  constructor(
    private toastr: ToastrService,
    private service: MaintenanceRequestsService,
    public dialogRef: MatDialogRef<CopySettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getdataLocation();
  }
  getdataLocation() {
    let locations = localStorage.getItem('locations');
    if (locations) {
      this.dataLocations = JSON.parse(locations);
    }
    this.dataLocations.forEach((element, index) => {
      if (element.LocationId == this.data.LocationId) {
        this.dataLocations.splice(index, 1);
      }
    });
  }
  onTransfer() {
    const body = {
      ID: this.data.ID,
      LocationId: this.locationID.value,
    };
    this.service.TransferSettingsBetweenLocaton(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.dialogRef.close();
          this.service.getWorkRequestGates();
        } else {

        }
      },
      (err) => {

      }
    );
  }
  Close() {
    this.dialogRef.close();
  }
}
