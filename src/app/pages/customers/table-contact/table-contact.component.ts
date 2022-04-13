import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-contact',
  templateUrl: './table-contact.component.html',
  styleUrls: ['./table-contact.component.css']
})
export class TableContactComponent implements OnInit {
  ELEMENT_DATA : any = [{
    id:"1",
    nombre:"1",
    rs:"1",
    ip:"1",
    estado:"1",
    ciudad:"1",
    servicio:"1",
    estatus:"2",
    opciones:"1"
  }]

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nombre', 'rs', 'ip', 'estado','ciudad','servicio','estatus','opciones'];
  constructor() { }

  ngOnInit(): void {
  }

}