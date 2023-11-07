import { ToastrService } from 'ngx-toastr';
import { assetsScreenService } from './../../assetsScreen.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-selected',
  templateUrl: './delete-selected.component.html',
  styleUrls: ['./delete-selected.component.scss'],
})
export class DeleteSelectedComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteSelectedComponent>,
    @Inject(MAT_DIALOG_DATA) public dataSelected: any[],
    public assetsService: assetsScreenService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}
  UnSelectedItem(item: any, index: number) {
    this.assetsService.SetUnSelectedItem(item);
    this.dataSelected.splice(index, 1);
  }
  deleteSelectd() {
    const Params = {
      ID: this.dataSelected
        .map((value) => {
          return value.ID;
        })
        .join(','),
    };
    this.assetsService.deleteAssetsSelected(Params).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.dialogRef.close('Deleted');
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
