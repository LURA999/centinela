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
    
    let existe = await this.segmentService.existe(segmento).toPromise()

    if(existe == 0)
    {
      let segmentoFinal = this.subnetting.getIpRangeForSubnet(segmento+"/"+diagonal) 
      if(this.data.opc == false){
        if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
          await this.segmentService.insertarSegments({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["end"]}).toPromise();
          this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
        }else{
      alert ("llene todos los datos")
      }
    }else{
      if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
      await  this.segmentService.actualizarSegment({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["end"]}).toPromise();
        this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
      }else{
      alert("Llene todos los datos")
      }
    }
    }
    else{
      alert("El segmento declarado ya eiste")
    }
  }
}
