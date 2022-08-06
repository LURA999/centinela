import {  Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom, Observable, startWith, map, Subscription, concat, forkJoin, concatMap } from 'rxjs';
import { AsuntoService } from 'src/app/core/services/asunto.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { SearchService } from 'src/app/core/services/search.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { SearchIdComponent } from '../popup/search-id/search-id.component';
import { DeviceService } from 'src/app/core/services/device.service'; 
import { UsuarioService } from 'src/app/core/services/user.service';
import { MatSelect } from '@angular/material/select';
import { NewContactComponent } from "../popup/new-contact/new-contact.component"
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { IpService } from 'src/app/core/services/ip.service';
import { RolService } from 'src/app/core/services/rol.service';
import { contactsEmailTicket } from "../../../models/contactsEmailTicket.model"
import { TicketService } from 'src/app/core/services/tickets.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { formTicketInterface } from "../../../interfaces/formTicketInterface.interface"
interface datosServicio {
  cliente : string,
  servicio : string,
  plan : string,
  estatus: string,
  idServicio : number
}

interface pingDatos {
  idDevice : number;
  nombre : string;
  ip : string;
  ping:string;
  color : string;
}

interface datosContacto {
  apellidoMaterno: string
  apellidoPaterno: string
  celular: number
  contrasena: string
  correo: string
  cveRol: number
  estatus: number
  idContacto: number
  idServicio: number
  nombre: string
  puesto: string
  rol: string
  servicio: string
  telefono: number
}


@Component({
  selector: 'app-ticket-entry',
  templateUrl: './ticket-entry.component.html',
  styleUrls: ['./ticket-entry.component.css']
})


export class TicketEntryComponent implements OnInit {
  myControl = new FormControl('');
  myControlContacts =new FormControl("")
  filteredOptions: Observable<string[]> | undefined;
  filteredContacts: Observable<datosContacto[]> | undefined;
  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []
  contactsEmailTicket : contactsEmailTicket = new contactsEmailTicket() 
  options: string[] = [];
  contactoControl = new FormControl('');
  $sub = new Subscription()
  contactoLista: any[] = [];
  acomuladorContactos: Array<string>  =new Array()
  idNuevo : number = 0
  datosServicio : datosServicio | undefined;
  asuntosArray: any [] = []
  metodos = new RepeteadMethods() 
  usuarios : any [] = []
  arrayRol : any
  indicesAcomu : Array<Number>  =new Array()

  
  contador : number | undefined;
  cveCliente : number | undefined;
  id : string | undefined;
  identificador : string = ""

  agregarMasContacto : boolean = true
  contactoPrincipal : number | undefined
  repetidorRouter : Array<string> = new Array()
  repetidorOtro : Array<string> = new Array()
  repetidorRadio : Array<string> = new Array()
  @ViewChild("idGrupo") idGrupo! : MatSelect    
  @ViewChild("selectedOption") optionSe! : MatOption    
  @ViewChild('matIcon', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;
  @ViewChild('autoContacto' ) autoContacto!: ElementRef;
  @ViewChild('selectContacto' ) selectContacto!: MatSelect;

  arrayPrevTicket : any [] = []
  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };

  formTicket : FormGroup = this.fb.group({
    contactoCorreo : ["", Validators.required],
    origen : ["", Validators.required],
    cveGrupo : ["", Validators.required],
    cveUsuario : ["", Validators.required],
    asunto : ["", Validators.required],
    prioridad : ["", Validators.required],
    descripcion : ["", Validators.required],
    cveIncidencia : ["", Validators.required]
  })

  constructor(private fb : FormBuilder,private dialog:NgDialogAnimationService,  private Search:SearchService,  private contactoService : ContactService, 
    private asuntoService : AsuntoService, private serviceService : ServiceService, private usarioservice : UsuarioService, private deviceService : DeviceService
  ,  private renderer : Renderer2, private ipService : IpService,private rol: RolService,private ticketService:TicketService, private guarduser: AuthService) {  }

