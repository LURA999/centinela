import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewServiceComponent } from '../popup/new-service/new-service.component';

@Component({
  selector: 'app-table-service',
  templateUrl: './table-service.component.html',
  styleUrls: ['./table-service.component.css']
})
export class TableServiceComponent implements OnInit {
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
  @Input() hijoService :string ="";

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nombre', 'rs', 'ip', 'estado','ciudad','servicio','estatus','opciones'];
  
  constructor(private dialog:NgDialogAnimationService) { 
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoService'];
    if(!c.firstChange && c.currentValue != ""){
      console.log(c.currentValue);

    if(c.currentValue[0] == "d"){
     
    }else if(c.currentValue[0] == "a"){
      this.dialog.open(NewServiceComponent,
        {data: {empresa : "", opc:true},
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
