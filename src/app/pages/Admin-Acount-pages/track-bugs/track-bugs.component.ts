import { map } from 'rxjs/operators';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackBugsService } from './track-bugs.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewJsonComponent } from './view-json/view-json.component';

@Component({
  selector: 'app-track-bugs',
  templateUrl: './track-bugs.component.html',
  styleUrls: ['./track-bugs.component.scss'],
})
export class TrackBugsComponent implements OnInit {
  bugsTrack$: Observable<any>;
  Campanies$: Observable<any>;
  Locations$: Observable<any>;
  IdOpened: any;
  trackFilterForm = new UntypedFormGroup({
    CompanyId: new UntypedFormControl(),
    LocationId: new UntypedFormControl(),
    UserId: new UntypedFormControl(),
    StatusCode: new UntypedFormControl(),
  });
  selectedPage = 1;
  constructor(
    private _trackBugsService: TrackBugsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this._trackBugsService.getCampanies();
    this.bugsTrack$ = this._trackBugsService.Selector$('BugsTrack');
    this.Campanies$ = this._trackBugsService.Selector$('Campanies').pipe(
      map((value) => {
        return value?.Data;
      })
    );
  }
  setFilter() {
    this._trackBugsService.updateStore({
      Filter: {
        ...this.trackFilterForm?.value,
        currentPage: this.selectedPage,
        rowCount: 10,
      },
    });
  }
  filter() {
    this.setFilter();
    this._trackBugsService.getBugsTrack();
  }
  ViewJson(item: any) {
    this.IdOpened = item.ID;
    const dialogRef = this.dialog
      .open(ViewJsonComponent, {
        width: '60vw',
        data: item,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  DependancesDisable() {}
}
