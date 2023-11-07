import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl } from '@angular/forms';
import { assetsScreenService } from './../../assetsScreen.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-move-selected',
  templateUrl: './move-selected.component.html',
  styleUrls: ['./move-selected.component.scss'],
})
export class MoveSelectedComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MoveSelectedComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSelected: any[],
    public assetsService: assetsScreenService,
    private toastr: ToastrService
  ) {}
  dataLocations: any;
  LocationID = new UntypedFormControl();
  ngOnInit(): void {

    this.getdataLocation();
    this.LocationID.setValue(localStorage.getItem('defaultLocation'));
  }
  UnSelectedItem(item: any, index: number) {
    this.assetsService.SetUnSelectedItem(item);
    this.dataSelected.splice(index, 1);
  }
  Close() {
    this.dialogRef.close();
  }
  getdataLocation() {
    let locations = localStorage.getItem('locations');
    if (locations) {
      this.dataLocations = JSON.parse(locations);
    }
  }
  TransferSelected() {
    const Params = {
      ID: this.dataSelected
        .map((value) => {
          return value.ID;
        })
        .join(','),
      LocationId: this.LocationID.value,
    };
    this.assetsService.transferAssets(Params).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.dialogRef.close('Moved');
        } else {

        }
      },
      (err) => {

      }
    );
  }
}
