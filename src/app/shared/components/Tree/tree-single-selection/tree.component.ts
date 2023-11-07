import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TreeDragDropService, TreeNode } from 'primeng/api';
import { treeService } from '../tree.service';

@Component({
  selector: 'single-select-tree',
  templateUrl: './tree.component.html',
  providers: [TreeDragDropService, treeService],
})
export class TreeSingleSelectionComponent implements OnInit {
  @Input() data: any;
  @Input() IdItemSelected: any;
  @Input() isContext: any = { active: false, fromWho: '' };
  @Output() AfterSaveSelect: EventEmitter<any> = new EventEmitter();
  selectedFile: any;
  dataTree: TreeNode[];
  contextMenuitems = [
    {
      label: 'View Details',
      command: (event: any) => this.viewDetails(),
    },
  ];
  constructor(private treeService: treeService) {}

  ngOnInit(): void {
    this.dataTree = this.treeService.mapTree(this.data);

    if (this.IdItemSelected) {


    }
  }
  nodeSelect(event: any) {
    this.AfterSaveSelect.emit(event);

  }
  finditemSelectedByID(ID: any) {
    const searchTree = (element: any, ID: any) => {
      if (element.ID == ID) {
        return element;
      } else if (element.children != null) {
        var i;
        var result: any = null;
        for (i = 0; result == null && i < element.children.length; i++) {
          result = searchTree(element.children[i], ID);
        }
        return result;
      }
      return null;
    };
    if (this.data.length > 0) {
      this.dataTree.forEach((value) => {
        if (searchTree(value, ID)) {
          this.selectedFile = searchTree(value, ID);
        }
      });
    }
  }
  viewDetails() {
    switch (this.isContext.fromWho) {
      case 'Assets':

        const url: string = window.location.href;
        const hostAssets: string =
          url.split('/')[0] +
          '/' +
          url.split('/')[1] +
          '/' +
          url.split('/')[2] +
          '/' +
          `Asset/card/${this.selectedFile.ID}`;
        window.open(hostAssets, '_blank');
        break;
    }
  }

  // nodeUnselect(event: any) {}
}
