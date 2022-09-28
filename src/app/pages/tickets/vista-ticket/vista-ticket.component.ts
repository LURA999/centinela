import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { AuthService } from 'src/app/core/services/auth.service';
import { enviarComentarioInterface } from 'src/app/interfaces/enviarComentario.interface';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { contains } from 'jquery';
import { contactsEmailTicket } from 'src/app/models/contactsEmailTicket.model';
interface Grupo{
value:number
viewValue:string
correo:string
}
interface Agente{
  value:number
  viewValue:string
  correo:string
  }
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
  contactsEmailTicket : contactsEmailTicket = new contactsEmailTicket() 
  Grupos:Grupo[]=[]
  Agentes:Agente[]=[]
correos:string []=[]
  mobileQuery: MediaQueryList;
  position : boolean = false
  moveProp : boolean = false
  moveDatos : boolean = false
  tipoComentario : boolean = true
  open : number = 0
  datosTicket : any 
  date : Date = new Date()
  idTicket : number = Number(this.ruta.url.split("/")[4].replace(/#Ancla/g, "")) 
  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };
  filteredOptions: Observable<datosUsuario[]> | undefined;
  usuarios : any [] = []
  options: string[] = [];
  textArea = new FormControl()
  myControl = new FormControl('');
  varDetalle : number | undefined  //Guarda una variable de la tabla detalle log_ticket_det
  form: FormGroup = this.fb.group({
    cveGrupo : [''],
    cveUsuario : [''],
    tipo : [''],
    estado : [''],
    prioridad : ['']
  })

  //agente seleccionado nuevo y viejo
  agenteNuevo : usuario | undefined

  //Para guardar los repetidores de los diferentes dispositivos
  repetidoras : Array<string> = new Array()

  //INTERFACES O MODELOS
  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []

  metodos = new RepeteadMethods()
  $sub = new Subscription()

  comment: Comment[] = [ ];

  constructor(
    private userservice:UsersmoduleService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private servTicket:TicketService,
    private ruta: Router,
    private fb:FormBuilder,
    private usarioservice : UsuarioService, 
    private ipService : IpService,
    private deviceService : DeviceService,
    private ticketService: TicketService,
    private auth : AuthService, 
    public regresar : Location
    ) {       
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this.idTicket = this.idTicket
    
    
  }

  ngOnInit(): void {    
    this.llamarCve();
    this.procedimiento()
  }
  
  //Metodo llamar Grupo
  async llamarCve(){
    await this.userservice.llamarGroup("Group").toPromise().then( (result : any) =>{
      
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"],correo: result.container[i]["correo"]})
    }
    })
   
  
  }

  async procedimiento(){
    await this.llamarUnTicket()
    await this.llamarVariantesDeTicket()
    await this.imprimirComentarios()
  }

 // codigo reservado para el futuro, lista con scroll infinito
 scrollComentarios(event : any){  
  if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    
  }
  
}

  async llamarUnTicket(){
   
    this.datosTicket = await (await lastValueFrom(this.servTicket.llamarTicket(this.idTicket))).container[0]
    console.log(this.datosTicket);
    
    this.form.controls["cveGrupo"].setValue(await this.datosTicket.cveGrupo)
    this.form.controls["tipo"].setValue(await this.datosTicket.tipo.toString())
    this.form.controls["prioridad"].setValue(await this.datosTicket.prioridad.toString())
    this.form.controls["estado"].setValue(await this.datosTicket.estado.toString())
    this.form.controls["cveUsuario"].setValue(await this.datosTicket.cveUsuario.toString())

  }

 async llamarVariantesDeTicket(){
  /*Pidiendo pings para los otros equipos*/
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

  this.buscarUsuarios(this.datosTicket.cveGrupo,true)  
  }

  buscarUsuarios(cve:number,inicio :boolean){

    this.usarioservice.usuariosGrupo(cve).subscribe(async(resp:responseService)=>{
      this.usuarios = []
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
    if(inicio){
      this.myControl.setValue(this.datosTicket.usuario)   
    }else{
      this.myControl.reset()
    } 
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
      cve2 : this.idTicket,
      cveUsuario : this.auth.getCveId()
    } 
  
    let dosParamsNumAgente:dosParamsNum = {
      cve : 0,
      cve2 : this.idTicket 
    } 
     this.varDetalle = await(await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))).container[0].max    
     await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNumAgente))
      console.log(this.varDetalle);
      
    }  

  async agenteGuardar(cve:number){
    let dosParamsNum:dosParamsNum = {
      cve : cve,
      cve2 : this.idTicket,
      cveUsuario: this.auth.getCveId(),
    
      cveLogDet: this.varDetalle 

    }
      await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNum))

     
      
  }

  async guardarEstado(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket,
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      }
  }

  async guardarPrioridad(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket,
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarPropiedad(dosParamsNum))
      }
  }

  async guardarTipo(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket,
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarTipo(dosParamsNum))
      }
  }

  async eliminarTicket(){
    let eliminarTicket : dosParamsNum ={
      cve:this.idTicket,
      cve2:0,
      cveUsuario: this.auth.getCveId()
    }
    await lastValueFrom(this.ticketService.deleteTickets(eliminarTicket))
  }

  async cerrarTicket(){
    let dosParamsNum : dosParamsNum = {
      cve:4,
      cve2:this.idTicket,
      cveUsuario: this.auth.getCveId()
    }
    await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
    await this.imprimirComentarios()
  }


  autoCompleteAgente(e : any){
    if( e.toString() === "Sin asignar"){
      this.agenteNuevo = {
        apellidoPaterno :"",
        appelidoMaterno : "",
        correo : "",
        nombres : "Sin asignar",
        idUsuario : 0,
        usuario : ""
      }
      this.myControl.setValue(e)
    }else{
    this.agenteNuevo = e
    this.myControl.setValue(e.usuario)
    }    
    
  }

  async actualizar4params(){    

    if(this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){
      await this.guardarGrupo(this.form.controls["cveGrupo"].value)
    }

    if(this.agenteNuevo !== undefined && this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){
      await this.agenteGuardar(this.agenteNuevo.idUsuario)
    }else{
      if(this.datosTicket.cveGrupo.toString() === this.form.controls["cveGrupo"].value.toString()
       && this.agenteNuevo !== undefined){
        await this.guardarGrupo(this.form.controls["cveGrupo"].value)
        await this.agenteGuardar(this.agenteNuevo!.idUsuario )
      }
    }

    if(this.datosTicket.tipo.toString() !== this.form.controls["tipo"].value.toString()){
      await this.guardarTipo(this.form.controls["tipo"].value)
    }

    if(this.datosTicket.prioridad.toString() !== this.form.controls["prioridad"].value.toString()){
      await this.guardarPrioridad(this.form.controls["prioridad"].value)
    }

    if(this.datosTicket.estado.toString() !== this.form.controls["estado"].value.toString()){
      await this.guardarEstado(this.form.controls["estado"].value)
    }

    if(this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){ 
     let grupo1= this.Grupos.find(element=>element.value==this.datosTicket.cveGrupo.toString())
     let grupo2=this.Grupos.find(element=>element.value==this.form.controls["cveGrupo"].value.toString())
   this.correos.push(grupo1!.correo).toString()
   this.correos.push(grupo2!.correo).toString()
   console.log(this.datosTicket.idUsuario);
   

   

   let agente1=this.usuarios.find(element=>element.idUsuario==this.datosTicket.cveUsuario.toString())
   let agente2=this.usuarios.find(element=>element.idUsuario==this.form.controls["cveUsuario"].value.toString())
   this.correos.push(agente1?.correo).toString()
   this.correos.push(agente2?.correo).toString()
  
   
      this.contactsEmailTicket.TextoAsunto="El Ticket se ha escalado del grupo:"+grupo1?.viewValue+" al grupo: "+grupo2?.viewValue
      this.contactsEmailTicket.correo=this.datosTicket.correoAbierto
      this.contactsEmailTicket.prioridad=this.metodos.prioridadEnLetraTicket(this.form.controls["prioridad"].value)
      this.contactsEmailTicket.servicio=this.datosTicket.servicio
      this.contactsEmailTicket.identificador=this.datosTicket.identificador
      this.contactsEmailTicket.nombreCliente=this.datosTicket.cliente
      this.contactsEmailTicket.nombreContacto=this.datosTicket.contacto
      this.contactsEmailTicket.correoCc=this.correos
      this.contactsEmailTicket.estatus=this.metodos.estadoEnLetraTicket(this.form.controls["estado"].value)



      await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket)) 
    }


    if( this.form.controls["estado"].value.toString()==4){

      let grupo2=this.Grupos.find(element=>element.value==this.form.controls["cveGrupo"].value.toString())
    this.correos.push(grupo2!.correo).toString()
 
    let creador=this.usuarios.find(element=>element.idUsuario==this.datosTicket.cveUsuario.toString())

    let agente2=this.usuarios.find(element=>element.idUsuario==this.form.controls["cveUsuario"].value.toString())
    this.correos.push(agente2?.correo).toString()

       this.contactsEmailTicket.TextoAsunto="El Ticket ha sido cerrado"
       this.contactsEmailTicket.correo=this.datosTicket.correoAbierto
       this.contactsEmailTicket.prioridad=this.metodos.prioridadEnLetraTicket(this.form.controls["prioridad"].value)
       this.contactsEmailTicket.servicio=this.datosTicket.servicio
       this.contactsEmailTicket.identificador=this.datosTicket.identificador
       this.contactsEmailTicket.nombreCliente=this.datosTicket.cliente
       this.contactsEmailTicket.nombreContacto=this.datosTicket.contacto
       this.contactsEmailTicket.correoCc=this.correos
       this.contactsEmailTicket.estatus="Cerrado"

 
       await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket)) 
    }

    this.varDetalle = undefined
    this.agenteNuevo = undefined
    await this.llamarUnTicket();
    await this.imprimirComentarios();
  }

  async imprimirComentarios(){  
    this.comment = []
    this.ticketService.llamarHistorial(this.idTicket).subscribe(async (resp:responseService)=>{
      for await (const i of resp.container) {
       if(i.tipo >=2 && i.tipo <=4){
         // Actualizacion de cual quiera de las opciones
          this.comment.push({mensaje:i.comentario,usuarioRespondido:i.usuario,fecha:i.fechaUpdate, color:"#F5F8FA",actualizar:true });
        }else if(i.tipo == 5){
          //mensaje de escalado
          this.comment.push({ usuarioRespondido:i.usuario,fecha:i.fechaUpdate,grupo:i.grupo,agente:i.agente, color:"#E6FFDE" });
        }else if(i.tipo == 6){
          //mensaje de que se cerro el ticket
          this.comment.push({ usuarioRespondido: i.usuario, fecha:i.fechaUpdate,cerrar:true,color:"#DBFAFF"});
        }else if(i.tipo ==7){
          // comentario privado
          this.comment.push({ mensaje: i.comentario, usuarioRespondido:i.usuario,fecha:i.fechaUpdate, color:"#F5F8FA",normal:false });
        }else if(i.tipo == 8){
          // comentario publico
          this.comment.push({ mensaje: i.comentario, usuarioRespondido:i.usuario,fecha:i.fechaUpdate, color:"#F5F8FA"});
        }
      }
    })
  }

  comentarioPrivado(){
    this.tipoComentario = false
  }

  comentarioPublico(){
    this.tipoComentario = true
  }

  async enviarMensaje(){    
    let form : enviarComentarioInterface ={
      cveTicket: this.idTicket,
      comentario: this.textArea.value,
      cveUsuario: this.auth.getCveId(),
      
      
      estatus: 1,
      tipo: this.tipoComentario ===false?7:8
    }
    this.textArea.reset()
    await lastValueFrom(this.ticketService.insertarComentario(form))
    await this.imprimirComentarios()
  }
}