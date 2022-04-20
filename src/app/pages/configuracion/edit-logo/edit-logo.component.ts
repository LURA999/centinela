import { Component, OnInit } from '@angular/core';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NuevaimagenComponent } from '../nuevaimagen/nuevaimagen.component';
import {CroppedEvent} from 'ngx-photo-editor';

@Component({
  selector: 'app-edit-logo',
  templateUrl: './edit-logo.component.html',
  styleUrls: ['./edit-logo.component.css']
})
export class EditLogoComponent implements OnInit {
  imageChangedEvent: any;
  base64: any;
  constructor(private dialog:NgDialogAnimationService) { }

  ngOnInit(): void {
  }
  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event.base64;
  }

  
}
