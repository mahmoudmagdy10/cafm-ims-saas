import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

@Component({
  selector: 'QRCode',
  templateUrl: 'QRCode.component.html',
})
export class QRCodeComponent implements OnInit {
  constructor() {}
  @Input() data: any;

  QrCodeAsset: string;
  QrCodeMaintenans: string;
  QrCodeAddTask: string;
  ngOnInit(): void {
    const url: string = window.location.href;
    const hostAssets: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `Asset/card/${this.data.ID}`;
    this.QrCodeAsset = hostAssets;
    const hostMaintenans: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `public/MaintenanceRequest/${this.data?.WorkRequestGateID}/${this.data.AssetCode}`;
    this.QrCodeMaintenans = hostMaintenans;

    const hostMQrCodeAddTask: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `WorkOrder/addTask?AssetName=${this.data.AssetName}&AssetId=${this.data.ID}`;
    this.QrCodeAddTask = hostMQrCodeAddTask;
  }

  newTab(url: any) {
    window.open(url, '_blank');
  }
  print() {
    window.print();
  }
}
