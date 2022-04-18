import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { DeleteComponent } from '../popup/delete/delete.component';

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
  @Input() hijo :string ="";

  ELEMENT_DATA : any = [{
    num:"1",
    departamento:"1",
    asunto:"1",
    servicio:"1",
    fechaCerrada:"1",
    fechaAbierta:"1",
    estado:"1",
    agente:"2",
    opciones:"1"
  }]

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['num', 'departamento', 'asunto', 'servicio', 'fechaCerrada','fechaAbierta','estado','agente','opciones'];

  ngOnChanges(): void {

    
    if(this.hijo[0] == "d"){
     
    }else if(this.hijo[0] == "a"){
      
    }
    
    
  }
  constructor( private dialog:NgDialogAnimationService) { }

  ngOnInit(): void {
    
  }

  async mensaje(mensaje : string){
    await console.log(mensaje);
    
  }

}
