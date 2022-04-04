import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentsService } from 'src/app/services/segments.service';

@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.css']
})
export class NewSegmentComponent implements OnInit {
  

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,private segmentService : SegmentsService,public dialogRef: MatDialogRef<NewSegmentComponent>) { }

  ngOnInit(): void {
    
    console.log("hola");
    console.log(this.data); 
  }

  
  crearSegment( SelectRepetidora:number,nombre : string,segmento : string ,diagonal : number, selectEstatus : number, selectTipo: number){
    
    
    if(this.data.opc == false){
      if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
        this.segmentService.insertarSegments({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo}).toPromise();
        this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
      }
      
      else{
     alert ("llene todos los datos")
    }
  }else{
      
    if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
      this.segmentService.actualizarSegment({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo}).toPromise();
      this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
    }else{
    alert("Llene todos los datos")
  }
  }
  }
}
