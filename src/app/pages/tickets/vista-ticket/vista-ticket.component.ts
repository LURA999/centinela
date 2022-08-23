import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { UsuarioService } from 'src/app/core/services/user.service';

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
export interface datosUsuario {
  apellidoMaterno: string
  apellidoPaterno: string
  celular: number
  correo: string
  cveRol: number
  estatus: number
  idContacto: number
  idServicio: number
  usuario: string
  puesto: string
  rol: string
  servicio: string
  telefono: number
}


@Component({
  selector: 'app-vista-ticket',
  templateUrl: './vista-ticket.component.html',
  styleUrls: ['./vista-ticket.component.css']
})


export class VistaTicketComponent implements AfterViewInit,OnInit {
  mobileQuery: MediaQueryList;
  position : boolean = false
  moveProp : boolean = false
  moveDatos : boolean = false
  open : number = 0
  datosTicket : any 
  date : Date = new Date()
  idTicket : number = Number(this.ruta.url.split("/")[4]) 
  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };
  filteredOptions: Observable<datosUsuario[]> | undefined;
  usuarios : any
  options: string[] = [];
  myControl = new FormControl('');
  @ViewChild("propiedades") side! : MatSidenav;
  load : boolean = false
  variable : string = "hola";
  form: FormGroup = this.fb.group({
    cveGrupo : [''],
    cveUsuario : [''],
    tipo : [''],
    estado : [''],
    prioridad : ['']
  })

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private servTicket:TicketService,
    private ruta: Router,
    private fb:FormBuilder,
    private usarioservice : UsuarioService) {       
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    
  }

  ngOnInit(): void {
    this.llamarUnTicket()
  }

 async llamarUnTicket(){
  this.datosTicket = (await lastValueFrom(this.servTicket.llamarTicket(this.idTicket))).container[0]
  console.log(this.datosTicket);
  this.load = true;
  this.buscarUsuarios(this.datosTicket.cveGrupo)

     
  }

  buscarUsuarios(cve:number){
    this.usarioservice.usuariosGrupo(cve).subscribe((resp:responseService)=>{
      if(resp.status === "not found"){
        this.usuarios = []
      }else{
       this.usuarios = resp.container;
      }    
      this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nombre = typeof value === 'string' ? value : value?.usuario;
       return nombre ? this._filter(nombre as string) : this.usuarios.slice();
      }),
    );     
    
    this.myControl.setValue(this.datosTicket.usuario)   

    })

    
  }  

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.usuarios.filter((option: any) => option.nombre.toLowerCase().includes(filterValue));
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
