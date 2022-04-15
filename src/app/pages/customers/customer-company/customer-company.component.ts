import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';

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

  links = [
    {
        label: 'Servicios',
        link: './service',
        index: 0
    }, {
        label: 'Tickets',
        link: './ticket',
        index: 1
    }, {
        label: 'Contactos',
        link: './contact',
        index: 2
    }, {
      label: 'R.S.',
      link: './rs',
      index: 3
  }, 
];
  
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  dataSourceTickets = new MatTableDataSource(this.ELEMENT_DATA_TICKETS);
  displayedColumnsTickets: string[] = ['id', 'nombre'];
  constructor() { }

  ngOnInit(): void {
  }

  eventoTab(event:any){
    
  }

}
