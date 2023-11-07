import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { CardSparePartImageComponent } from '../../modelsCard/card-image/card-image.component';

@Component({
  selector: 'app-basic-informtion',
  templateUrl: './basic-informtion.component.html',
})
export class BasicInformtionComponent implements OnInit {
  codes$: Observable<any>;
  itemEdit$: Observable<any>;

  @Input() cardSparePartForm: any;
  Supscription: Subscription;
  Avatar=environment.Avatar
  PartsEditPermission:boolean;
  constructor(
    private service: SparePartService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.codes$ = this.service.Codes$;
    this.itemEdit$ = this.service.itemEdit$;
    this.codes$.subscribe((res)=> {
      this.PartsEditPermission = res.PagePermissions.PartsEdit;
    });
  }

  ngAfterViewInit() {
    setTimeout(()=> {
      const isDisabledPartName = document.getElementById('isDisabledPartName');
      const isDisabledPartNumber = document.getElementById('isDisabledPartNumber');
      const isDisabledCategoryId = document.getElementById('isDisabledCategoryId');

      if (!this.PartsEditPermission && isDisabledCategoryId && isDisabledPartNumber && isDisabledPartName) {
        isDisabledPartName.setAttribute('disabled', 'disabled');
        isDisabledPartNumber.setAttribute('disabled', 'disabled');
        isDisabledCategoryId.setAttribute('disabled', 'disabled');
      }
    }, 500)
  }

  AddCardImage() {
    const dialogRef = this.dialog.open(CardSparePartImageComponent, {
      width: '30vw',
      data: { ID: this.cardSparePartForm.value.ID },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((value) => {
      this.service.updateItemEdit({
        ImagePath: value.FilePath,
      });
    });
  }
}
