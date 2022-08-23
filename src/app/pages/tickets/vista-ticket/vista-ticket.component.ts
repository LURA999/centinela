import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { lastValueFrom, map, Observable, startWith, Subscription } from 'rxjs';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { UsuarioService } from 'src/app/core/services/user.service';
import { IpService } from 'src/app/core/services/ip.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { pingDatos } from 'src/app/interfaces/pingDatos.interface';
import { RepeteadMethods } from '../../RepeteadMethods';

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
  //Para guardar los repetidores de los diferentes dispositivos
  repetidoras : Array<string> = new Array()

  //INTERFACES O MODELOS
  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []

  metodos = new RepeteadMethods()
  $sub = new Subscription()


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


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private servTicket:TicketService,
    private ruta: Router,
    private fb:FormBuilder,
    private usarioservice : UsuarioService, 
    private ipService : IpService,
    private deviceService : DeviceService,
    ) {       
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    
  }

  ngOnInit(): void {
    this.llamarUnTicket()
  }

 async llamarUnTicket(){
  
  this.datosTicket = (await lastValueFrom(this.servTicket.llamarTicket(this.idTicket))).container[0]

  /**Pidiendo pings para los otros equipos*/
  this.ipService.selectIpOneEquipament(0,this.datosTicket.identificador,3,this.datosTicket.contador).subscribe(async(resp:responseService) =>{      
    if(resp.status === "not found"){
    }else{
      for (let i =0; i<resp.container.length; i++) {
        if(Number(this.repetidoras.indexOf(resp.container[i].repetidora)) == -1){
          this.repetidoras.push(resp.container[i].repetidora)
        }

        this.monitoreoPing(resp.container[i].ip, i,this.pingOtro)  
        this.pingOtro.push( {
          idDevice :resp.container[i].idOtro,
          nombre : resp.container[i].nombre,
          ip :  resp.container[i].ip,
          ping:"cargando",
          color : ""
        })
      }
      
    }
    
  })

  //pidiendo ping para routers
  this.ipService.selectIpOneRouter(0,this.datosTicket.identificador,3,this.datosTicket.contador).subscribe(async(resp:responseService) =>{
    if(resp.status === "not found"){
    }else{
      for (let i =0; i<resp.container.length; i++) {
        if(Number(this.repetidoras.indexOf(resp.container[i].repetidora)) == -1){
          this.repetidoras.push(resp.container[i].repetidora)
        }

        this.monitoreoPing(resp.container[i].ip, i,this.pingRouter)  
          this.pingRouter.push( {
            idDevice :resp.container[i].idRouter,
            nombre : resp.container[i].nombre,
            ip :  resp.container[i].ip,
            ping: "cargando",
            color : ""
        })
      }
    }
  })

  //pidiendo ping para radios
  this.deviceService.todosRadios(this.datosTicket.identificador,this.datosTicket.contador).subscribe(async (resp:responseService)=>{
    if(resp.status === "not found"){
    }else{  
      for (let i =0; i<resp.container.length; i++) { 
        if(Number(this.repetidoras.indexOf(resp.container[i].repetidora)) == -1){
          this.repetidoras.push(resp.container[i].repetidora)
        }
        this.monitoreoPing(resp.container[i].ip, i,this.pingRadio)  
          this.pingRadio.push( {
            idDevice :resp.container[i].idRadio,
            nombre : resp.container[i].radio,
            ip :  resp.container[i].ip,
            ping:"cargando",
            color:""
        })
      }
    }      
  })
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
  
  /** Monitreo de ping */
  async monitoreoPing( ip : string, i : number,array:pingDatos[]) { 
    let ping : string = ""
    this.$sub.add(this.ipService.ping(ip).subscribe((resp:any) => {
      ping = resp.container.time
      
      try{
        array[i].ping = ping; 
        if(resp.container.status == "200"){
        if(Number(ping.replace(/[A-Za-z]+/,"")) <=40){
          array[i].color = "green";
        }else{
          array[i].color = "orange";
        }
      }else{
        array[i].color = "red";
      }
      return array[i]
      }catch(Exception){}
    })) 
  }
}
