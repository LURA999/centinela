import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentsService } from 'src/app/services/segments.service';

@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.css']
})
export class NewSegmentComponent implements OnInit {
  
  subnetting = require("subnet-cidr-calculator")
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private segmentService : SegmentsService,public dialogRef: MatDialogRef<NewSegmentComponent>) { }

  ngOnInit(): void {
   
  }

  
  
  async crearSegment( SelectRepetidora:number,nombre : string,segmento : string ,diagonal : number, selectEstatus : number, selectTipo: number){
    
    //Obteniendo el ip final, del segmento ingresado 
    let segmentoFinal = this.subnetting.getIpRangeForSubnet(segmento+"/"+diagonal);
    segmentoFinal = segmentoFinal["end"]; 
  
    var splitted1 = segmentoFinal.split("."); 
    console.log(splitted1[2])
    var splitted = segmento.split("."); 
    console.log(splitted[2])

let segmentoRango :number =(+splitted1[2]) - (+splitted[2]);

console.log(segmentoRango);

   

    //Verifica si existe el segmento
    let existe :any = await this.segmentService.existe(segmento).toPromise()

    existe=existe.container[0].ip;
   console.log(existe);
   
   
    //si es false, se esta creando un nuevo segmento y true para actualizar
    if(this.data.opc == false){

      //Antes de insertar se verifica que el segmento no exista
      if(existe == 0)
      {
       
        console.log({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal});
        
        if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
          await this.segmentService.insertarSegments({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal}).toPromise();
          this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
        }else{
          alert ("Llene todos los datos")
        }
      }else{
        
        alert("No se pueden insertar segmentos repetidos y/o activos")
      }
      

    }else{
      let segmentoFinal = this.subnetting.getIpRangeForSubnet(segmento+"/"+diagonal) 
      if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
      await  this.segmentService.actualizarSegment({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["end"]}).toPromise();
        this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
      }else{
      alert("Llene todos los datos")
      }
    }
  }
}
