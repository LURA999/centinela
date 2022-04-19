import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewTicketComponent } from '../popup/new-ticket/new-ticket.component';

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
  @Input() hijoTickets :string ="";

  ELEMENT_DATA : any = [{
    num:"1",
    departamento:"1",
    asunto:"1",
    servicio:"1",
    fechaCerrada:"1",
    fechaAbierta:"1",
    estado:"1",
    agente:"2",
    opciones:"1"
  }]

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['num', 'departamento', 'asunto', 'servicio', 'fechaCerrada','fechaAbierta','estado','agente','opciones'];

  constructor( private dialog:NgDialogAnimationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoTickets'];
    
    if(!c.firstChange && c.currentValue != ""){      
    if(c.currentValue[0] == "d"){
      
    }else if(c.currentValue[0] == "a"){
      this.dialog.open(NewTicketComponent,
        {data: {empresa : "", opc:true},
        animation: { to: "bottom" },
          height:"auto", width:"300px",
        });
    }    
  }
}

  ngOnInit(): void {
    
  }

  eliminar(){

  }
  
  editar(){
    
  }

  async mensaje(mensaje : string){
    await console.log(mensaje);
    
  }

}
