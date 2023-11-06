import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'confirm-delete',
  templateUrl: 'confirmDelete.component.html',
})
export class confirmDeleteComponent implements OnInit {
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Input() massage: string;
  @Input() customMassage: string;
  @Input() customheader: string;
  @Input() customSure: string;
  @Input() customIcon: string;
  @Input() customColor: string;
  displaymodalDelete: boolean = false;
  @Input() closed: Function;
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}
  onDelete(event: boolean) {
    this.afterSave.emit(event);
  }
  openModal = () => {
    this.displaymodalDelete = true;
  };
  CloseModal = () => {
    this.displaymodalDelete = false;
    if (this.closed) {
      this.closed();
    }
  };
}
