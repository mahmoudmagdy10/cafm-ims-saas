import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-window-info',
  templateUrl: './window-info.component.html',
})
export class WindowInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<WindowInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  Close() {
    this.dialogRef.close();
  }
  ChangeLocationAndChangePage(Route: string) {
    localStorage.setItem('defaultLocation', this.data.LocationId);
    this.router.navigate([Route]);
    this.Close();
  }
  moveOn(route: string, query: any = {}) {
    this.router.navigate([route], {
      queryParams: query,
    });
    this.Close();
  }
}
