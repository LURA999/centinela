import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ServiceService } from 'src/app/core/services/services.service';
import { serviceModel } from '../../../../models/service.model';
import { Subscription } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.css']
})
export class NewServiceComponent implements OnInit {

  serviceM =  new serviceModel();
  $sub = new Subscription()
  ultimoIdFalso :number = 0
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service : ServiceService,
  public dialogRef: MatDialogRef<NewServiceComponent>) { }

  ngOnInit(): void {
    this.ultimoIDFalso()    
  }

  async ultimoIDFalso() {
    this.$sub.add(await this.service.llamarService_maxIdFalso(this.data.idEmpresa+""+this.data.Empresa[0]).subscribe((resp:responseService)=>{
      try{
      this.ultimoIdFalso = resp.container[0].contador
      }catch(Exception){}
    }))
  }

  crearServicio(nombre : string,selectRS : number,selectCiudad : number,latitud : string, longitud : string,direccion :string , dominio : string, selectEstatus : number, selectPlan : number){  
    this.serviceM.nombre = nombre;
    this.serviceM.cveCiudad = selectCiudad;
    this.serviceM.ciudadNombre = document.getElementById("selectCiudad")?.innerText+"";
    this.serviceM.latitud = latitud;
    this.serviceM.longitud = longitud;
    this.serviceM.direccion = direccion;
    this.serviceM.dominio = dominio;
    this.serviceM.cveEstatus = selectEstatus;
    this.serviceM.cvePlan = selectPlan;
    this.serviceM.idRazonSocial = selectRS;
    this.serviceM.rs = document.getElementById("selectRs")?.innerText+"";
    this.serviceM.plan = document.getElementById("selectPlan")?.innerText+"";
    
    if(this.data.opc == false){
      if(nombre.length > 0 && selectCiudad !=undefined && latitud.length > 0 && longitud.length > 0 && direccion.length > 0 && dominio.length > 0 
        && selectEstatus !=undefined &&  selectPlan !=undefined && selectRS != undefined){
          this.serviceM.identificador = ((this.data.idEmpresa+""+this.data.Empresa)+""+((Number(this.ultimoIdFalso)+1).toString().padStart(5,"0")))
          this.serviceM.identificador2 = (this.data.idEmpresa+""+this.data.Empresa);
          this.serviceM.id = Number(this.data.idNuevo)+1;
          this.serviceM.contador = Number(this.ultimoIdFalso)+1;
          
          lastValueFrom(this.service.insertService(this.serviceM));
          this.dialogRef.close(this.serviceM)
        }else{
          alert("Llene todos los campos, por favor")
        }

    }else{
      this.serviceM.identificador = this.data.identificador;
      this.serviceM.id = this.data.idServicio
      console.log(this.serviceM);

      lastValueFrom(this.service.updateService(this.serviceM));
      this.dialogRef.close(this.serviceM)
    }
  }
}
