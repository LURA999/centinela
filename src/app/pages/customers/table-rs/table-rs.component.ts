import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-rs',
  templateUrl: './table-rs.component.html',
  styleUrls: ['./table-rs.component.css']
})
export class TableRsComponent implements OnInit {
  ELEMENT_DATA : any = [{
    rs:"1",
    fechaAlta:"1",
    estatus:"1",
    opciones:"1"
  }]

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['rs', 'fechaAlta', 'estatus','opciones'];
  constructor() { }

  ngOnInit(): void {
  }

}
