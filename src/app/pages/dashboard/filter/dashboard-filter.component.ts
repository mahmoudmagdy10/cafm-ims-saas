import {
  UntypedFormGroup,
  FormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'dashboard-filter',
  templateUrl: 'dashboard-filter.component.html',
})
export class DashboardFilter implements OnInit {
  formFilter: UntypedFormGroup;
  codes$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<DashboardFilter>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog
  ) {
    this.formFilter = this.fb.group({});
  }

  ngOnInit(): void {}

  Close() {
    this.dialogRef.close();
  }
  dataLocation() {
    let locations = localStorage.getItem('locations');
    if (locations) {
      return JSON.parse(locations);
    }
  }
}
