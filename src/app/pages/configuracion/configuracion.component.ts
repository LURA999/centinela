import { Component, OnInit } from '@angular/core';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NuevaimagenComponent } from './nuevaimagen/nuevaimagen.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  

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

