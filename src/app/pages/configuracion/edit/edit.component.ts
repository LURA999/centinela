import { Component, OnInit } from '@angular/core';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NuevaimagenComponent } from '../nuevaimagen/nuevaimagen.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private dialog:NgDialogAnimationService) { }

  ngOnInit(): void {
  }
async nuevaimagen(){
  let dialogRef = await this.dialog.open(NuevaimagenComponent,
    {
    animation: { to: "bottom" },
    height:"300px", width:"300px",
    });
}


}
function nuevaimagenComponent(nuevaimagenComponent: any) {
  throw new Error('Function not implemented.');
}
