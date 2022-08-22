import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

import { NotifierService } from 'angular-notifier';

export interface Comment {
  mensaje: string;
  usuarioRespondido : string;
  creado? : string;
  asunto? : string;
  informado? : string;
  dispositivo? : string;
  fecha : string;
  grupo? : string;
  agente? : string;

}

export interface cerrado {

}

export interface respondiendo {

}

export interface escalado {

}

export interface asunto {

}

@Component({
  selector: 'app-vista-ticket',
  templateUrl: './vista-ticket.component.html',
  styleUrls: ['./vista-ticket.component.css']
})


export class VistaTicketComponent implements AfterViewInit {
  mobileQuery: MediaQueryList;
  position : boolean = false
  moveProp : boolean = false
  moveDatos : boolean = false
  open : number = 0
  date : Date = new Date()
  idTicket : number = Number(this.ruta.url.split("/")[4]) 
  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };

  @ViewChild("propiedades") side! : MatSidenav;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private ruta: Router) {       
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    
  }

  desplazarNavPropiedades(){    
    if ( Number(window.innerWidth) >= 1000) {
      if(this.moveProp == false){
        this.moveProp = true;
      }else{
        this.moveProp = false;
      }
    }
  }

  desplazarNavDatosContacto(){
    if ( Number(window.innerWidth) >= 1000) {
      if(this.moveDatos == false){
        this.moveDatos = true;
      }else{
        this.moveDatos = false;
      }      
    }
  }

  cambiarResponsive() :Number{
    if ( Number(window.innerWidth) >= 1000 && screen.width >= 1000) {
      this.position = false
    } else {
      this.moveDatos = false;
      this.moveProp = false;
      this.position = true
    }
    this.open = window.innerWidth
  return window.innerWidth    
  }


  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();    
  }
  
  comment: Comment[] = [
    {mensaje: 'One', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Two', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Three', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Four', usuarioRespondido:"Alonso Luna",fecha:"3-03-22"},
    {mensaje: 'One', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Two', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Three', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Four', usuarioRespondido:"Alonso Luna",fecha:"3-03-22"},
    {mensaje: 'One', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Two', usuarioRespondido:"Alonso Luna",fecha:"3-03-22"},
    {mensaje: 'Three', usuarioRespondido:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Four', usuarioRespondido:"Alonso Luna",fecha:"3-03-22"},
  ];
}
