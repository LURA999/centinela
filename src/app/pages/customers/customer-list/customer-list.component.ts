import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from './MyCustomPaginatorIntl';
import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';

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

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  totalItems: number = 0;
  page: number = 0; 
  previousPage: number = 0;
  showPagination: boolean = true;

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
        return ""
    }
  }
  nuevoCliente(){
    this.dialog.open(NuevoClienteComponent,
      {data: {opc : "" ,mensaje: ""},
      animation: { to: "bottom"},
        height:"30vw", width:"350px",
      });
  }

}
