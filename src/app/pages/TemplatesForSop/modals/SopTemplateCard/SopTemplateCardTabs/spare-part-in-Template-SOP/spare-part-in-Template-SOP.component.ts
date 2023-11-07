import { StoreCard } from './../../../../../stores/modals/spare-parts-card/spare-parts-card.component';
import { ToastrService } from 'ngx-toastr';
import { RequestSparePartComponent } from './../../../../../../shared/components/ruqest-forgin-service-or-spare-part/request-spare-part/request-spare-part.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { TemplatesForSopService } from 'src/app/pages/TemplatesForSop/TemplatesForSop.service';

@Component({
  selector: 'spare-part-in-Template-SOP',
  templateUrl: './spare-part-in-Template-SOP.component.html',
})
export class SparePartInSopTemplateComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: TemplatesForSopService,
    private toastr: ToastrService,
    private _SparePartService: SparePartService
  ) {}
  @Input() dataEdit: any;

  ngOnInit(): void {}
  AddSparePart() {
    const dialogRef = this.dialog
      .open(RequestSparePartComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value: any[]) => {
      if (value) {
        this.service
          .linkpartWithPreventive(
            value.map((value) => {
              return {
                partId: value.partId,
                qty: value.quantity,
              };
            })
          )
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                if (!this.dataEdit.Parts) {
                  this.dataEdit.Parts = [];
                }
                this.dataEdit.Parts = res.data;


              } else {

              }
            },
            (err) => {

            }
          );
      }
    });
  }
  deleteSparePart(PartId: any) {
    this.service.deleteSparePart(PartId).subscribe(
      (res: any) => {
        if (res) {

          this.dataEdit.Parts.forEach((element: any, index: any) => {
            if (element.PartId == PartId) {
              this.dataEdit.Parts.splice(index, 1);
            }
          });
        } else {

        }
      },
      (err) => {

      }
    );
  }
  SparePartCard(ID: any) {
    this._SparePartService.getItemEdit(ID);
    this._SparePartService.getTransactions();
    this._SparePartService.getCodes();
    const dialogRef = this.dialog
      .open(StoreCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
}
