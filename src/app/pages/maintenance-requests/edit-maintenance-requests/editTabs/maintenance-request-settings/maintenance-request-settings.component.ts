import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceRequestsService } from '../../../maintenance-requests.service';

@Component({
  selector: 'app-maintenance-request-settings',
  templateUrl: './maintenance-request-settings.component.html',
})
export class MaintenanceRequestSettingsComponent implements OnInit {
  @Input() data: any;
  isChange: boolean = false;
  codes$: Observable<any>;
  @Output() EditWorkRequest = new EventEmitter();
  constructor(private service: MaintenanceRequestsService) {}

  ngOnInit(): void {
    this.codes$ = this.service.Code$;
  }

  isChecked = false;

  handleChange(event: any) {
    const value = event.checked ? 1 : 0;
    this.EditWorkRequest.emit({
      ...this.data,
      isConvertedDirectlyWorkOrder: value ? '1' : '0',
    })
  }
}
