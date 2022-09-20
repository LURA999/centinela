import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { AuthService } from 'src/app/core/services/auth.service';
import { dashboardTicketsService } from 'src/app/core/services/dashboardTickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { NewEquipamentComponent } from 'src/app/pages/customers/popup/new-equipament/new-equipament.component';
import { ViewEstatusEnterpriseComponent } from '../../forms/view-estatus-enterprise/view-estatus-enterprise.component';
import { ViewTicketsEnterpriseComponent } from '../../forms/view-tickets-enterprise/view-tickets-enterprise.component';

interface tickets {
  idTicket: number;
  servicio:string;
  fechaAbierta:string;
  fechaCerrada:string | undefined;
  grupo:string;
  estado:string; 
}

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
  cargando : boolean = false;

  ELEMENT_DATA:  tickets[] = [ ];
  @Input() selectedFake : string = ""
  @Input() selectedFake2 : string = ""
  @Input() estatus : number = 0
  @Input() empresa : number = 0

  @Input() dialogRef? :  MatDialogRef<ViewTicketsEnterpriseComponent | ViewEstatusEnterpriseComponent>
  
  displayedColumns: string[] = ['idTicket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','estado'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild ("paginator") paginator!:MatPaginator;
  constructor(private serviceDash : dashboardTicketsService,private auth :AuthService) { }

  ngOnInit(): void {    
    this.serviceDash.rangoDeFechasForm(this.selectedFake,this.selectedFake2,this.estatus,this.empresa,this.auth.getCveGrupo()).subscribe(async(res : responseService)=>{    
      if (res.container.length >0) {
      this.ELEMENT_DATA=[];
      this.dataSource = new MatTableDataSource();
        for await (const i of res.container) {
          this.ELEMENT_DATA.push({idTicket:i.idTicket,servicio:i.servicio,fechaAbierta:i.fechaAbierta,fechaCerrada:i.fechaCerrada,grupo:i.grupo,estado:i.estado})
        }             
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;    
        this.paginator.length =  this.ELEMENT_DATA.length;  
        this.cargando = true;
  
      }
      })
  }
  hayUsers(){
    if(this.ELEMENT_DATA.length != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }

  salirForm(){
    this.dialogRef?.close()
  }

  


}
