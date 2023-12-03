import { Component, OnInit } from '@angular/core';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MapCardComponent } from 'src/app/shared/components/google-map/dilogGoogleMapSingleMarker/map-card/map-card.component';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-extra-fields',
  templateUrl: './extra-fields.component.html',
  styleUrls: ['./extra-fields.component.scss']
})
export class ExtraFieldsComponent implements OnInit {
  files: any;
  title = 'micRecorder';
  //Lets declare Record OBJ
  record: any;
  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  url: any;
  error: any;
  formEdit = new UntypedFormGroup({
    LocationId: new UntypedFormControl(null, Validators.required),
    LocationName: new UntypedFormControl(null, Validators.required),
    TimeZoneId: new UntypedFormControl(null, Validators.required),
    ExtraInformation: new UntypedFormControl(null),
    Longitude: new UntypedFormControl(null),
    Latitude: new UntypedFormControl(null),
    Zoom: new UntypedFormControl(null),
    DefaultBudgetId: new UntypedFormControl(null),
  });
  constructor(private domSanitizer: DomSanitizer, public dialog: MatDialog,private translate: TranslateService,) {
  }
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  /**
   * Start recording.
   */
  initiateRecording() {

    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
   * Will be called automatically.
   */
  successCallback(stream: any) {
    var options: any = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      sampleRate: 50000,
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    console.log("url", this.url);
  }
  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

  ngOnInit(): void {
  }


  openMap() {
    const dialogRef = this.dialog.open(MapCardComponent, {
      width: '50vw',
      data: { ...this.formEdit.value },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result,"resultresultresult");
      
      if (result) {
        this.formEdit.controls['Longitude'].setValue(result.Longitude);
        this.formEdit.controls['Latitude'].setValue(result.Latitude);
        this.formEdit.controls['Zoom'].setValue(result.Zoom);
      }
    });
  }


  SaveNewValue(files: any) {
    this.files = files;
    console.log(this.files);
    
  }

}
