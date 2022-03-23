import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from './MyCustomPaginatorIntl';
import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import * as XLSX from 'xlsx';

export interface cliente {
  empresa: string;
  nombre: string;
  estatus: string;
  opciones: string;
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['Empresa', 'Nombre Corto', 'Estatus', 'Opciones'];
  ELEMENT_DATA: cliente[] = [
    { empresa: "Redes y asesorias", nombre: 'red 7', estatus: this.estatus(1), opciones: '2'} 
  ];

  clientes :String [] =[];
  excel : String [][] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  totalItems: number = 0;
  page: number = 0; 
  carga :boolean=false;
  previousPage: number = 0;
  showPagination: boolean = true;
  contenedor_carga : boolean = false;
  slider : boolean = true;
  constructor(
    private titleService: Title,
    private config: NgbPaginationConfig,
    private dialog : NgDialogAnimationService
   ) {
      this.config.boundaryLinks = true;
    }

  ngOnInit() {
    this.titleService.setTitle('Centinela - Customers');
    
  }


  llenaTabla(){
    
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      //this.fillStudents(this.page-1);
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  estatus(numero : number) {
    switch(numero){
      case 1:
        return "activo"
      case 2:
        return "inactivo"
      case 3: 
        return "ausente"
      default:
        return "cerrado"
    }
  }
  nuevoCliente(){
    this.dialog.open(NuevoClienteComponent,
      {data: {opc : "" ,mensaje: ""},
      animation: { to: "bottom" },
        height:"50%", width:"350px",
      });
  }

  async onFileChange(evt: any){
     const target : DataTransfer = <DataTransfer>(evt.target);
     let formato= ""+target.files[0].name.split(".")[target.files[0].name.split(".").length-1];
     if(formato == "xlsm" ||formato == "xlsx" || formato == "xlsb" ||formato == "xlts" ||formato == "xltm" ||formato == "xls" ||formato == "xlam" ||formato == "xla"||formato == "xlw" ){
      
      if(target.files.length !==1)
      throw alert('No puedes subir multiples archivos');
      const reader: FileReader= new FileReader();
      reader.onload = async (e: any) =>{
      const bstr : string = e.target.result;
      const wb : XLSX.WorkBook = XLSX.read(bstr, {type:'binary'});
      const wsname : string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.excel = (XLSX.utils.sheet_to_json(ws,{header: 1}));
     }

    }
  }

  exportar(){

  }
}
