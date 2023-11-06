import { environment } from 'src/environments/environment';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view-files-or-image',
  templateUrl: './view-files-or-image.component.html',
  styleUrls: ['./view-files-or-image.component.scss'],
})
export class ViewFilesOrImageComponent implements OnInit {
  Avatar = environment.Avatar;
  @Input() Files: any;

  constructor() {}

  ngOnInit() {}
}
