import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {COMMA, ENTER, I} from '@angular/cdk/keycodes';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { UsuarioService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { formNavSearchTicket } from 'src/app/interfaces/formNavSearchTicket.interface';
import { SearchService } from 'src/app/core/services/search.service';
import { MatButton } from '@angular/material/button';
import { dosParamsNum } from 'src/app/interfaces/dosParamsNum.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MediaMatcher } from '@angular/cdk/layout';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
interface Grupo {
  value: number;
  viewValue: string;
}
export interface ticket {
  idTicket: Number,
  servicio : String,
  fechaAbierta: String,
  fechaCerrada: String,
  grupo: Number,
  grupoModificado:Number,
  tipo: Number,
  agente: Number,
  estado: Number,
  prioridad:Number,
  idUsuario:Number
}

export interface usuario {
  apellidoPaterno: string,
  appelidoMaterno: string,
  correo: string,
  idUsuario: number,
  nombres: string,
  usuario: string
}
@Component({
  selector: 'app-all-tickets',
  templateUrl: './all-tickets.component.html',
  styleUrls: ['./all-tickets.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class AllTicketsComponent implements OnInit{
  Grupos: Grupo[] = [];

  //var para borrar tickets
  borrar:boolean = true
  
  //variables de la tabla
  ELEMENT_DATA:  ticket[] = [ ];
  tickets:  ticket[] = [ ];
  displayedColumns: string[] = ['checkbox', 'ticket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','tipo','agente','estado',"prioridad"];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);  


  //variables para los inputs con opciones y con autocomplete
  separatorKeysCodes: number[] = [ENTER, COMMA];
  estadoControl = new FormControl('');
  filteredEstado!: Observable<string[]>;
  estados: string[] = [];
  estadosCve : number [] = [];
  todoEstado: string[] = ['Abierto', 'En progreso', 'Pausado', 'Cerrado'];
  todoEstadoAux: string[] = ['Abierto', 'En progreso', 'Pausado', 'Cerrado'];


  //Variables para los grupos que se estan abriendo en la tabla
  usuariosGrupo : any [] = []
  usuariosCveGrupo : number [] = []
  gruposCve:Number [] = []

  @ViewChild('estadoInput') estadoInput!: ElementRef<HTMLInputElement>;
  @ViewChild ("paginator") paginator!:MatPaginator;

  //botones del mat-menu-trigger
  @ViewChild ("misTickets") misTickets!:MatButton;
  @ViewChild ("todosTickets") todosTickets!:MatButton;
  @ViewChild ("ticketsSinResolver") ticketsSinResolver!:MatButton;
  @ViewChild ("ticketsAbiertosNuevos") ticketsAbiertosNuevos!:MatButton;
  @ViewChild ("grupoTable") grupoTable!:MatSelect;

  //autocomplete
  agenteControl = new FormControl('');
  creadoControl = new FormControl('');
  filtroSecControl = new FormControl('');

  optionsAgente: any[] = [];
  optionsCreado: any[] = [];
  creador? : usuario 
  agente? : usuario 
  grupoAgente : usuario[] = []

  filteredOptionsAgente?: Observable<any[]> ;
  filteredOptionsCreado?: Observable<any[]> ;


  formNav :FormGroup =  this.fb.group({
    buscar:[""],
    grupo:[""],
    tipo: [""],
    prioridad:[""],
    fuente:[""]
  })

  valueAgenteTab :FormGroup =  this.fb.group({
    agenteTabla:[""]
  })
  metodos = new RepeteadMethods();
  tituloAllTickets : string= "";
  condicion2: Number = 0;

  //variables para controlar los checkbox de angular
  cBox : FormControl = new FormControl() 
  guardarIdcBox : number = 0;
  banderaCheckbox : boolean = true;
  elTicket : number =0

  inicio = true
  //iniciador de filtro primer grado
  filtroPGrado : boolean = true


  varDetalle : number | undefined  //Guarda una variable de la tabla detalle log_ticket_det
  mobileQuery: MediaQueryList;


  link : boolean = false
  constructor(
    private userservice:UsersmoduleService,
    private fb : FormBuilder,
    private userServ: UsuarioService,
    private auth : AuthService,
    private search: SearchService, 
    private usarioservice : UsuarioService,
    private ticketService: TicketService,
    private ruta: Router,
    private media: MediaMatcher,
    ) { 

      this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');

      if(ruta.url.split("/")[3] == "general"){
        this.condicion2 = 1;
        this.tituloAllTickets = "Mis Tickets";
        this.filtroPGrado = false;
      }else{
        this.condicion2 = 2
        this.tituloAllTickets= "Todos los tickets";
        this.filtroPGrado = true;

      }
    ///variables para los inputs con opciones
    this.filteredEstado = this.estadoControl.valueChanges.pipe(
      startWith(null),
      map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
    );
  }
 
  ngOnInit(): void {
    this.llamarCve();
    this.procedimiento(false);
    this.llenarUsuarios();
  
  }

//metodo para llamar grupo
  async llamarCve(){
    await this.userservice.llamarGroup("Group").toPromise().then( (result : any) =>{
      
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"] })
    }
    })
  }

//Metodo utilizado para hacer todos los filtros
  async procedimiento(limpieza: Boolean){
    this.cBox.reset()
    this.borrar = true;
   await this.llenadoInicial(limpieza,true)
  }

  //Actualizando elementos de cada ticket y un poco mas
  async guardarGrupo(cve:string,cveTicket:string){ 
    
  let dosParamsNumGrupo:dosParamsNum = {
    cve :Number(cve),
    cve2 : Number(cveTicket),
    cveUsuario : this.auth.getCveId()
  } 

  let dosParamsNumAgente:dosParamsNum = {
    cve : 0,
    cve2 : Number(cveTicket)
  } 
  console.log();
  
  await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))
  await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNumAgente))
  await this.llenadoInicial(false,false)

  }  

  async buscarUsuarionav(cve:string){
    this.optionsAgente = []
    this.usarioservice.usuariosGrupo(Number(cve)).subscribe(async (resp:responseService)=>{      
      for await (const usuario of resp.container) {
          this.optionsAgente.push(usuario)
      }
      this.filteredOptionsAgente = this.agenteControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.usuario;
         return nombre ? this._filterAgente(nombre as string) : this.optionsAgente.slice()}),
      );
    })
  }
  async buscarUsuariosTabla(cve:string,ticket? :ticket){
    this.usarioservice.usuariosGrupo(Number(cve)).subscribe((resp:responseService)=>{
      if(resp.status === "not found"){
        this.usuariosGrupo[this.gruposCve.indexOf(Number(cve))] = []
      }else{
        this.usuariosGrupo[this.gruposCve.indexOf(Number(cve))] = resp.container;  
      }

      if(ticket !=undefined) {        
        this.ELEMENT_DATA[this.ELEMENT_DATA.indexOf(ticket!)].grupoModificado = this.gruposCve.indexOf(Number(cve))        
      }

    })
  }

  async agenteGuardar(ticket:ticket,cve:string,cveTicket:string){
    let Element_DATA_recent : any
  let dosParamsNumGrupo:dosParamsNum = {
    cve : Number(this.ELEMENT_DATA[this.ELEMENT_DATA.indexOf(ticket!)].grupo),
    cve2 : Number(cveTicket),
    cveUsuario : this.auth.getCveId()
  } 

  this.varDetalle = await( await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))).container[0].max
  let dosParamsNum:dosParamsNum = {
    cve : Number(cve),
    cve2 : Number(cveTicket),
    cveUsuario: this.auth.getCveId(),
    cveLogDet: this.varDetalle 
  }
  console.log(this.varDetalle);
  
  await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNum))
    
  }

  async guardarEstado(cve:string,cveTicket:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : Number(cveTicket),
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      }
  }

  async guardarPrioridad(cve:string,cveTicket:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : Number(cveTicket),
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarPropiedad(dosParamsNum))
      }
  }

  async eliminarTicket(){
    let eliminarTicket : dosParamsNum ={
      cve:Number(this.elTicket),
      cve2:0
    }
    await lastValueFrom(this.ticketService.deleteTickets(eliminarTicket))

    this.procedimiento(false)
  }

    async cerrarTicket(){
 
      let dosParamsNum : dosParamsNum = {
        cve:4,
        cve2:Number(this.elTicket),
        cveUsuario: this.auth.getCveId()
      }
      await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      this.procedimiento(false)

    }

  //metodo utilizado cuando entras a la pagina
  llenarUsuarios(){
    this.userServ.todosUsuarios().subscribe( async (resp:responseService) =>{            
      for await (const usuario of resp.container) {
        this.optionsCreado.push(usuario)        
      }
      this.filteredOptionsCreado = this.creadoControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.usuario;
         return nombre ? this._filterCreado(nombre as string) : this.optionsCreado.slice()}
          ));
      })
      
   
  }

  //Metodos para los autocomplete con chips
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.estados.push(value);      
    }
    event.chipInput!.clear();
    this.estadoControl.setValue(null);
  }

  remove(estado: string): void {
    const index = this.estados.indexOf(estado)

    if (index >= 0) {
      this.todoEstado.push(this.estados[index])
      this.estadosCve.splice(this.estadosCve.indexOf(  this.todoEstadoAux.indexOf(this.estados[index])+1),1)
      this.estados.splice(index, 1);

      this.filteredEstado = this.estadoControl.valueChanges.pipe(
        startWith(null),
        map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
      );
    }
  }

  selectedEstado(event: MatAutocompleteSelectedEvent): void {
    this.estados.push(event.option.viewValue);
    this.estadosCve.push(this.todoEstadoAux.indexOf(event.option.viewValue)+1)
    
    this.todoEstado.splice(this.todoEstado.indexOf(event.option.viewValue),1)
    this.estadoInput.nativeElement.value = '';
    this.estadoControl.setValue(null);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.todoEstado.filter(estado => estado.toLowerCase().includes(filterValue));
  }

  borrarClick(bool : boolean, idTicket : number,matCheck : MatCheckbox ){
    this.borrar = bool
    this.elTicket = idTicket
    this.cBox.reset()
  }

  borrarChange(idTicket : number,matCheck : MatCheckbox){

    if (this.guardarIdcBox == idTicket && this.banderaCheckbox == false) {
      matCheck.checked = false
      this.banderaCheckbox = true;
    } else {
      this.banderaCheckbox = false
    }
    this.guardarIdcBox = idTicket;

  }

  ///metodos del auto complete (para su funcionamiento)
  private _filterAgente(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsAgente.filter((option :any)=> option.usuario.toLowerCase().includes(filterValue));
  }

  private _filterCreado(value: string): string[] {    
    const filterValue = value.toLowerCase();
    return this.optionsCreado.filter((option :any) => option.usuario.toLowerCase().includes(filterValue));
  }
 
  //metodos extras del auto complete
 eligiendoCreadorMatAutoCom(u : usuario){
    this.creador = u
    this.creadoControl.setValue(u.usuario)      
  }

  eligiendoAgenteMatAutoCom(u : usuario){
    this.agente = u
    this.agenteControl.setValue(u.usuario)
  }

  async llenadoInicial( limpieza:Boolean,inicio : Boolean){
    let form :formNavSearchTicket = this.formNav.value 
    if(limpieza == false){
      form.agente = this.agenteControl.value==="" || this.agenteControl.value===undefined?0:this.agente?.idUsuario!
      form.creador = this.creadoControl.value==="" || this.creadoControl.value===undefined ?0:this.creador?.idUsuario!
      form.estados = this.estadosCve.toString();
      form.condicion2 = this.condicion2;
      form.condicion = Number(this.filtroSecControl.value==0?1:this.filtroSecControl.value);
    }else{
      this.agenteControl.reset()
      this.creadoControl.reset()
      this.formNav.reset()
      this.filtroSecControl.reset()  
      form = this.formNav.value
      form.agente = 0
      form.creador = 0   
      form.estados = ""
      form.condicion = 1
      form.condicion2 = this.condicion2;

    }
    form.cveGrupo = this.auth.getCveGrupo()  
    form.cve = this.auth.getCveId()
    console.log(form);
    
    this.ELEMENT_DATA=[];

    if(inicio == true){
      this.dataSource = new MatTableDataSource();
    }

     this.search.buscarPorNavbar(form).subscribe(async (resp:responseService)=>{
        for await (const iterator of resp.container) {
          this.ELEMENT_DATA.push(iterator)
          if(this.gruposCve.indexOf(iterator.grupo) == -1){
            this.gruposCve.push(Number(iterator.grupo));
            this.buscarUsuariosTabla(iterator.grupo.toString()) 
          } 
        }
        if(inicio == true){
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;    
          this.paginator.length =  this.tickets.length; 
        } 
    })    
  }

  //filtros de tercer grado
  filtroNavbar(){
    const form :formNavSearchTicket = this.formNav.value 
    form.cve = this.auth.getCveId(),
    form.estados = this.estadosCve.toString()
   // this.search.buscarPorNavbar(formNavSearchTicket)
  }

  //Filtro de primer grado

  async cambiarTitulo(opc:Number){
    this.misTickets.disabled = false;
    this.ticketsAbiertosNuevos.disabled = false;
    this.ticketsSinResolver.disabled = false;
    this.todosTickets.disabled = false;
    this.condicion2 = opc;
    switch (opc) {
      case 1:
        this.tituloAllTickets = "Mis Tickets";
        this.misTickets.disabled = true;
        break;
      case 2:
        this.tituloAllTickets = "Todos los tickets";
        this.todosTickets.disabled = true;
        break;
      case 3:
        this.tituloAllTickets = "Todos los tickets sin resolver";
        this.ticketsSinResolver.disabled = true;
        break;
      case 4: 
        this.tituloAllTickets = "Tickets nuevos y abiertos";
        this.ticketsAbiertosNuevos.disabled = true;
        break;    
      default:
        break;
    }
    await this.procedimiento(true);
  }


}




