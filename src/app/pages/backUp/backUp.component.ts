import { FormGroup, FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { BackupService } from './backup.service';
@Component({
  selector: 'app-Backup',
  templateUrl: './Backup.component.html',
  styleUrls: ['./Backup.component.scss'],
})
export class BackupComponent implements OnInit {
  BackupConfigForm = new FormGroup({
    LocationId: new FormControl(),
    BackupEvery: new FormControl(),
    BackupBeginTime: new FormControl(),
    BackupBeginDate: new FormControl(),
  });

  constructor(
    private _BackupService: BackupService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}
  AllTemplateWithoutSelected: any;
  TemplateSelected: any[] = [];
  BackupsConfig: any[] = [];
  BackupEveryItems = [
    { name: 'Daily', id: 1 },
    { name: 'Monthly', id: 2 },
    { name: 'Yearly', id: 3 },
  ];
  Locations: any[] = [];
  itemBackupConfigDeleted: any;
  itemTemplateSelectedDeleted: any;

  ngOnInit() {
    // this.getTemplateSelected();
    this.getBackupConfig();
  }
  selectTemplate(TemplateId: any) {
    this._BackupService.addTemplateForBackup(TemplateId).subscribe(
      (res: any) => {
        if (res.rv) {
          this.getTemplateSelected();

        } else {

        }
      },
      (err) => {

      }
    );
  }
  getTemplateSelected() {
    this._BackupService.getAllTemplatesSelected().subscribe((template) => {
      this.TemplateSelected = template;
      this.cdr.detectChanges();
      this._BackupService.getAllTemplates().subscribe((value) => {
        this.AllTemplateWithoutSelected = value.filter(
          (value: any) =>
            !this.TemplateSelected.find(
              (template: any) => template.TemplateId == value.Id
            )
        );
        this.cdr.detectChanges();
      });
    });
  }

  addBackupConfig() {
    const body = {
      ...this.BackupConfigForm.value,
      BackupBeginTime: moment(
        this.BackupConfigForm.value?.BackupBeginTime
      ).format('HH:mm'),
    };
    this._BackupService.addBackupConfig(body).subscribe((value) => {
      this.BackupConfigForm.reset();
      this.getBackupConfig();
    });
  }
  getBackupConfig() {
    this._BackupService.getBackupConfig().subscribe((value) => {
      this.BackupsConfig = value;
      this.getLocations();
      this.cdr.detectChanges();
    });
  }
  getLocations() {
    this._BackupService.GetLocation().subscribe((value) => {
      this.Locations = value.filter(
        (value: any) =>
          !this.BackupsConfig.find(
            (Backup: any) => Backup.LocationId == value.LocationId
          )
      );
      this.cdr.detectChanges();
    });
  }
  deleteTemplateSelected() {
    this._BackupService
      .deleteTemplateSelected(this.itemTemplateSelectedDeleted.Id)
      .subscribe((value: any) => {
        if (value.rv) {
          this.getTemplateSelected();

          // this.TemplateSelected.forEach((value, index) => {
          //   if (value.Id == this.itemTemplateSelectedDeleted.Id) {
          //     this.AllTemplateWithoutSelected.push({
          //       Id: value.Id,
          //       Template: value.TemplateTitle,
          //     });
          //     this.TemplateSelected.splice(index, 1);
          //   }
          // });
          this.toastr.success(value.Msg);
        }
        this.cdr.detectChanges();
      });
  }
  deleteBackupConfig() {
    this._BackupService
      .deleteBackupConfig(this.itemBackupConfigDeleted.Id)
      .subscribe((value: any) => {
        if (value.rv > 0) {
          // this.BackupsConfig.forEach((value, index) => {
          //   if (value.Id == this.itemBackupConfigDeleted.Id) {
          //     this.Locations.push({
          //       LocationId: this.itemBackupConfigDeleted.LocationId,
          //       LocationName: this.itemBackupConfigDeleted.LocationName,
          //     });
          //     this.BackupsConfig.splice(index, 1);
          //   }
          // });
          this.getBackupConfig();
          this.toastr.success(value.Msg);
        }
        this.cdr.detectChanges();
      });
  }
  downloadBackupForLocation(item: any) {
    item.loading = true;


    this._BackupService
      .downloadBackupExcelFile(item.LocationId)
      .subscribe((value: any) => {

        if (value && value != '') {
          let blob = new Blob([value], {
            type: 'application/vnd.ms-excel',
          }); // may change
          // let url = window.URL.createObjectURL(blob);
          // let pwa = window.open(url);
          saveAs(blob, item.LocationName);
        }
        item.loading = false;
        this.cdr.detectChanges();
      });
  }
}
