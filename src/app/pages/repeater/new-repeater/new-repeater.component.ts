import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeaterService } from 'src/app/services/repeater.service';

@Component({
  selector: 'app-new-repeater',
  templateUrl: './new-repeater.component.html',
  styleUrls: ['./new-repeater.component.css']
})
export class NewRepeaterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private repidorService : RepeaterService,public dialogRef: MatDialogRef<NewRepeaterComponent>) { }

  ngOnInit(): void {
    console.log(this.data);
    
  }
  crearCliente(nombre : string,latitud : string ,longitud : string, selectEstatus : number, selectCiudad: number){
  
    if(this.data.opc == false){
      if(nombre.length >0 && latitud.length > 0 && longitud.length > 0  && selectEstatus != undefined && selectCiudad !=undefined){
        this.repidorService.insertarRepetidor({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus}).toPromise();
        this.dialogRef.close({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus, mensaje:"Se pudo"})
      }else{
        alert("Llene todos los datos")
      }
    }else{
      
      if(nombre.length >0 && latitud.length > 0 && longitud.length > 0  && selectEstatus != undefined && selectCiudad !=undefined){
        this.repidorService.updateRepetidor({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus, idRepetidora:this.data.id}).toPromise();
        this.dialogRef.close({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus, mensaje:"Se pudo"})
  }else{
      alert("Llene todos los datos")
    }
    }
  }

}
