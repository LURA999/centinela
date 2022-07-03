import {  Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom, Observable, startWith, map, Subscription } from 'rxjs';
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
import { NotificationService } from 'src/app/core/services/notification.service';
import { NewContactComponent } from '../../red/popup/new-contact/new-contact.component';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { IpService } from 'src/app/core/services/ip.service';

interface datosServicio {
  cliente : string,
  servicio : string,
  plan : string,
  estatus: string
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
  filteredContacts: Observable<any[]> | undefined;

  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []

  options: string[] = [];
  contactoControl = new FormControl('');
  $sub = new Subscription()
  contactoLista: any[] = [];
  acomuladorContactos: number[] = [];
  idNuevo : number = 0
  correos : string[]=[];
  contactosIndices : string[]=[];
  contactosElegidos : any [] =[];
  datosServicio : datosServicio | undefined;
  asuntosArray: any [] = []
  metodos = new RepeteadMethods() 
  usuarios : any [] = []
  agregar = false
  @ViewChild("idGrupo") idGrupo! : MatSelect    
  @ViewChild("selectedOption") optionSe! : MatOption    
  @ViewChild('matIcon', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;
  @ViewChild('autoContacto' ) autoContacto!: ElementRef;

  formTicket : FormGroup = this.fb.group({
   
  })

  constructor(private fb : FormBuilder,private dialog:NgDialogAnimationService,  private Search:SearchService,  private contactoService : ContactService, 
    private asuntoService : AsuntoService, private serviceService : ServiceService, private usarioservice : UsuarioService, private deviceService : DeviceService
  , private notificationService: NotificationService, private renderer : Renderer2, private ipService : IpService) {  }

  ngOnInit(): void {
    this.llamarAsuntos();
  }
  
  borrar(event : any){ 
    this.renderer.removeChild(document.getElementById("mat-group-suffix"),document.getElementById(event._elementRef.nativeElement.id))
  }

  contactoArray(ev : any){
    
    const newBut = document.createElement("Button");
    const titleIcon = this.renderer.createText("close")
    const titleBut = this.renderer.createText(ev.option._element.nativeElement.innerText+" ("+ev.option.value+")")
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
    this.renderer.listen(newBut, 'click', (f:any) => { this.destruirButton(newBut,ev.option.id)});
    this.myControlContacts.setValue("")
    
  }

  destruirButton(button:any,id:number){
    this.renderer.removeChild(document.querySelector("#mat-group-suffix"),document.getElementById(button.id))
  }

  async buscarIdentificador(palabra:string,button :any){
    
    if(button.key !== "tab" && button.key !=="ArrowUp" && button.key !=="ArrowDown"
    && button.key !=="ArrowLeft" && button.key !=="ArrowRight" && button.key !=="Enter" 
    && (palabra.replace(/[0-9]*\gi/,"")).length == 1  || palabra == "" || Number(palabra) > 0 ){
      await lastValueFrom(this.Search.searchTicketEntry(palabra)).then( (result : responseService) =>{
      
      if(result.status !== "not there Services"){
      this.options= result.container;
      
      this.datosServicio = {
        cliente : "",
        servicio : "",
        plan : "",
        estatus: ""
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
    }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterConcat(name: string): datosContacto[] {
    const filterValue = name.toLowerCase();
    return this.contactoLista.filter(option => option.correo.toLowerCase().includes(filterValue));
  }
 
  displayFn(user: string) : string {
    return user 
  }

  opcionSeleccionada(identificador:string){
    identificador = identificador.split(" ")[0]

    let sepId : Array<string> = identificador.split("-")
    let id :string = sepId[0]+"-"+sepId[1]+"-"+sepId[3];
    let contador :number = Number(sepId[2]);
    console.log(contador);
    
    this.contactoService.llamar_Contactos_OnlyServicio(1,contador,2).subscribe((resp:responseService)=>{
      this.contactoLista = resp.container
     /**Se llena el mat-autocomplete de los contactos */ 
      this.filteredContacts = this.myControlContacts.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.correo;
         return nombre ? this._filterConcat(nombre as string) : this.contactoLista.slice();
        }),
      )
    })

    /**Llenando datos laterales del servicio */
    this.serviceService.selectVistaServicio(id,contador,2).subscribe((resp : responseService)=>{
     this.datosServicio = {
      cliente : resp.container[0].cliente,
      servicio : resp.container[0].servicio,
      plan : resp.container[0].plan,
      estatus: this.metodos.estatus(resp.container[0].estatus)
     } 
    })

    this.pingOtro = []
    this.pingRadio = []
    this.pingRouter = []

    /**Pidiendo pings para los otros equipos*/
    this.ipService.selectIpOneEquipament(0,id,3,contador).subscribe(async(resp:responseService) =>{
      console.log(resp);
      
      if(resp.status === "not found"){
        console.log("No encontro");
      }else{
        for (let i =0; i<resp.container.length; i++) {
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
    this.ipService.selectIpOneRouter(0,id,3,contador).subscribe(async(resp:responseService) =>{
      console.log(resp);
      if(resp.status === "not found"){
        console.log("No encontro");
      }else{
        for (let i =0; i<resp.container.length; i++) {
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
    this.deviceService.todosRadios(id,contador).subscribe(async (resp:responseService)=>{
      console.log(resp);
      if(resp.status === "not found"){
        console.log("No hay radios");
      }else{  
        for (let i =0; i<resp.container.length; i++) {       
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
  async monitoreoPing( ip : string, i : number,array:pingDatos[]){ 
    let ping : string
    console.log(ip);
    
    this.$sub.add(this.ipService.ping(ip).subscribe((resp:any) => {
      ping = resp.container.time
      
      try{
        array[i].ping = ping; 
        
        if(resp.container.status == "200"){
        if(Number(ping.replace(/[A-Za-z]+/,"")) <=40){
          array[i].color = "green";
        }else if(Number(ping.replace(/[A-Za-z]+/,"")) >40){
          array[i].color = "orange";
        }else{
          array[i].color = "red";
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
  
  abrirBuscadosIdentificador(){
    let dialogRef  = this.dialog.open(SearchIdComponent,
      {data: {  },
      animation: { to: "bottom" },
      height:"auto", width:"40%"
     });
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{ 
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

  agregarContacto(datos : any,principal : boolean){    
    this.idNuevo = this.idNuevo ++
    if (principal) {
      this.acomuladorContactos.splice(datos,0)
      this.acomuladorContactos.unshift(this.contactoLista[datos])  
    } else {
      this.acomuladorContactos.push(this.contactoLista[datos])
      const mat = document.querySelector("#mat-group-suffix")
      const cdiv = document.createElement("button")      
      cdiv.innerHTML = datos.toString()
      cdiv.id = "a"+this.idNuevo
      mat?.appendChild(cdiv)
    } 
  }

  agregarOtroContacto(){
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
  
     dialogRef.afterClosed().subscribe((result:any)=>{
      try{
     if(result.mensaje.length > 0  ){
       setTimeout(()=>{
       this.notificationService.openSnackBar("Se agrego con exito");
       })
     }
     }catch(Exception){}
    })
  }

}
