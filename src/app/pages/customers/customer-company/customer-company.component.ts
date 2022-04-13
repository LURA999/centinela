import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer-company',
  templateUrl: './customer-company.component.html',
  styleUrls: ['./customer-company.component.css']
})
export class CustomerCompanyComponent implements OnInit {

  ELEMENT_DATA_TICKETS : any = [{
    id:"1",
    nombre:"1",
  }]

  dataSourceTickets = new MatTableDataSource(this.ELEMENT_DATA_TICKETS);
  displayedColumnsTickets: string[] = ['id', 'nombre'];
  constructor() { }

  ngOnInit(): void {
  }

}
