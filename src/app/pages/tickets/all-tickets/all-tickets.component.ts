import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { elementAt, lastValueFrom, map, Observable, startWith, Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { UsuarioService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { formNavSearchTicket } from 'src/app/interfaces/formNavSearchTicket.interface';
import { SearchService } from 'src/app/core/services/search.service';
import { MatButton } from '@angular/material/button';

export interface ticket {
  idTicket: Number,
  servicio : String,
  fechaAbierta: String,
  fechaCerrada: String,
  grupo: Number,
  tipo: Number,
  agente: Number,
  estado: Number,
  prioridad:Number
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
  filteredEstado: Observable<string[]>;
  estados: string[] = [];
  estadosCve : number [] = [];
  todoEstado: string[] = ['Abierto', 'En progreso', 'Pausado', 'Cerrado'];
  todoEstadoAux: string[] = ['Abierto', 'En progreso', 'Pausado', 'Cerrado'];


  //Variables para los grupos que se estan abriendo en la tabla
  usuariosGrupo : any [] = []
  gruposCve:Number [] = []

  @ViewChild('estadoInput') estadoInput!: ElementRef<HTMLInputElement>;
  @ViewChild ("paginator") paginator:any;

  //botones del mat-menu-trigger
  @ViewChild ("misTickets") misTickets!:MatButton;
  @ViewChild ("todosTickets") todosTickets!:MatButton;
  @ViewChild ("ticketsSinResolver") ticketsSinResolver!:MatButton;
  @ViewChild ("ticketsAbiertosNuevos") ticketsAbiertosNuevos!:MatButton;

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

  metodos = new RepeteadMethods();
  tituloAllTickets : string= "Todos los tickets";
  arrayAgente : Number []= []
  inicio : number=0;
  fin : number=15;
  $sub :  Subscription = new Subscription();
  
  condicion2: Number = 2;

  constructor(
    private fb : FormBuilder,
    private userServ: UsuarioService,
    private auth : AuthService,
    private search: SearchService, 
    private usarioservice : UsuarioService) { 

    ///variables para los inputs con opciones
    this.filteredEstado = this.estadoControl.valueChanges.pipe(
      startWith(null),
      map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
    );
  }
 
  eligiendoCreador(u : usuario){
    this.creador = u
    this.creadoControl.setValue(u.usuario)      
  }

  eligiendoAgente(u : usuario){
    this.agente = u
    this.agenteControl.setValue(u.usuario)
  }

  ngOnInit(): void {
    this.procedimiento(false);
    this.llenarUsuarios();
  
  }


  async procedimiento(limpieza: Boolean){
    this.inicio = 0;
    this.fin = 15;
   await this.llenadoInicial(limpieza)
   await this.compaginar()
  }


  buscarUsuarios(cve:string,cveTicket:string){    
    this.usarioservice.usuariosGrupo(Number(cve)).subscribe((resp:responseService)=>{
      if(resp.status === "not found"){
        this.usuariosGrupo = []
      }else{
        this.usuariosGrupo = resp.container;
      }
    })
  }  

  llenarUsuarios(){
    this.userServ.todosUsuarios().subscribe( async (resp:responseService) =>{            
      for await (const usuario of resp.container) {
        this.optionsAgente.push(usuario)
        this.optionsCreado.push(usuario)        
      }
      this.filteredOptionsAgente = this.agenteControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.usuario;
         return nombre ? this._filterAgente(nombre as string) : this.optionsAgente.slice()}),
      );
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

  borrarSioNo(bool : boolean){
    this.borrar = bool
  
  }

  ///metodos del auto complete
  private _filterAgente(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsAgente.filter((option :any)=> option.usuario.toLowerCase().includes(filterValue));
  }

  private _filterCreado(value: string): string[] {    
    const filterValue = value.toLowerCase();
    return this.optionsCreado.filter((option :any) => option.usuario.toLowerCase().includes(filterValue));
  }

  ///filtros  de segundo grado
 /* async llenarTabla(){
    const form :formNavSearchTicket = this.formNav.value
    form.agente = this.agenteControl.value==="" || this.agenteControl.value===undefined?0:this.agente?.idUsuario!
    form.creador = this.creadoControl.value==="" || this.creadoControl.value===undefined ?0:this.creador?.idUsuario!
    form.estados = this.estadosCve.toString().replace(/(,)/gi, " or ");
    form.cveGrupo = this.auth.getCveGrupo()    
    form.cve = this.auth.getCveId()
    form.condicion = Number(this.filtroSecControl.value==0?1:this.filtroSecControl.value)
    form.condicion2 = -1;
    this.search.buscarPorNavbar(form).subscribe(async(resp:responseService)=>{
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    for await (const respuesta of resp.container) {
      this.tickets.push(respuesta)
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator =  this.paginator; 
    })
  }*/


  async llenadoInicial( limpieza:Boolean){
    const form :formNavSearchTicket = this.formNav.value
    if(limpieza == false){
      form.agente = this.agenteControl.value==="" || this.agenteControl.value===undefined?0:this.agente?.idUsuario!
      form.creador = this.creadoControl.value==="" || this.creadoControl.value===undefined ?0:this.creador?.idUsuario!
      form.estados = this.estadosCve.toString();
      form.condicion2 = -1;
      form.condicion = Number(this.filtroSecControl.value==0?1:this.filtroSecControl.value);
    }else{
      form.condicion2 = this.condicion2;
      form.condicion = 1
      form.agente = 0
      form.creador = 0
      form.estados = ""      
    }
    form.cveGrupo = this.auth.getCveGrupo()    
    form.cve = this.auth.getCveId()

    this.tickets = (await lastValueFrom(this.search.buscarPorNavbar(form))).container
        
  }

  async cargarFiltros(){
    while ( this.inicio <this.fin + 2 && this.inicio < this.tickets.length) {
      if(this.inicio < this.fin){
      }
    }

    this.dataSource = await new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = await this.paginator;    
    this.paginator.hidePageSize= await true;
    this.paginator.length = await this.tickets.length;
  }
  

  
  //filtros de tercer grado
  filtroNavbar(){
    const form :formNavSearchTicket = this.formNav.value 
    form.cve = this.auth.getCveId(),
    form.estados = this.estadosCve.toString()
   // this.search.buscarPorNavbar(formNavSearchTicket)
  }

  async pageEvents(event: any) {  
    this.$sub.unsubscribe();
    this.$sub = new Subscription();
  
      if(event.previousPageIndex > event.pageIndex) {
      this.inicio = (this.inicio-(this.inicio%15)) - 30;
      if(this.inicio < 0){
        this.inicio = 0;
      }
      this.fin =  (this.fin - (this.fin%15)) - 15;
      this.compaginar();
    } else {
      this.inicio = this.fin;
      this.fin = this.fin + 15;
      this.compaginar();
    }
  }

  async compaginar(){
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource();
   while (this.inicio < this.fin + 2 && this.inicio < this.tickets.length) {
    
    if(this.inicio < this.fin){ 
      this.ELEMENT_DATA[this.inicio] =  (this.tickets[this.inicio] )
      
      if(this.gruposCve.indexOf(this.ELEMENT_DATA[this.inicio].grupo) == -1){
        this.gruposCve.push(Number(this.ELEMENT_DATA[this.inicio].grupo));

      }
      
      this.inicio++
      }
    }
    
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;    
    this.paginator.length =  this.tickets.length;  
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
