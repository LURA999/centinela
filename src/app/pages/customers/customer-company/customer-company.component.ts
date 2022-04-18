import { Component, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-customer-company',
  templateUrl: './customer-company.component.html',
  styleUrls: ['./customer-company.component.css']
})
export class CustomerCompanyComponent implements OnInit {
  clickDownload: number =0
  clickAdd : number =0
  padre : string =""
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

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTickets.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    
  }

  eventoTab(event:any){
    this.padre = ""
    this.clickAdd = 0
    this.clickDownload = 0
  }

  cambiar1(){
      this.padre = "a"+this.clickAdd++
  }

  cambiar2(){
    this.padre = "d"+this.clickDownload++

  }


}
