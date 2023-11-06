import { tap } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import SignaturePad from 'signature_pad';
import { UserAndTeamsModal } from '../../modalsShared/User&TeamsModal/User&TeamsModal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'field-dynamic',
  templateUrl: 'fieldDynamic.component.html',
  styleUrls: ['fieldDynamic.component.css']
})
export class fieldDynamicComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  valueFieldControl = new UntypedFormControl();
  @Input() valueField: any;
  @Input() isDisabled: boolean;
  @Input() loading: any;
  @Output() valueFieldChange: EventEmitter<any> = new EventEmitter();
  @Input() TypeField: any;
  @Input() ListSourceName: any;
  @Input() FieldOptions: any;
  @Input() readOnly: boolean;
  @Input() viewAssigment: boolean;
  @Input() inPublic: boolean = false;
  @Input() inSOP: boolean = false;
  @Input() clear$: Observable<any> = of();
  @Input() isList: boolean = false;
  @Input() noOfImg: number = 2;
  @Input() min: any

  @Output() SaveNewValue: EventEmitter<any> = new EventEmitter();
  uploadedFiles: any[] = [];
  isEdit: boolean = false;

  @ViewChild('fileUpload') fileUpload: any;
  @ViewChild('canvas') canvas: ElementRef;
  sig: SignaturePad;
  Avatar = environment.Avatar;
  Subscription: Subscription;
  lang: string | null = '';
  constructor(public dialog: MatDialog, private toastr: ToastrService, private cdr: ChangeDetectorRef) {
    this.lang = localStorage.getItem('language');
  }
  ngAfterViewInit(): void {
    if (this.TypeField == 12 && !this.readOnly) {
      this.sig = new SignaturePad(this.canvas.nativeElement);
    }
    this.Subscription = this.clear$
      .pipe(
        tap((_) => {
          this.valueField = null;
          this.valueFieldControl.reset();
        })
      )
      .subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isDisabled){
      this.valueFieldControl.disable()
    }
    if (changes['valueField']) {
      if (this.TypeField == 7) {
        this.valueFieldControl.setValue(+this.valueField);
      } else if(this.TypeField == 8){
        this.valueFieldControl.setValue(this.valueField=='true'?true:false);
      } else {
        this.valueFieldControl.setValue(this.valueField);
      }
    }
  }

  ngOnInit() {
    this.valueFieldControl.valueChanges.subscribe((value) => {
      this.isEdit = true;
    });
    if (this.readOnly) {
      this.valueFieldControl.disable();
    }
    this.cdr.detectChanges();
  }
  onUpload(event: any) {
    if (!this.inPublic) {
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }
      this.fileUpload.clear();
    } else {
      if (this.uploadedFiles?.length + event.files?.length <= this.noOfImg) {
        this.uploadedFiles = [...this.uploadedFiles, ...event.files];
        this.fileUpload.clear();
      } else {
        this.toastr.error('You can only upload 2 files');
        this.fileUpload.clear();
      }
    }
    this.valueFieldControl.setValue(this.uploadedFiles);
    this.saveValueFeild();
  }

  saveValueFeild(event?: any) {
    if (this.isEdit) {
      this.isEdit = false;
      if (this.TypeField == 7 && this.inSOP) {
        const valueField = event.target.value;
        if (valueField) {
          const optionSelected = this.FieldOptions.find((option: any) =>
            valueField.includes(option.ID)
          );
          this.SaveNewValue.emit(optionSelected);
        }
      } else {
        this.valueFieldChange.emit(this.valueFieldControl.value);
        this.SaveNewValue.emit(this.valueFieldControl.value);
      }
      // this.uploadedFiles = [];
    }
  }
  convertTask() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.valueFieldControl.setValue(result.AssignmentID);
        this.saveValueFeild();
      }
    });
  }

  onDelete(i: number) {
    this.uploadedFiles?.splice(i, 1);
    this.valueField?.splice(i, 1);
  }
  ngOnDestroy(): void {
    this.Subscription?.unsubscribe();
  }
}
