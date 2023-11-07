import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
  QrCode: string;
  @ViewChild('qrcodeEl') qrcodeElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<QrCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.QrCode = this.data;
  }
  onClose() {
    this.dialogRef.close();
  }
  newTab(url: any) {
    window.open(url, '_blank');
  }

  @ViewChild('content', { static: true }) el!: ElementRef<HTMLImageElement>;
  // exportPDF() {
  //   html2canvas(this.el.nativeElement).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/jpeg');

  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //     });

  //     const imageProps = pdf.getImageProperties(imgData);

  //     const pdfw = pdf.internal.pageSize.getWidth();

  //     const pdfh = (imageProps.height * pdfw) / imageProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

  //     pdf.save('output.pdf');
  //   });
  // }
  print(){

    window.print()

  }
  downloadQRCode() {
    const qrcodeImg = this.el.nativeElement.querySelector('img');
    const downloadLink = document.createElement('a');
    downloadLink.href = qrcodeImg?.src || '';
    downloadLink.download = 'qrcode.png';
    downloadLink.click();
  }
}
