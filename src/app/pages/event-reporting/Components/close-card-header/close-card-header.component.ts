import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-close-card-header',
  templateUrl: './close-card-header.component.html',
  styleUrls: ['./close-card-header.component.scss']
})
export class CloseCardHeaderComponent implements OnInit, OnChanges {
  @Input() dataClosed: any;
  dataClose: any = null;
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    if(this.dataClosed){
      this.dataClose = this.dataClosed.data[0];
    }
  }

}
