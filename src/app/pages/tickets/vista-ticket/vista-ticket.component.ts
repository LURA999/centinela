import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { NotifierService } from 'angular-notifier';

export interface Comment {
  mensaje: string;
  usuarioPrincipal : string;
  creado? : string;
  asunto? : string;
  fecha : string;

}

@Component({
  selector: 'app-vista-ticket',
  templateUrl: './vista-ticket.component.html',
  styleUrls: ['./vista-ticket.component.css']
})


export class VistaTicketComponent implements AfterViewInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private readonly notifier: NotifierService;
  position : boolean = false
  moveProp : boolean = false
  moveDatos : boolean = false
  open : number = 0

  @ViewChild("propiedades") side! : MatSidenav;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    notifierService: NotifierService,
    private renderer2 : Renderer2) { 
      
    this.notifier = notifierService;
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

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
    {mensaje: 'One',asunto:"Problema 1 ", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Two',asunto:"Problema 2", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Three',asunto:"Problema 3", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Four',asunto:"Problema 4", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22"},
    {mensaje: 'One',asunto:"Problema 1", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Two',asunto:"Problema 2", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Three',asunto:"Problema 3", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Four',asunto:"Problema 4", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22"},
    {mensaje: 'One',asunto:"Problema 1", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Two',asunto:"Problema 2" , usuarioPrincipal:"Alonso Luna",fecha:"3-03-22"},
    {mensaje: 'Three',asunto:"Problema 3", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22" },
    {mensaje: 'Four',asunto:"Problema 4", usuarioPrincipal:"Alonso Luna",fecha:"3-03-22"},
  ];
}
