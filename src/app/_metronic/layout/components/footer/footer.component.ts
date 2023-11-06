import { tap } from 'rxjs/operators';
import { observable, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerContainerCssClasses: string = '';
  DateAndTime$!: Observable<any>;
  Data: any;
  currentDateTime: Date;
  currentDateStr: string = new Date().getFullYear().toString();
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.footerContainerCssClasses =
      this.layout.getStringCSSClasses('footerContainer');

    this.layout.getDate();
    this.DateAndTime$ = this.layout.DateAndTime$.pipe(
      tap((val) => {
        this.currentDateTime = new Date(val);
      })
    );
  }
}
