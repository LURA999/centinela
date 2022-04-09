import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IpService } from '../../../../core/services/ip.service';
import { SegmentsService } from '../../../../core/services/segments.service';
import { rango_ip } from './rango_ip';


@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.css']
})
export class NewSegmentComponent implements OnInit {
  subnetting = require('ip-utils')
  repetidoraArray: any []= [];
  arrayPromises : any []=[]
   rango  = new rango_ip()

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private segmentService : SegmentsService,
  public dialogRef: MatDialogRef<NewSegmentComponent>, private ipService : IpService  ) { }

  ngOnInit(): void {
    //192.168.200.0                                                        
		 //192.168.201.255
    /*let r : string []= this.rango.rango("192.168.0.1", "193.169.255.255");
    //console.log(r);*/
    console.log(this.data) 

  }
  
  pingURL() {
  
    
  }
  
  async crearSegment( SelectRepetidora:number,nombre : string,segmento : string ,diagonal : number, selectEstatus : number, selectTipo: number){
    let existe :any = await this.segmentService.existe(segmento).toPromise()
    existe=existe.container[0].ip;
    

    //true = actualizar false = insertar
    if(this.data.opc == false){
      //antes de insertar se averigua si existe tal segmento
      if(existe == 0)
      {        
        if(nombre.length >0 && diagonal> 0 && segmento.length > 0  && selectTipo != undefined && selectEstatus !=undefined && SelectRepetidora !=undefined){
          // se guarda el rango del segmentos y todos sus subnets          
          let segmentoFinal = await this.subnetting.subnet(segmento+"/"+diagonal).info();
          let r : string []= this.rango.rango(segmentoFinal["networkAddress"], segmentoFinal["broadcastAddress"]);
          await this.segmentService.insertarSegments({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["broadcastAddress"]}).toPromise();
         for (let x=0; x<r.length; x++) {
          await this.ipService.insertarIp({ip:r[x],cveSegmento:this.data.id}).toPromise()
         }
       
         await  this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["broadcastAddress"], mensaje:"Se pudo"})
          
        }else{
          alert ("Llene todos los datos")
        }
      }else{ 
        alert("No se pueden insertar segmentos repetidos y/o activos")
      }
    }else{
      if(nombre.length >0  && selectTipo != undefined && selectEstatus !=undefined ){
      await  this.segmentService.actualizarSegment(this.data.id,nombre,selectEstatus,selectTipo).toPromise();
        this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, tipo: selectTipo, mensaje:"Se pudo"})
      }else{
      alert("Llene todos los datos")
      }
    }
  }



}
