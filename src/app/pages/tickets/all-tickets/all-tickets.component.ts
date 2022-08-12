import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
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

  @ViewChild('estadoInput') estadoInput!: ElementRef<HTMLInputElement>;
  @ViewChild ("paginator") paginator:any;

  //autocomplete
  agenteControl = new FormControl('');
  creadoControl = new FormControl('');

  optionsAgente: any[] = [];
  optionsCreado: any[] = [];
  creador? : usuario 
  agente? : usuario 
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
  constructor(
    private fb : FormBuilder,
    private ticketService : TicketService,
    private userServ: UsuarioService,
    private auth : AuthService,
    private search: SearchService) { 

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
    this.llenarTabla(1)
    this.llenarUsuarios();
  }

  llenarTabla(cond:number){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.ticketService.tickets(cond,this.auth.getCveId()).subscribe(async(resp:responseService) =>{
     
      for await (const respuesta of resp.container) {
        this.ELEMENT_DATA.push(respuesta)
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;    
      
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

  aplicar(){
    const form :formNavSearchTicket = this.formNav.value
    form.agente = this.agente?.idUsuario!
    form.creador = this.creador?.idUsuario!
    form.estados = this.estadosCve.toString().replace(/(,)/gi, " or ");
    form.grupo = this.auth.getCveGrupo()    
    form.cve = this.auth.getCveId()
    
    this.search.buscarPorNavbar(form).subscribe((res:responseService)=>{
        console.log(res.container);
        
    })
  }


  ///filtros  de segundo grado
  ordenarPor(posicion : number){
    this.llenarTabla(posicion);  
  }

  //filtros de primer grado
  filtroTicketGeneral(){

  }

  //filtros de tercer grado
  filtroNavbar(){
    
    const form :formNavSearchTicket = this.formNav.value 
    form.cve = this.auth.getCveId(),
    form.estados = this.estadosCve.toString()
     
   // this.search.buscarPorNavbar(formNavSearchTicket)
  }


}
