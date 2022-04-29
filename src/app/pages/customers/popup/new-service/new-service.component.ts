import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { planService } from 'src/app/core/services/plan.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { serviceModel } from '../../../../models/service.model';


@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.css']
})
export class NewServiceComponent implements OnInit {

  serviceM =  new serviceModel();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service : ServiceService,public dialogRef: MatDialogRef<NewServiceComponent>) { }

  ngOnInit(): void {
      
  }

  crearServicio(nombre : string,selectRS : number,selectCiudad : number,latitud : string, longitud : string,direccion :string , dominio : string, selectEstatus : number, selectPlan : number){  
    this.serviceM.nombre = nombre;
    this.serviceM.ciudad = selectCiudad;
    this.serviceM.latitud = latitud;
    this.serviceM.longitud = longitud;
    this.serviceM.direccion = direccion;
    this.serviceM.dominio = dominio;
    this.serviceM.idServicio = this.data.idNuevo;
    this.serviceM.estatus = selectEstatus;
    this.serviceM.plan = selectPlan;
    this.serviceM.rs = selectRS;
    this.serviceM.identificador = (this.data.idNuevo+nombre[0]).padEnd(7,"0");
    
    if(this.data.opc == false){
      
      if(nombre.length > 0 && selectCiudad !=undefined && latitud.length > 0 && longitud.length > 0 && direccion.length > 0 && dominio.length > 0 
        && selectEstatus !=undefined &&  selectPlan !=undefined && selectRS != undefined){
      lastValueFrom(this.service.insertService(this.serviceM));
      this.dialogRef.close(this.serviceM)
        }else{
          alert("Llene todos los campos, por favor")
        }

    }else{

    }
  }

  

}
