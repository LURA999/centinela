import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguracionComponent } from '../configuracion/configuracion.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';


@Component({
  selector: 'app-controlips',
  templateUrl: './controlips.component.html',
  styleUrls: ['./controlips.component.css']
})
export class ControlipsComponent implements OnInit {
  ELEMENT_DATA: any = [
  
      {
      ip: "ejemplo",
      tipoip: "ejemplo",
      utilizado: "ejemplo",
      tipoequipo:"ejemplo",
      ping:"ejemplo",
      opciones:"ejemplo",
      }
  
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['ip', 'tipoip', 'utilizado', 'tipoequipo', 'ping','opciones'];

  constructor(private dialog:NgDialogAnimationService) { 
   
  }

  ngOnInit(): void {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  Configuracion(){
    let dialogRef  = this.dialog.open(ConfiguracionComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
}
}
