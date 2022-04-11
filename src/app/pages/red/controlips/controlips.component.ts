import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguracionComponent } from '../popup/configuracion/configuracion.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { IpService } from './../../../core/services/ip.service';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SegmentsService } from './../../../core/services/segments.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-controlips',
  templateUrl: './controlips.component.html',
  styleUrls: ['./controlips.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class ControlipsComponent implements OnInit {

  ELEMENT_DATA: any = [ ];
  segmentos: any = [ ];
  $sub :  Subscription = new Subscription();
  ips :any =[ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['ip', 'tipoip', 'utilizado', 'tipoequipo', 'ping','opciones'];
  inicio : number=0;
  fin : number=10;
  monitoreo : any
  ping : string =""
  @ViewChild ("paginator") paginator2:any;

  constructor(private dialog:NgDialogAnimationService, private ipService : IpService, private segmentoService : SegmentsService) { 
    this.procedmiento();

  }

  ngOnInit(): void {   
  }

  async procedmiento(){
    await this.ipServicios();
    await this.segmentosArray();
    await this.cargarInicio();
  }

  async segmentosArray(){
    this.segmentos  = await this.segmentoService.llamarSegments().toPromise();
    this.segmentos = this.segmentos.container;
    
  }

 async ipServicios(){
  this.ips =await this.ipService.select().toPromise();
  this.ips = this.ips.container;
 }

  Configuracion(){
    let dialogRef  = this.dialog.open(ConfiguracionComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
  }

async pageEvents(event: any) {  
    if(event.previousPageIndex > event.pageIndex) {
    this.inicio = (this.inicio-(this.inicio%10)) - 20;
    if(this.inicio < 0){
      this.inicio = 0;
    }
    this.fin =  (this.fin - (this.fin%10)) - 10;
    await this.cargarInicio();
  } else {
    this.inicio = this.fin;
    this.fin = this.fin + 10;
    await this.cargarInicio();
  }
}


async cargarInicio(){
  this.ELEMENT_DATA=[];
  this.dataSource = new MatTableDataSource();

 while (this.inicio < this.fin + 2 && this.inicio < this.ips.length) {
  if(this.inicio < this.fin){        
    
    this.monitoreoPing(this.ips[this.inicio].ip, this.inicio)

    this.ELEMENT_DATA[this.inicio] =  (    
      {
        ip: this.ips[this.inicio].ip,
        tipoip: this.ips[this.inicio].tipo,
        utilizado: "----",
        tipoequipo: "-----",
        ping: this.ips[this.inicio].ping,
      });        
    }
  this.inicio++      
  }

  this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  this.dataSource.paginator = this.paginator2;    
  this.paginator2.length = await this.ips.length;   
  }

  async filtrar(segmento :string,segmento2 :string){
    this.paginator2.firstPage();  
    this.inicio =0;
    this.fin =10;
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.ips = await this.ipService.selectIp(segmento, segmento2).toPromise();
    this.ips= await this.ips.container;   
    
    while  (this.inicio < this.fin + 2 && this.inicio < this.ips.length) {
      if(this.inicio < this.fin){        
        this.monitoreoPing(this.ips[this.inicio].ip, this.inicio)
        this.ELEMENT_DATA[this.inicio] =  (    
          {
            ip: this.ips[this.inicio].ip,
            tipoip: this.ips[this.inicio].tipo,
            utilizado: "----",
            tipoequipo: "-----",
            ping: this.ips[this.inicio].ping,
          });        
        }
      this.inicio++      
      }
  
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator2;    
    this.paginator2.length = await this.ips.length;   
    this.paginator2.firstPage();
  }

   async monitoreoPing( ip : string, i : number){   
    this.$sub.add(await this.ipService.ping(ip).subscribe((resp:any) => {
      this.ping = resp.container.status
      this.ELEMENT_DATA[i].ping = this.ping;
    }))
   
    
    
  }

  async buscar(clave:string){
    
    if(clave.length > 0){

    }else{
      console.log(clave.length);

      this.$sub.unsubscribe();
      this.inicio = 0;
      this.fin =10;
      this.paginator2.firstPage();
      await this.cargarInicio();
    }
  }
}