  ngOnInit(): void {
    this.llamarAsuntos();
    this.todoRol();
    this.vistaPreviaTickets()
    console.log( new Date("2003-09-03").toLocaleString());
    
  }
  date(date:string){
    let dateArray = date.split("-")
    return new Date (Number(dateArray[0]),Number(dateArray[1]),Number(dateArray[2]))
  }
  contactoArray(ev : any){
    this.indicesAcomu.push(Number(ev.option.id.split("_")[0]))
    this.acomuladorContactos.push(ev.option.value.correo)
  
    const newBut = document.createElement("Button");
    const titleIcon = this.renderer.createText("close")
    const titleBut = this.renderer.createText(ev.option._element.nativeElement.innerText+" ("+ev.option.value.correo+")")
    const icon = this.placeholder?.createComponent(MatIcon)
    
    this.renderer.setStyle(newBut,"border","none")
    this.renderer.setStyle(newBut,"display","inline-flex")
    this.renderer.setStyle(newBut,"align-items","center")
    this.renderer.setStyle(newBut,"margin-top","5px")
    this.renderer.setStyle(newBut,"background","transparent")
    this.renderer.setStyle(newBut,"font-weight","400")          
    this.renderer.setStyle(newBut,"margin-left","2px")          

    this.renderer.appendChild(icon.instance._elementRef.nativeElement,titleIcon)
    this.renderer.appendChild(newBut,icon.instance._elementRef.nativeElement)
    this.renderer.appendChild(newBut, titleBut);
    
    newBut.id = "a"+(this.idNuevo++)    
    var div = document.querySelector("#mat-group-suffix")
    div?.appendChild(newBut)    
    this.renderer.listen(newBut, 'click', (f:any) => { this.destruirButton(newBut,Number(ev.option.id.split("_")[0]))});
    this.myControlContacts.setValue("")
    
  }

  destruirButton(button:any,id:number){
    this.acomuladorContactos.splice(this.indicesAcomu.indexOf(id),1)   
    this.indicesAcomu.splice(this.indicesAcomu.indexOf(id),1)
    this.renderer.removeChild(document.querySelector("#mat-group-suffix"),document.getElementById(button.id))
  }

  async buscarIdentificador(palabra:string,button :any){
    
    if(button.key !== "tab" && button.key !=="ArrowUp" && button.key !=="ArrowDown"
    && button.key !=="ArrowLeft" && button.key !=="ArrowRight" && button.key !=="Enter" 
    && (palabra.replace(/[0-9]*\gi/,"")).length < 12  || palabra == "" || Number(palabra) > 0 ){
       this.llamarDatosDelServicio(palabra,1,false)
    }
  }

  //te imprime los identificadores
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  //imprime todos los correos
  private _filterConcat(name: string): datosContacto[] {
    const filterValue = name.toLowerCase();
    return this.contactoLista.filter(option => option.correo.toLowerCase().includes(filterValue));
  }
 
  displayFn(user: string) : string {
    return user 
  }

