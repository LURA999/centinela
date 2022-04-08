import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguracionComponent } from '../configuracion/configuracion.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { IpService } from 'src/app/services/ip.service';
import { MatSort } from '@angular/material/sort';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SegmentsService } from 'src/app/services/segments.service';

@Component({
  selector: 'app-controlips',
  templateUrl: './controlips.component.html',
  styleUrls: ['./controlips.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class ControlipsComponent implements OnInit {

  ELEMENT_DATA: any = [ ];
  segmentos: any = [ ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['ip', 'tipoip', 'utilizado', 'tipoequipo', 'ping','opciones'];
  inicio : number=0;
  fin : number=10;
  @ViewChild ("paginator") paginator2:any;

  constructor(private dialog:NgDialogAnimationService, private ipService : IpService, private segmentoService : SegmentsService) { 
  this.imprimirIps();
  this.IPs();
  }

  ngOnInit(): void {
   console.log(this.monitoreoPing());
    
  }

  async IPs(){
    this.segmentos  = await this.segmentoService.llamarSegments().toPromise();
    this.segmentos = this.segmentos.container;
    
  }

  async imprimirIps(){
    let x : any = await this.ipService.select().toPromise();
    x = x.container;      
    
  for (const z of x) {        
      this.ELEMENT_DATA.push({
        ip: z.ip,
        tipoip: z.tipo,
        utilizado: "------",
        tipoequipo:"------",
        ping: "---",
        opciones:"ejemplo",
      });    
    }

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator =  this.paginator2;    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.cargarInicio();
  } else {
    this.inicio = this.fin;
    this.fin = this.fin + 10;
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.cargarInicio();
  }
}

async cargarInicio(){
  console.log(this.segmentos);
  
 while ( this.inicio <this.fin + 2 && this.inicio < this.segmentos.length) {

   
  if(this.inicio < this.fin){    
    this.ELEMENT_DATA[this.inicio] =(    
        {
          'ip': this.segmentos[this.inicio].ip,
          'tipoip': this.segmentos[this.inicio].tipo,
          'utilizado': "----",
          'tipoequipo': "-----",
          'ping': "----",
         
        });
      this.inicio++      
  }

  this.dataSource = await new MatTableDataSource(this.ELEMENT_DATA);
  this.dataSource.paginator = await this.paginator2; 
  this.paginator2.length = await this.segmentos.length;
   
  }
}

  async filtrar(segmento :string,segmento2 :string){
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    let x : any = await this.ipService.selectIp(segmento, segmento2).toPromise();
    x = x.container;      
        
  for (const z of x) {            
      this.ELEMENT_DATA.push({
        ip: z.ip,
        tipoip: z.tipo,
        utilizado: "----",
        tipoequipo:"------",
        ping: "-----",
        opciones:"ejemplo",
      });    
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator =  this.paginator2;    
  }

  async monitoreoPing(){
 return await this.ipService.ping("10.1.5.20").toPromise()
  }
}
