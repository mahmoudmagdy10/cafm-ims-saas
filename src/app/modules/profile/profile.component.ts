import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  display: boolean = false;
  displayaddFields: boolean = false;
  managmentFields() {
    this.display = true;
  }

  addFields() {
    this.displayaddFields = true;
  }

}
