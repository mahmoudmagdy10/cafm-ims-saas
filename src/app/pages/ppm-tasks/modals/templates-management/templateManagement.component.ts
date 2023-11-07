import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AddInstructionComponent } from '../task-card/modalsCard/edit-instruction/add-instruction/addInstruction.component';
import { MatDialog } from '@angular/material/dialog';
import { ChooseTemplateComponent } from '../choose-template/chooseTemplate.component';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'template-management',
  templateUrl: './templateManagement.component.html',
  styleUrls: ['./templateManagement.component.scss'],
})
export class TemplatesManagementComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<TemplatesManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private service: ppmTasksService,

    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  Close() {
    this.dialogRef.close();
  }

  chooseTemplate() {
    const dialogRef = this.dialog
      .open(ChooseTemplateComponent, {
        width: '40vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
}
