import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewRsComponent } from '../popup/new-rs/new-rs.component';

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

  @Input ()hijoRS :string = ""
   
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['rs', 'fechaAlta', 'estatus','opciones'];
  constructor(private dialog:NgDialogAnimationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoRS'];
    if(!c.firstChange && c.currentValue != ""){
      console.log(c.currentValue);

    if(c.currentValue[0] == "d"){
     
    }else if(c.currentValue[0] == "a"){
     this.dialog.open(NewRsComponent,
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
