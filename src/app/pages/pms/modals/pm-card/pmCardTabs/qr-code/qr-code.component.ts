import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PmsService } from 'src/app/pages/pms/pms.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit, AfterViewInit {
  @Input() itemEdit: any;
  @ViewChild('qrcode') qrcode: any;
  QrCodeAsset: string;
  qrCodeImage: string;
  constructor(private _pmsService: PmsService) {}
  ngOnInit(): void {
    const url: string = window.location.href;
    const hostAssets: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `/PMs/link/${this.itemEdit.ID}`;
    this.QrCodeAsset = hostAssets;
  }
  ngAfterViewInit(): void {}
  newTab(url: any) {
    window.open(url, '_blank');
  }
  print() {
    // Get the QR code component element
    const qrCodeElement: any = document.getElementById('qrcode');

    // Convert the QR code component to an image using html2canvas
    html2canvas(qrCodeElement, { useCORS: true }).then((canvas) => {
      // Create an image element from the canvas
      const qrCodeImage = new Image();
      qrCodeImage.src = canvas.toDataURL('image/png');
      // Open a new window to display the image
      const printWindow: any = window.open('', '', 'height=500,width=500');
      printWindow.document.write(
        '<html><head><title>Print QR Code</title></head><body>'
      );
      printWindow.document.write(`<img src="${qrCodeImage.src}" />`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Print the window and close it
      printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    });
  }
}
