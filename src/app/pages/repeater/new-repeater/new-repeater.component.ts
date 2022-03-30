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
  }
  crearCliente(nombre : string,latitud : string ,longitd : string, selectEstatus : number, selectCiudad: number){
    this.repidorService.insertarRepetidor({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitd,estatus:selectEstatus}).toPromise();
    this.dialogRef.close({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitd,estatus:selectEstatus, mensaje:"Se pudo"})
  
  }

}
