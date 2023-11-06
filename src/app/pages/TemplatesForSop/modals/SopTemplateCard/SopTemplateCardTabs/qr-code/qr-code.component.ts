import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

  @Input() itemEdit: any;

  QrCodeAsset: string;

  ngOnInit(): void {
    const url: string = window.location.href;
    const hostAssets: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `/PMs/${this.itemEdit.ID}`;
    this.QrCodeAsset = hostAssets;

  }

  newTab(url: any) {
    window.open(url, '_blank');
  }
}


