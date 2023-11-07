import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface City {
  name: string,
  code: string
}



@Component({
  selector: 'modalThemesEmail',
  templateUrl: 'modalThemesEmail.component.html',
})



export class modalThemesEmaillComponent implements OnInit {

  ModalChooseUsers:boolean=false

  public Editor = ClassicEditor;

  cities: City[];

  selectedCityCodes: string[];

  constructor() {
      this.cities = [
          {name: 'New York', code: 'NY'},
          {name: 'Rome', code: 'RM'},
          {name: 'London', code: 'LDN'},
          {name: 'Istanbul', code: 'IST'},
          {name: 'Paris', code: 'PRS'}
      ];
  }

  ngOnInit(): void {



  }

  showChooseUser(){
    this.ModalChooseUsers=true
  }


}


