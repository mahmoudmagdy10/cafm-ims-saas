import { ToastrService } from 'ngx-toastr';
import { tap, map, finalize, switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { AddInstructionComponent } from './add-instruction/addInstruction.component';
import { treeService } from 'src/app/shared/components/Tree/tree.service';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { FieldsAsAssetIdComponent } from './fields-as-asset-id/fields-as-asset-id.component';
import { ppmTasksService } from 'src/app/pages/ppm-tasks/ppm-tasks.service';

@Component({
  selector: 'edit-instruction',
  templateUrl: './editInstruction.component.html',
  styleUrls: ['./editInstruction.component.scss'],
  providers: [treeService],
})
export class EditInstructionComponent implements OnInit {
  Codes$: Observable<any>;
  dataTree: any;
  loading: boolean = false;
  dataInStruction$: Observable<any>;
  @ViewChild('fileUpload') fileUpload: any;
  @ViewChild('imageUpload') imageUpload: any;
  isChangeName: any;
  constructor(
    public dialogRef: MatDialogRef<EditInstructionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private service: ppmTasksService,

    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private treeService: treeService
  ) {}
  instractionDeleted: number;
  ngOnInit(): void {
    this.dataTree = [];
    this.loading = true;
    // this.service.
    this.dataInStruction$ = this.service.dataInStructionEditObz$.pipe(
      tap((value) => {
        if (value) {
          if (value.refresh) {
            this.dataTree = value.dataTree;
          } else {
            this.dataTree = this.service.mapTree(value);
          }
          this.loading = false;
        }
      })
    );
    this.Codes$ = this.service.Codes$;
    // this.service.dataInStructionEditObz$.subscribe((res)=> console.log('aaaa', res))
  }

  Close() {
    this.dialogRef.close();
  }

  addInstruction() {
    this.loading = true;
    const dialogRef = this.dialog
      .open(AddInstructionComponent, {
        width: '40vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.dataTree.push({
          label: value.Name,
          data: { ...value, Files: [] },
          ID: value.ID,
          expanded: true,
          children: [],
          option: [],
        });
        this.service.dataInStructionEdit$.next({
          dataTree: this.dataTree,
          refresh: true,
        });
        this.service.setdataFromEditToView({
          dataTree: this.dataTree,
          refresh: true,
        });

        this.cdr.detectChanges();
      }
      this.loading = false;
    });
  }
  addChild(ID: any, fieldType: any) {
    this.loading = true;
    //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
    const dialogRef = this.dialog
      .open(AddInstructionComponent, {
        width: '40vw',
        data: { ID: ID, isOption: fieldType == 7 ? true : false },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.finditemSelectedByIDAndAddChild(ID, {
          label: value.Name,
          data: { ...value, Files: [] },
          ID: value.ID,
          expanded: true,
          children: [],
          option: [],
        });
        this.service.dataInStructionEdit$.next({
          dataTree: this.dataTree,
          refresh: true,
        });
        this.service.setdataFromEditToView({
          dataTree: this.dataTree,
          refresh: true,
        });
        this.loading = false;
        this.cdr.detectChanges();
      } else {
        this.loading = false;
      }
    });
  }

  finditemSelectedByIDAndAddChild(ID: any, child: any) {
    const searchTree = (element: any, ID: any) => {
      if (element.ID == ID) {
        element.option = [...element.children, child];
        element.children = [...element.children, child];
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
  changeName(newName: any, dataInst: any) {
    this.service.addInStruction({ ...dataInst, Name: newName }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
        } else {
        }
      },
      (err) => {}
    );
  }
  LinkWithAsset(Assets: any, dataInst: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets, assetInfo: { ID: dataInst.LogAssetId } },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.service
          .addInStruction({ ...dataInst, LogAssetId: result.ID })
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                dataInst.LogAssetId = result.ID;
                this.loading = false;
                this.cdr.detectChanges();
              } else {
              }
            },
            (err) => {}
          );
      }
    });
  }
  LinkWithFieldInAsset(Assets: any, fieldType: any, dataInst: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const FieldDialogRef = this.dialog.open(FieldsAsAssetIdComponent, {
          width: '50vw',
          data: { assetID: result.ID, fieldType: fieldType },
          disableClose: true,
        });
        var ComponentFieldId: any;
        FieldDialogRef.afterClosed()
          .pipe(
            switchMap((value) => {
              ComponentFieldId = value;
              return value
                ? this.service.addInStruction({
                    ...dataInst,
                    ComponentFieldId: ComponentFieldId,
                  })
                : of(false);
            })
          )
          .subscribe(
            (res: any) => {
              if (res) {
                if (res.rv > 0) {
                  dataInst.ComponentFieldId = ComponentFieldId;
                  this.loading = false;
                  this.cdr.detectChanges();
                } else {
                }
              }
            },
            (err) => {}
          );
      }
    });
  }
  linkAssigmentWithSignaturInst(Assgiments: any, dataInst: any) {
    this.service.addInStruction({ ...Assgiments, ...dataInst }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          // this.dialogRef.close(res.data[0]);
        } else {
        }
      },
      (err) => {}
    );
  }
  AttachAfileORImage(value: any, data: any, type: any) {
    if (type == 1) {
      data.loadingFile = true;
    } else if (type == 2) {
      data.loadingImg = true;
    }
    const body = {
      ComponentId: data.WorkOrderId,
      FieldId: data.ID,
      ComponentType: 'WorkOrder',
      Value: value.files,
    };
    this.service.AttachAfileORImage(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          if (type == 1) {
            data.loadingFile = false;
          } else if (type == 2) {
            data.loadingImg = false;
          }
          data.Files = [...data.Files, res.output.Data[0]];
          this.fileUpload.clear();
          this.imageUpload.clear();
          this.service.getInStruction();
        } else {
          if (type == 1) {
            data.loadingFile = false;
          } else if (type == 2) {
            data.loadingImg = false;
          }
        }
      },
      (err) => {
        if (type == 1) {
          data.loadingImg = false;
        } else if (type == 2) {
          data.loadingFile = false;
        }
      }
    );
  }
  deleteIns() {
    this.service.deleteIns(this.instractionDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getInStruction();
        } else {
        }
      },
      (err) => {}
    );
  }
  deleteFileInSop(fileData: any) {
    let body = {
      fileName: fileData?.FileName,
      sopId: fileData?.SOPId,
      fileId: fileData?.ID,
    };
    this.service.deleteFileInSop(body).subscribe((value: any) => {
      if (value.rv > 0) {
        this.service.getInStruction();
      }
    });
  }
  saveChanges() {
    this.dialogRef.close(this.dataTree);
  }
}
