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

  
  crearSegment( cveRepetdora:string,nombre : string,segmento : string ,diagonal : string, selectEstatus : number, selecTipo: number){
    
    
    if(this.data.opc == false){

        this.segmentService.insertarSegments({cveRepetdora:cveRepetdora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selecTipo}).toPromise();
        this.dialogRef.close({cveRepetdora:cveRepetdora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
      }else{
     console.log({cveRepetdora:cveRepetdora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selecTipo});
     
     
        this.segmentService.actualizarSegment({cveRepetdora:cveRepetdora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selecTipo}).toPromise();
        this.dialogRef.close({cveRepetdora:cveRepetdora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, mensaje:"Se pudo"})
    }
    }
  
  

}
