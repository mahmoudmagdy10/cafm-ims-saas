import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { workOrderService } from '../../workOrder.service';
import { Observable } from 'rxjs';
import { AddInstructionComponent } from '../task-card/modalsCard/edit-instruction/add-instruction/addInstruction.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'choose-template',
  templateUrl: './chooseTemplate.component.html',
  styleUrls: ['./chooseTemplate.component.scss'],
})
export class ChooseTemplateComponent implements OnInit {
  FormFilter: UntypedFormGroup;
  Codes$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<ChooseTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private service: workOrderService,

    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.FormFilter.patchValue(this.data.filters);
    this.Codes$ = this.service.Codes$;
  }

  Close() {
    this.dialogRef.close();
  }
}
