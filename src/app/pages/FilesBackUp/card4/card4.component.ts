import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-card-file',
  templateUrl: './card4.component.html',
})
export class CardFileComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @HostBinding('class') class = 'card h-100';

  constructor() {}
}
