import { map } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TemplatesForSopService } from '../../TemplatesForSop.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'SopTemplateCard',
  templateUrl: 'SopTemplateCard.component.html',
})
export class SopTemplateCard implements OnInit {
  itemEdit$: Observable<any>;
  CodeObz$: Observable<any>;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SopTemplateCard>,
    private service: TemplatesForSopService,
    @Inject(MAT_DIALOG_DATA) public dataPmCard: any
  ) {}

  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$;
    this.itemEdit$ = this.service.getPmsAsId(this.dataPmCard.ID).pipe(
      map((value) => {
        return { ...value[0], TagsId: JSON.parse(value[0]?.TagsId!) };
      })
    );
    this.itemEdit$ = this.service.getPmsAsId(this.dataPmCard.ID).pipe(
      map((value) => {
        const parsedTagsId = value[0]?.TagsId;
        if (parsedTagsId) {
          try {
            return { ...value[0], TagsId: JSON.parse(parsedTagsId) };
          } catch (error) {
            console.error('Error parsing TagsId:', error);
          }
        }
        return { ...value[0] }; // Return a default value if TagsId is undefined or invalid JSON.
      }),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return [];
      })
    );
    this.service.PMSIdOpened = this.dataPmCard.ID;
    this.service.getInStruction();
  }
  get IsUpComing() {
    return this.dataPmCard.upComingTab;
  }
  Close() {
    this.dialogRef.close();
  }
}
