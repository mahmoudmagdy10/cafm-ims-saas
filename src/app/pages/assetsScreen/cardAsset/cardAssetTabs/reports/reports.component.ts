import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  Output,
} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'assets-reports',
  templateUrl: 'reports.component.html',
})
export class ReportsComponent implements OnInit {
  constructor(private router: Router) {}
  @Input() Report: any;
  @Input() dataAsset: any;
  @Output() exportPDF = new EventEmitter();
  data: any;
  total = 0;
  chartOptions: any;
  cur: string = localStorage.getItem('currencyName')!;

  ngOnInit(): void {


    this.Report?.FinancialStatistics.forEach((element: any) => {
      this.total = this.total + element.Price;
    });
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
        },
      ],
    };
  }
  @ViewChild('content', { static: true }) el!: ElementRef<HTMLImageElement>;

  export() {

    this.exportPDF.emit();
  }

  moveOnWorkOrderForAsset() {

    let url =
      window.location.href.split('Asset')[0] +
      '/WorkOrder/workOrderNotCompleted?AssetId=' +
      this.dataAsset.ID;
    window.open(url, '_blank');
  }
}
