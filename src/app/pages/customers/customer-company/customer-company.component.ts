import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer-company',
  templateUrl: './customer-company.component.html',
  styleUrls: ['./customer-company.component.css']
})
export class CustomerCompanyComponent implements OnInit {
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

  ELEMENT_DATA_VENDEDORES : any = [{
    id:"1",
    nombre:"1",
  }]

  ELEMENT_DATA_TICKETS : any = [{
    id:"1",
    nombre:"1",
  }]

  dataSourceVendedores = new MatTableDataSource(this.ELEMENT_DATA_VENDEDORES);
  dataSourceTickets = new MatTableDataSource(this.ELEMENT_DATA_TICKETS);
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nombre', 'rs', 'ip', 'estado','ciudad','servicio','estatus','opciones'];
  displayedColumnsVendedores: string[] = ['id', 'nombre'];
  displayedColumnsTickets: string[] = ['id', 'nombre'];
  constructor() { }

  ngOnInit(): void {
  }

}
