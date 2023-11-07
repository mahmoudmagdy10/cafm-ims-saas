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
export class QRCodeForWorkOrderComponent implements OnInit {
  constructor() {}
  @Input() dataEdit: any;

  QrCodeWorkOrder: string;

  ngOnInit(): void {
    const url: string = window.location.href;
    let hostAssets: string;
    if (this.dataEdit.TaskStatusId == 3 ) {
      hostAssets =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `WorkOrder/card/${this.dataEdit.ID}?CompletedType=1`;
    } else if(this.dataEdit.TaskStatusId == 4){
      hostAssets =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `WorkOrder/card/${this.dataEdit.ID}?CompletedType=2`;
    }


    else {
      hostAssets =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `WorkOrder/card/${this.dataEdit.ID}`;
    }

    this.QrCodeWorkOrder = hostAssets;
  }

  newTab(url: any) {
    window.open(url, '_blank');
  }
}
