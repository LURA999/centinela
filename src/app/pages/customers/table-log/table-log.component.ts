import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-log',
  templateUrl: './table-log.component.html',
  styleUrls: ['./table-log.component.css']
})
export class TableLogComponent implements OnInit {
  ELEMENT_DATA : any = [{
    id:"1",
    tipo:"1",
    descripcion:"1",
    fecha:"1",
    usuario:"1",
    opciones:"1"
  }]

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'tipo', 'descripcion', 'fecha', 'usuario','opciones'];
  constructor() { }

  ngOnInit(): void {
  }

}
