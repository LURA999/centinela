import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewContactComponent } from '../popup/new-contact/new-contact.component';

@Component({
  selector: 'app-table-contact',
  templateUrl: './table-contact.component.html',
  styleUrls: ['./table-contact.component.css']
})
export class TableContactComponent implements OnInit {
  ELEMENT_DATA : any = [{
    id:"1",
    nombre:"1",
    rs:"1",
    ip:"1",
    estado:"1",
    ciudad:"1",
    servicio:"1",
    estatus:"2",
    opciones:"1"
  }]

  @Input ()hijoContact :string = ""

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nombre', 'rs', 'ip', 'estado','ciudad','servicio','estatus','opciones'];
  constructor(private dialog:NgDialogAnimationService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoContact'];
    
    if(!c.firstChange && c.currentValue != ""){
    if(c.currentValue[0] == "d"){
     
    }else if(c.currentValue[0] == "a"){
      this.dialog.open(NewContactComponent,
      {data: {empresa : "", opc:false},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
    }
  }
}
  eliminar(){

  }
  editar(){
    
  }
  
  ngOnInit(): void {
  }

  
}
