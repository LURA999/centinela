import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
  ELEMENT_DATA : any =[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns = ['nombre', 'fecha', 'size', 'opciones'];
  cargando : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  eliminar(){

  }

  editar(){

  }

}
