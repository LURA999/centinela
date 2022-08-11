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

  //variables para el responsive del navbar
  showFiller :boolean = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  //variables para los inputs con opciones y con autocomplete
  separatorKeysCodes: number[] = [ENTER, COMMA];
  estadoControl = new FormControl('');
  filteredEstado: Observable<string[]>;
  estados: string[] = [];
  todoEstado: string[] = ['Abierto', 'Cerrado', 'En progreso', 'Pausado'];

  @ViewChild('estadoInput') estadoInput!: ElementRef<HTMLInputElement>;
  @ViewChild ("paginator") paginator:any;

  //autocomplete
  agenteControl = new FormControl('');
  creadoControl = new FormControl('');

  optionsAgente: any[] = [];
  optionsCreado: any[] = [];

  filteredOptionsAgente: Observable<any[]> | undefined;
  filteredOptionsCreado: Observable<any[]> | undefined;


  formNav :FormGroup =  this.fb.group({
    buscar:[""],
    grupo:[""],
    tipo: [""],
    prioridad:[""],
    fuente:[""]
  })

  metodos = new RepeteadMethods();
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private fb : FormBuilder,
    private ticketService : TicketService,
    private userServ: UsuarioService,
    private auth : AuthService) { 
      //responsive del navbar
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    ///variables para los inputs con opciones
    this.filteredEstado = this.estadoControl.valueChanges.pipe(
      startWith(null),
      map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
    );
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
        map((value : string) => this._filterAgente(value || '')),
      );
      this.filteredOptionsCreado = this.creadoControl.valueChanges.pipe(
        startWith(''),
        map((value : string) => this._filterCreado(value || '')),
      );
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
      this.estados.splice(index, 1);
      this.filteredEstado = this.estadoControl.valueChanges.pipe(
        startWith(null),
        map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
      );
    }
  }

  selectedEstado(event: MatAutocompleteSelectedEvent): void {
    this.estados.push(event.option.viewValue);
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
    return this.optionsAgente.filter(option => option.includes(filterValue));
  }
  private _filterCreado(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsCreado.filter(option => option.includes(filterValue));
  }

  aplicar(){
    const form :formNavSearchTicket = this.formNav.value
    form.agente = this.agenteControl.value
    form.creador = this.creadoControl.value 
    //form.estados = this.estados
  
    console.log(form);
    
  }


  ///Empiezan las funciones de los filtros
  ordenarPor(posicion : number){
    this.llenarTabla(posicion);  
  }
}
