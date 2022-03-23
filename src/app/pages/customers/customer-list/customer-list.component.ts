import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorIntl} from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from './MyCustomPaginatorIntl';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
];

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['Empresa', 'Nombre Corto', 'Estatus', 'Opciones'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
 
  totalItems: number = 0;
  page: number = 0; 
  previousPage: number = 0;
  showPagination: boolean = true;

  constructor(
    private titleService: Title,
    private config: NgbPaginationConfig,
   ) {
      this.config.boundaryLinks = true;
    }

  ngOnInit() {
    this.titleService.setTitle('Centinela - Customers');
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.fillStudents(this.page-1);
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fillStudents(page : number) : void {
	 
  }

}
