import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewLogComponent } from '../popup/new-log/new-log.component';

@Component({
  selector: 'app-table-log',
  templateUrl: './table-log.component.html',
  styleUrls: ['./table-log.component.css']
})
export class TableLogComponent implements OnInit {
  ELEMENT_DATA : any = [{
    id:"1",
    tipo:"1",
    descripcion:"1",
    fecha:"1",
    usuario:"1",
    opciones:"1"
  }]

  @Input ()hijoLog :string = ""

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'tipo', 'descripcion', 'fecha', 'usuario','opciones'];
  constructor(private dialog:NgDialogAnimationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoLog'];
    if(!c.firstChange && c.currentValue != ""){
      console.log(c.currentValue);

    if(c.currentValue[0] == "d"){
     
    }else if(c.currentValue[0] == "a"){
      this.dialog.open(NewLogComponent,
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
