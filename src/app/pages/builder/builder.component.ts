import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../_metronic/layout';
import {TooltipModule} from 'primeng/tooltip';
import { PrimeNGConfig } from 'primeng/api';



type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer' | 'Footer1' | 'Footer2' | 'Footer3' | 'Footer4';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
})
export class BuilderComponent implements OnInit {
  activeTab: Tabs = 'Header';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  constructor(private layout: LayoutService, private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.model = this.layout.getConfig();
    this.primengConfig.ripple = true;

  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  submitPreview(): void {
    this.configLoading = true;
    this.layout.setConfig(this.model);
    location.reload();
  }
}
