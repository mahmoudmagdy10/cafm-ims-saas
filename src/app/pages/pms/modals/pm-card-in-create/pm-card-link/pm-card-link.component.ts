import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pm-card-link',
  templateUrl: './pm-card-link.component.html',
})
export class PmCardLinkComponentCopy implements OnInit {
  itemEdit$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private service: PmsService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.getCodePms();

    const id = this._activatedRoute.snapshot.paramMap.get('id');

    this.itemEdit$ = this.service.getPmsAsId(id).pipe(
      map((value) => {
        return { ...value[0], TagsId: JSON.parse(value[0].TagsId) };
      })
    );
    this.service.getSchedulesTimeByPMSID(id);

    this.service.PMSIdOpened = id;
    this.service.getInStruction();
  }
}
