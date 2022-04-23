import { Component, OnInit } from '@angular/core';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NuevaimagenComponent } from '../nuevaimagen/nuevaimagen.component';

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

  
}
