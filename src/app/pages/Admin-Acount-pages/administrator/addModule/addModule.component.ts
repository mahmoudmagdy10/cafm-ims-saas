import { administratorService } from './../administrator.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-addModule',
  templateUrl: './addModule.component.html',

})
export class addModuleComponent implements OnInit {
  idCom: any
  selectedIndex: number = 0;
  dataCamEdit: any;
  dataSubEdit: any[] = [];
  loadingmodalAddOrEditCom: boolean = false;
  constructor(public dialogRef: MatDialogRef<addModuleComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public administratorService: administratorService,) { }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseModal();
      }
    });

    this.loadingmodalAddOrEditCom = true;
    if (this.data.IDCom) {
      this.getCompaniesByID();
    } else {
      this.loadingmodalAddOrEditCom = false;
      this.dataCamEdit = null;
    }

  }
  getCompaniesByID() {
    this.administratorService.getCompaniesByID(this.data.IDCom).subscribe(value => {
      this.dataCamEdit = value.Data[0];

      this.loadingmodalAddOrEditCom = false;
    })
  }


  AfterSaveCom(id: any) {
    this.idCom = id;
    this.selectedIndex = 1;
  }
  afterEditCom(newData: any) {

    this.dialogRef.close(newData);
  }

  afterSaveSub() {
    this.dialogRef.close(true);
  }
  CloseModal() {
    if (this.idCom) {
      this.dialogRef.close(true);

    } else {
      this.dialogRef.close();

    }
  }
  onCancel(){
    this.dialogRef.close();
  }
}
