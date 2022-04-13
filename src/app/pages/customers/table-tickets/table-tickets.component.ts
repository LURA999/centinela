import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
  }

}
