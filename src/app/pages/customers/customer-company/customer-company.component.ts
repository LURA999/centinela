import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';


@Component({
  selector: 'app-customer-company',
  templateUrl: './customer-company.component.html',
  styleUrls: ['./customer-company.component.css']
})
export class CustomerCompanyComponent implements OnInit {
  clickDownload: number = 0
  clickAdd : number = 0
  padre : string = ""
  nombreEmpresa : string  = ""
  cargando : boolean = false;
  datos : any;
  metodo  = new RepeteadMethods()
  load : boolean = false
   
  ELEMENT_DATA_TICKETS : any = [
    {
    id:"1",
    nombre:"1",
    }
  ];

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
  id :number = this.rutaActiva.snapshot.params["id"];

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  dataSourceTickets = new MatTableDataSource(this.ELEMENT_DATA_TICKETS);
  displayedColumnsTickets: string[] = ['id', 'nombre'];

  constructor(private serviceCustomer : CustomerService, private rutaActiva : ActivatedRoute ) { 
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTickets.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.datosCliente()

  }

  async datosCliente() {
    try{
     await this.serviceCustomer.buscarCliente(this.id).subscribe((resp : responseService) =>{
      this.datos = resp.container[0];
      this.load = true;
    })
  }catch(Exception){}
  }

  eventoTab(){
    this.padre =  ""
    this.clickAdd =  0
    this.clickDownload =  0    
  }

  cambiar1(){
      this.padre = "a"+this.clickAdd++
  }

  cambiar2(){
    this.padre = "d"+this.clickDownload++

  }
}