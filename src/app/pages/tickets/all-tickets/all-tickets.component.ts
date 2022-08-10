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

export interface ticket {
  idTicket? : Number,
  checkbox : Boolean,
  ticket: Number,
  servicio : String,
  fechaAbierto: String,
  fechaCerrado: String,
  grupo: Number,
  tipo: Number,
  agente: Number,
  estado: Number
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
  ELEMENT_DATA: ticket[] = [
    { checkbox : true, ticket: 10101, servicio : "servicioPrueba", fechaAbierto: "fecha abierto", fechaCerrado: "----", 
      grupo: 1, tipo: 1, agente: 1, estado: 1}
  ];
  displayedColumns: string[] = ['checkbox', 'ticket', 'servicio', 'fechaAbierto', 'fechaCerrado','grupo','tipo','agente','estado'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);  

  //variables para el responsive del navbar
  showFiller :boolean = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  //variables para los inputs con opciones y con autocomplete
  separatorKeysCodes: number[] = [ENTER, COMMA];
  estadoControl = new FormControl('');
  filteredEstado: Observable<string[]>;
  filteredAgente: Observable<string[]>;
  estados: string[] = [];
  todoEstado: string[] = ['Abierto', 'Cerrado', 'En progreso', 'Pausado'];
  todoAgente: string[] = ['Abierto', 'Cerrado', 'En progreso', 'Pausado'];

  @ViewChild('estadoInput') estadoInput!: ElementRef<HTMLInputElement>;


  //autocomplete
  agenteControl = new FormControl('');
  creadoControl = new FormControl('');

  optionsAgente: string[] = ['One', 'Two', 'Three'];
  optionsCreado: string[] = ['One', 'Two', 'Three'];

  filteredOptionsAgente: Observable<string[]> | undefined;
  filteredOptionsCreado: Observable<string[]> | undefined;


  formNav :FormGroup =  this.fb.group({
    buscar:[""],
    grupo:[""],
    tipo: [""],
    prioridad:[""],
    fuente:[""]
  })
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private fb : FormBuilder) { 
      //responsive del navbar
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    ///variables para los inputs con opciones
    this.filteredEstado = this.estadoControl.valueChanges.pipe(
      startWith(null),
      map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
    );

    this.filteredAgente = this.agenteControl.valueChanges.pipe(
      startWith(null),
      map((agente: string | null) => (agente ? this._filter(agente) : this.todoAgente.slice())),
    );

    
  }
 

  ngOnInit(): void {
     //autocomplete normal
     this.filteredOptionsAgente = this.agenteControl.valueChanges.pipe(
      startWith(''),
      map((value : string) => this._filterAgente(value || '')),
    );
    this.filteredOptionsCreado = this.creadoControl.valueChanges.pipe(
      startWith(''),
      map((value : string) => this._filterCreado(value || '')),
    );

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
    const index = this.estados.indexOf(estado);
    if (index >= 0) {
      this.estados.splice(index, 1);
    }
  }

  selectedEstado(event: MatAutocompleteSelectedEvent): void {
    this.estados.push(event.option.viewValue);
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
    return this.optionsAgente.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterCreado(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsCreado.filter(option => option.toLowerCase().includes(filterValue));
  }

  aplicar(){
    console.log(this.agenteControl.value)
    console.log(this.creadoControl.value)
    console.log(this.estados);
    
    console.log(this.formNav.value);
    
  }
}
