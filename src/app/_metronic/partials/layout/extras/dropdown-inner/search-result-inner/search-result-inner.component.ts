import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-search-result-inner',
  templateUrl: './search-result-inner.component.html',
})
export class SearchResultInnerComponent implements OnInit {
  @HostBinding('class') class = 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  @HostBinding('attr.data-kt-search-element') dataKtSearch = 'content';

  resultModels: Array<ResultModel> = resultModels;

  constructor() {
  }

  ngOnInit(): void {
  }
}

interface ResultModel {
  image: string;
  title: string;
  description: string;
}

const resultModels: Array<ResultModel> = [
  {
    'image': './assets/media/avatars/150-1.jpg',
    'title': 'Karina Clark',
    'description': 'Marketing Manager'
  },
  {
    'image': './assets/media/avatars/150-3.jpg',
    'title': 'Olivia Bold',
    'description': 'Software Engineer'
  },
  {
    'image': './assets/media/avatars/150-8.jpg',
    'title': 'Ana Clark',
    'description': 'UI/UX Designer'
  },
  {
    'image': './assets/media/avatars/150-11.jpg',
    'title': 'Nick Pitola',
    'description': 'Art Director'
  },
  {
    'image': './assets/media/avatars/150-12.jpg',
    'title': 'Edward Kulnic',
    'description': 'System Administrator'
  }
];
