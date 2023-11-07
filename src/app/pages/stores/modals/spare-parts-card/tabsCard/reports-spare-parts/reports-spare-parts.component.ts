import { Observable } from 'rxjs';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-reports-spare-parts',
  templateUrl: './reports-spare-parts.component.html',
})
export class ReportsSparePartComponent implements OnInit {
  constructor(private service: SparePartService) {}
  itemEdit$: Observable<any>;
  @ViewChild('content', { static: true }) el!: ElementRef<HTMLImageElement>;
  cur: string = localStorage.getItem('currencyName')!;

  exportPDF() {
    html2canvas(this.el.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF({
        orientation: 'portrait',
      });

      const imageProps = pdf.getImageProperties(imgData);

      const pdfw = pdf.internal.pageSize.getWidth();

      const pdfh = (imageProps.height * pdfw) / imageProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

      pdf.save('output.pdf');
    });
  }
  ngOnInit(): void {
    this.itemEdit$ = this.service.itemEdit$.pipe(map((value) => value.Report[0]),
    tap(_=>{

    }));
  }
}
