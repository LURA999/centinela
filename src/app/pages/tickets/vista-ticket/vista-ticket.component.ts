import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom, map, Observable, startWith, Subscription } from 'rxjs';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { UsuarioService } from 'src/app/core/services/user.service';
import { IpService } from 'src/app/core/services/ip.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { pingDatos } from 'src/app/interfaces/pingDatos.interface';
import { RepeteadMethods } from '../../RepeteadMethods';
import { dosParamsNum } from 'src/app/interfaces/dosParamsNum.interface';
import { usuario } from '../all-tickets/all-tickets.component';

export interface Comment {
  mensaje?: string;
  usuarioRespondido : string;
  creado? : string;
  asunto? : string;
  informado? : string;
  dispositivo? : string;
  fecha : string;
  grupo? : string;
  agente? : string;
  color : string;
  cerrar? : boolean;
  actualizar? : boolean;
  normal?:boolean;
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
  usuarios : any [] = []
  options: string[] = [];
  myControl = new FormControl('');
  
  form: FormGroup = this.fb.group({
    cveGrupo : [''],
    cveUsuario : [''],
    tipo : [''],
    estado : [''],
    prioridad : ['']
  })

  //agente seleccionado nuevo y viejo
  agenteNuevo! : usuario 
  usuarioSinEditar! : usuario

  //Para guardar los repetidores de los diferentes dispositivos
  repetidoras : Array<string> = new Array()

  //INTERFACES O MODELOS
  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []

  metodos = new RepeteadMethods()
  $sub = new Subscription()

  comment: Comment[] = [
    { mensaje: 'Este es un comentario de prueba', usuarioRespondido:"Alonso Luna",fecha:"3-03-22", color:"#F5F8FA" }, // comentario normal
    { usuarioRespondido:"Jorge Alonso Luna Rivera",fecha:"3-03-22",grupo:"soporte",agente:"luis mariano", color:"#E6FFDE" }, //escalado
    { usuarioRespondido: "Ruben garcia garcia", fecha:'1-3-4',cerrar:true,color:"#DBFAFF"}, //cuando se cierra ticket
    { mensaje: 'Comentario privado', usuarioRespondido:"Alonso Luna",fecha:"3-03-22", color:"#F5F8FA",normal:false }, //comentario privado
    { mensaje: 'Actualizo', usuarioRespondido:"Alonso Luna",fecha:"3-03-22", color:"#F5F8FA",actualizar:true }
  ];

  /*{ mensaje: 'Este es un comentario de prueba', usuarioRespondido:"Alonso Luna",fecha:"3-03-22", color:"#F5F8FA" }, // comentario normal
  { usuarioRespondido:"Jorge Alonso Luna Rivera",fecha:"3-03-22",grupo:"soporte",agente:"luis mariano", color:"#E6FFDE" }, //escalado
  { usuarioRespondido: "Ruben garcia garcia", fecha:'1-3-4',cerrar:true,color:"#DBFAFF"}, //cuando se cierra ticket
  { mensaje: 'Comentario privado', usuarioRespondido:"Alonso Luna",fecha:"3-03-22", color:"#F5F8FA",normal:false }, //comentario privado
  { mensaje: 'Actualizo', usuarioRespondido:"Alonso Luna",fecha:"3-03-22", color:"#F5F8FA",actualizar:true }, // ticket actualizado*/

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private servTicket:TicketService,
    private ruta: Router,
    private fb:FormBuilder,
    private usarioservice : UsuarioService, 
    private ipService : IpService,
    private deviceService : DeviceService,
    private ticketService: TicketService
    ) {       
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
  
  }

  ngOnInit(): void {
    this.llamarUnTicket()
    
  }

 
scrollComentarios(event : any){  
  if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    
  }
  
}
 async llamarUnTicket(){
  
  this.datosTicket = (await lastValueFrom(this.servTicket.llamarTicket(this.idTicket))).container[0]
  this.form.controls["cveGrupo"].setValue(this.datosTicket.cveGrupo.toString())
  this.form.controls["tipo"].setValue(this.datosTicket.tipo.toString())
  this.form.controls["prioridad"].setValue(this.datosTicket.prioridad.toString())
  this.form.controls["estado"].setValue(this.datosTicket.estado.toString())

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

  this.buscarUsuarios(this.datosTicket.cveGrupo)  
  }

  buscarUsuarios(cve:number){
    this.usarioservice.usuariosGrupo(cve).subscribe(async(resp:responseService)=>{
      if(resp.status === "not found"){
        this.usuarios = []
      }else{        
        for await (const usuario of resp.container) {
          this.usuarios.push(usuario)        
        }
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
    return this.usuarios.filter((option: any) => option.usuario.toLowerCase().includes(filterValue));
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


  async guardarGrupo(cve:StringConstructor){ 
    let dosParamsNumGrupo:dosParamsNum = {
      cve : Number(cve),
      cve2 : this.idTicket
    } 
  
    let dosParamsNumAgente:dosParamsNum = {
      cve : 0,
      cve2 : this.idTicket 
    } 
      await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))
      await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNumAgente))
      
    }  

  async agenteGuardar(cve:number){
    if(cve > 0){
    let dosParamsNum:dosParamsNum = {
      cve : cve,
      cve2 : this.idTicket
    } 
    console.log(cve);
    
      await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNum))
    }
  }

  async guardarEstado(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket
      } 
        await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      }
  }

  async guardarPrioridad(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket
      } 
        await lastValueFrom(this.ticketService.actualizarPropiedad(dosParamsNum))
      }
  }

  async guardarTipo(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket
      } 
        await lastValueFrom(this.ticketService.actualizarTipo(dosParamsNum))
      }
  }

  async eliminarTicket(){
    let eliminarTicket : dosParamsNum ={
      cve:this.idTicket,
      cve2:0
    }
    await lastValueFrom(this.ticketService.deleteTickets(eliminarTicket))
  }

  async cerrarTicket(){
    let dosParamsNum : dosParamsNum = {
      cve:4,
      cve2:this.idTicket
    }
    await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
  }


  autoCompleteAgente(e : usuario){
    this.agenteNuevo = e
    this.myControl.setValue(e.usuario)
  }

  actualizar4params(){    
    this.usuarioSinEditar = this.datosTicket.tipo
    

    if(this.agenteNuevo !== undefined){      
      this.agenteGuardar(this.agenteNuevo.idUsuario)  
    }

    if(this.datosTicket.tipo.toString() !== this.form.controls["tipo"].value.toString()){
      this.guardarTipo(this.form.controls["tipo"].value)
    }

    if(this.datosTicket.prioridad.toString() !== this.form.controls["prioridad"].value.toString()){
      this.guardarPrioridad(this.form.controls["prioridad"].value)
    }
    
    if(this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){
      this.guardarGrupo(this.form.controls["cveGrupo"].value)
    }

    if(this.datosTicket.estado !== this.form.controls["estado"].value){
      this.guardarEstado(this.form.controls["estado"].value)
    }


  }
}
