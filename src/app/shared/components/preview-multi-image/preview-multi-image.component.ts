import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-multi-image',
  templateUrl: './preview-multi-image.component.html',
  styleUrls: ['./preview-multi-image.component.scss'],
})
export class PreviewMultiImageComponent implements OnInit {
  @Input() images: any;

  displayCustom: boolean;
  activeIndex: number;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  constructor() {}

  ngOnInit() {
  }
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
