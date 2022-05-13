import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DataService } from 'src/app/core/services/data.service';


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
  $sub = new Subscription()
  load : boolean = false
   
  ELEMENT_DATA_TICKETS : any = [
    {
    id:"1",
    nombre:"1",
    }
  ];

  navLinks = [
    {
      label: 'Servicios',
      link: './',
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
    }, {
      label: 'Log',
      link: './log',
      index: 4
    }
  ];
  
  activeLink = this.navLinks[0].link;

  background: ThemePalette = undefined;
  id :number = this.rutaActiva.snapshot.params["id"];

  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  dataSourceTickets = new MatTableDataSource(this.ELEMENT_DATA_TICKETS);
  displayedColumnsTickets: string[] = ['id', 'nombre'];

  constructor(private serviceCustomer : CustomerService, private rutaActiva : ActivatedRoute,private DataService : DataService ) { 
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
    this.$sub.add(await this.serviceCustomer.buscarCliente(this.id).subscribe((resp : responseService) =>{
      this.datos = resp.container[0];
      this.load = true;
    }))
  }catch(Exception){}
  }

  agregar(form : Boolean){
    this.DataService.open.emit(form);
  }

  descargar(form : Boolean){
    this.DataService.open.emit(form);
  }

  ngOnDestroy(): void {

  }
}