   async opcionSeleccionada(identificador:string, cveCliente : string){
    identificador = identificador.split(" ")[0]
    this.cveCliente = Number(cveCliente)
    this.identificador = identificador
    this.formTicket.controls['contactoCorreo'].reset()
    //se desfragmenta el identificador
    let sepId : Array<string> = identificador.split("-")
     this.id = sepId[0]+"-"+sepId[1]+"-"+sepId[3];
     this.contador = Number(sepId[2]);
    
     this.rellenandoContactos()
    /**Llenando datos laterales del servicio */
     this.serviceService.selectVistaServicio(this.id,this.contador,2).subscribe((resp : responseService)=>{      
      
      
      this.datosServicio = {
      cliente : resp.container[0].cliente,
      servicio : resp.container[0].servicio,
      plan : resp.container[0].plan,
      estatus: this.metodos.estatus(resp.container[0].estatus),
      idServicio : resp.container[0].idServicio
     } 
    })

    this.pingOtro = []
    this.pingRadio = []
    this.pingRouter = []

    /**Pidiendo pings para los otros equipos*/
    this.ipService.selectIpOneEquipament(0,this.id,3,this.contador).subscribe(async(resp:responseService) =>{      
      if(resp.status === "not found"){
      }else{
        for (let i =0; i<resp.container.length; i++) {
          if(Number(this.repetidorOtro.indexOf(resp.container[i].repetidor)) !== -1){
            this.repetidorOtro.push(resp.container[i].repetidor)
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
    this.ipService.selectIpOneRouter(0,this.id,3,this.contador).subscribe(async(resp:responseService) =>{
      if(resp.status === "not found"){
      }else{
        for (let i =0; i<resp.container.length; i++) {
          if(Number(this.repetidorRouter.indexOf(resp.container[i].repetidor)) !== -1){
            this.repetidorRouter.push(resp.container[i].repetidor)
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
    this.deviceService.todosRadios(this.id,this.contador).subscribe(async (resp:responseService)=>{
      if(resp.status === "not found"){
      }else{  
        for (let i =0; i<resp.container.length; i++) { 
          if(Number(this.repetidorRadio.indexOf(resp.container[i].repetidor)) !== -1){
            this.repetidorRadio.push(resp.container[i].repetidor)
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

  }

  rellenandoContactos(){
    this.contactoService.llamar_Contactos_OnlyServicio(this.cveCliente!,this.contador!,2,this.id!).subscribe(async(resp:responseService)=>{
      this.contactoLista =  resp.container      
      
     /**Se llena el mat-autocomplete de los contactos */ 
      this.filteredContacts =  this.myControlContacts.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.correo;
         return nombre ? this._filterConcat(nombre as string) : this.contactoLista.slice();
        }),
      )
    })
  }

  async monitoreoPing( ip : string, i : number,array:pingDatos[]){ 
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
      
      }catch(Exception){}
    })) 
  }

  async llamarAsuntos(){
    await lastValueFrom(this.asuntoService.llamarAsunto()).then((resp :any)=>{
      this.asuntosArray = resp.container;
    });
  }
  
  //form para buscar identificador que no sabes como buscar
  abrirBuscadosIdentificador(){
    let dialogRef  = this.dialog.open(SearchIdComponent,
      {data: {  },
      animation: { to: "bottom" },
      height:"auto", width:"40%"
     });
     this.$sub.add(dialogRef.afterClosed().subscribe(async (result:string)=>{       
      if(result !== ""){
        await this.llamarDatosDelServicio(result,2,true)
      }
     }
     ));
  }

  buscarUsuarios(){
    let cve : number = this.idGrupo.value
    this.usarioservice.usuariosRol(cve).subscribe((resp:responseService)=>{
      if(resp.status === "not found"){

      }else{
       this.usuarios = resp.container;
      }
    })
  }  

  agregarContacto(datos : number){        
    this.contactoPrincipal = datos
  }

  vistaPreviaTickets(){
    this.ticketService.vistaPreviaTickets().subscribe((resp:responseService)=>{
      this.arrayPrevTicket =  resp.container;
    })
  }

  agregarOtroContacto(){
    if(this.contador != undefined && this.id!){
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {arrayRol:this.arrayRol, datosServicio: this.datosServicio},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
  
    dialogRef.afterClosed().subscribe( (resp:string)=>{
     this.rellenandoContactos() } )

    }else{
      alert('Por favor primero seleccione un identificador')
    }
  }

  agregarCopia(bool: boolean){
    this.agregarMasContacto = bool;
  }


  //Se activa cuando buscamos un identificador en el matAutocomplete
  async llamarDatosDelServicio(result :string,opc : number, buscarVentana:boolean){
    
    await lastValueFrom(this.Search.searchTicketEntry(result,opc)).then( (result : responseService) =>{    
      if(result.status !== "not there Services"){
      this.options= result.container;      
      if(buscarVentana == true){
        this.myControl.setValue(result.container[0])
      }

      this.datosServicio = {
        cliente : "",
        servicio : "",
        plan : "",
        estatus: "",
        idServicio : 0
      } 

      this.pingOtro = []
      this.pingRadio = []
      this.pingRouter = []
      }else{
        this.options=[]
      }
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) =>  this._filter(value || '')) );
  }


  //Imprimir roles para agregar otro contacto
  async todoRol(){
    this.$sub.add(this.rol.llamarTodo().subscribe((resp:responseService) => {
      this.arrayRol = resp.container;      
    }))
  }

  async enviarTicket(){    

    if(this.formTicket.valid && this.myControl.valid){
     

      if(this.agregarMasContacto == false){
        this.contactsEmailTicket.correoCc  = this.acomuladorContactos
      }else{
        this.contactsEmailTicket.correoCc  = []
      }
      
      this.contactsEmailTicket.correo = this.contactoLista[this.contactoPrincipal!].correo
      this.contactsEmailTicket.texto =  this.formTicket.controls["descripcion"].value
      this.contactsEmailTicket.prioridad = this.metodos.prioridadEnLetra(Number(this.formTicket.controls["prioridad"].value))
      this.contactsEmailTicket.identificador = this.identificador
      this.contactsEmailTicket.servicio = this.datosServicio?.servicio!
      this.contactsEmailTicket.nombreContacto = this.contactoLista[this.contactoPrincipal!].nombre
      this.contactsEmailTicket.nombreCliente = this.datosServicio?.cliente!
      
      let form : formTicketInterface
      form = this.formTicket.value
      form.abiertoUsuario = this.guarduser.getCveId()
      form.cveCliente = this.cveCliente!
      form.cveServicio = this.datosServicio?.idServicio!

      console.log(form);
      console.log(this.contactsEmailTicket);
      
      await lastValueFrom(this.ticketService.insertTickets(form))
      await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket))
    }else{
      alert("Por favor llene el formulario")
    }
  }

  


}
