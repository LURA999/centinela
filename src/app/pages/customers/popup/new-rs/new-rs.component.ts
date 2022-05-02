import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { RsService } from 'src/app/core/services/rs.service';
import { RsModel } from 'src/app/models/rs.model';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
  selector: 'app-new-rs',
  templateUrl: './new-rs.component.html',
  styleUrls: ['./new-rs.component.css']
})
export class NewRsComponent implements OnInit {

  rsModel = new RsModel()
  metodo = new RepeteadMethods()
 // fechaAlta : FormControl = this.data.fechaAlta 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private rs: RsService, public dialogRef: MatDialogRef<NewRsComponent>) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  async crearRs(nombre : string, fechaValue : string, select : number){  
    
    this.rsModel.rs = nombre
    this.rsModel.fecha = this.metodo.formatoFechaMysql(fechaValue)
    this.rsModel.fechaEspanol = this.metodo.cambiarSeparadoresFecha(fechaValue,"/","-")
    this.rsModel.estatus = select
    this.rsModel.cveCliente = this.data.idCliente     
    await lastValueFrom(this.rs.insertRS(this.rsModel));
    this.dialogRef.close(this.rsModel)
    
  }

  dateChange(e:any,valor:string){
    let splitted : string [] =  valor.split("-");
    let fecha : Date
    let dia : number = 0
    let diaFecha : string [] =[]
    let diaFechaNumero : number = 0

    if(splitted.length ==3){
       fecha = new Date(splitted[1]+"-"+splitted[0]+"-"+splitted[2])
       dia  =Number(splitted[0]);
       diaFecha = (fecha+"").split(" ", 3)
       diaFechaNumero = +diaFecha[2]
      if( diaFechaNumero == dia){
        e.target.value = fecha; 
      }else{
        e.target.value = ""
      }
    }else{
      let splitted2 :string []=  valor.split("/");
       fecha = new Date(splitted2[1]+"/"+splitted2[0]+"/"+splitted2[2])
       dia  =Number(splitted2[0]);
       diaFecha = (fecha+"").split(" ", 3)
       diaFechaNumero = +diaFecha[2]
      if( diaFechaNumero == dia){
        e.target.value = fecha; 
      }else{
        e.target.value = "";
      }
    }

  }

}
