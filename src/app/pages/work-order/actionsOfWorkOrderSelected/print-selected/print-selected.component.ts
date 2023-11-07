import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { workOrderService } from '../../workOrder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-selected',
  templateUrl: './print-selected.component.html',
  styleUrls: ['./print-selected.component.scss'],
})
export class PrintSelectedComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PrintSelectedComponent>,
    private service: workOrderService,
    private router: Router

  ) {}
  loadingPrint:Boolean=false
  ngOnInit(): void {}
  onClose() {
    this.dialogRef.close();
  }
  IsSoftService() {
    const currentRoute = this.router.url;
    const segmentsToCheck = ['CreateSoftServices', 'SoftServiceTasks', 'CompletedSST'];
    return segmentsToCheck.some(segment => currentRoute.includes(segment));
  }
  printSelected() {
    this.loadingPrint=true
    this.service
      .PrintWorkOrder({
        ids: this.service.WorkOrderSelected.map((value) => value.ID).join(','),
        isSoftService: this.IsSoftService()
      })
      .subscribe((value) => {
        this.loadingPrint=false

        this.dialogRef.close();
      },err=>{
        this.loadingPrint=false

      });
  }
}
