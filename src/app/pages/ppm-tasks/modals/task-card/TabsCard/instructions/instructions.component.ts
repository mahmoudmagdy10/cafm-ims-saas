import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ppmTasksService } from '../../../../ppm-tasks.service';
import { treeService } from 'src/app/shared/components/Tree/tree.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ChooseTemplateComponent } from '../../../choose-template/chooseTemplate.component';
import { EditInstructionComponent } from '../../modalsCard/edit-instruction/editInstruction.component';
import { ConfirmChangeStatusComponent } from './confirm-change-status/confirm-change-status.component';
import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  providers: [treeService],
})
export class InstructionsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ppmTasksService,

    private toastr: ToastrService,
    private treeService: treeService
  ) {}
  @Input() dataEdit: any;
  @Input() preview: boolean = false;

  loading: boolean = false;
  dataInStruction$: Observable<any>;
  codes$: Observable<any>;

  dataTree: any;
  Avatar = environment.Avatar;
  @ViewChild('confirmdeletePMS')
  confirmdeletePMS: confirmDeleteComponent;
  selectedItemToDelete: any = null;
  ngOnInit(): void {
    this.codes$ = this.service.Codes$;
    this.dataTree = [];
    this.dataInStruction$ = this.service.dataInStructionViewObz$.pipe(
      tap((data) => {
        if (data) {
          if (!data.refresh) {
            this.dataTree = this.service.deleteChildrenTypeOptionForView(
              this.service.mapTree(data)
            );
            this.dataTree.forEach((element: any, index: any) => {
              element.index = index;
            });
          } else {
            this.dataTree = this.service.deleteChildrenTypeOptionForView(
              data.dataTree.map((value: any, index: any) => {
                return {
                  index: index,
                  ID: value.ID,
                  children: [
                    ...value.children.map((value: any) => {
                      return {
                        ID: value.ID,
                        children: [...value.children],
                        data: value.data,
                        expanded: true,
                        label: value.label,
                        option: [...value.option],
                        obj: 2,
                      };
                    }),
                  ],
                  data: value.data,
                  expanded: true,
                  label: value.label,
                  option: [...value.option],
                  obj: 2,
                };
              })
            );
          }
        }
      })
    );
  }

  editInstruction() {
    const dialogRef = this.dialog
      .open(EditInstructionComponent, {
        width: '60vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      this.service.getInStruction();
    });
  }

  chooseTemplate() {
    const dialogRef = this.dialog
      .open(ChooseTemplateComponent, {
        width: '40vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  SaveNewValue(data: any, newValue: any) {
    if (this.dataEdit.TaskStatusId == 1) {
      this.ConfirmChangeStatus();
    }
    const body = {
      ComponentId: this.service.WorkOrderOpened.ID,
      componentType: 'WorkOrder',
      fieldsData: [
        {
          fieldId: data.ID,
          value: newValue,
        },
      ],
    };
    this.service.addNewValueToInst(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.dataEdit.CompletionRatio = res.CompletionRatio;
        } else {
        }
      },
      (err) => {}
    );
  }
  SaveNewValueFile(data: any, newValue: any) {
    data.loading = true;
    if (this.service.WorkOrderOpened.TaskStatusId == 1) {
      this.ConfirmChangeStatus();
    }
    const body = {
      ComponentId: this.service.WorkOrderOpened.ID,
      FieldId: data.data.ID,
      Value: newValue,
    };
    this.service.addNewValueToInstTypeFile(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          data.loading = false;

          this.service.getInStruction();
        } else {
          data.loading = false;
        }
      },
      (err) => {
        data.loading = false;
      }
    );
  }
  choseOption(Field: any, valueOption: any) {
    this.SaveNewValue(Field.data, valueOption.ID);
    this.finditemSelectedByIDAndAddChild(Field.ID, valueOption.Code);
  }
  finditemSelectedByIDAndAddChild(ID: any, children: any[]) {
    const searchTree = (element: any, ID: any) => {
      if (element.ID == ID) {
        element.children = [...children];
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
    if (this.dataTree.length > 0) {
      this.dataTree.forEach((value: any) => {
        searchTree(value, ID);
      });
    }
  }
  ConfirmChangeStatus() {
    if (
      !this.service.WorkOrderOpened?.notShowAgain &&
      this.service.WorkOrderOpened?.TaskStatusId == 1
    ) {
      const dialogRef = this.dialog
        .open(ConfirmChangeStatusComponent, {
          width: '30vw',
          data: {},
          disableClose: true,
        })
        .addPanelClass('cmms-custom-modal');
    }
  }

  // deleteFileInSop(fileData: any) {
  //   let body = {
  //     fileName: fileData?.FileName,
  //     sopId: fileData?.SOPId,
  //     fileId: fileData?.ID,
  //   };
  //   this.service.deleteFileInSop(body).subscribe((value: any) => {
  //     if (value.rv > 0) {
  //       this.service.getInStruction();
  //     }
  //   });
  // }
  confirmdeleteFileInSop(fileData: any) {
    this.selectedItemToDelete = fileData;
    this.confirmdeletePMS.openModal();
  }

  deleteFileInSop() {
    if (this.selectedItemToDelete) {
      let body = {
        fileName: this.selectedItemToDelete?.FileName,
        sopId: this.selectedItemToDelete?.SOPId,
        fileId: this.selectedItemToDelete?.ID,
      };
      this.service.deleteFileInSop(body).subscribe((value: any) => {
        if (value.rv > 0) {
          this.selectedItemToDelete = null;
          this.service.getInStruction();
        }
      });
    }
  }

  whenClosedconfirmdeleteFileInSop() {
    this.selectedItemToDelete = null;
  }
}
