import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-repeater',
  templateUrl: './new-repeater.component.html',
  styleUrls: ['./new-repeater.component.css']
})
export class NewRepeaterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  crearCliente(select : string,empresa : string ,nombre : string){

  }

}
