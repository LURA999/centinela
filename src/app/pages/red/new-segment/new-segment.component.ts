import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { IpService } from 'src/app/services/ip.service';
import { RepeaterService } from 'src/app/services/repeater.service';
import { SegmentsService } from 'src/app/services/segments.service';

@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.css']
})
export class NewSegmentComponent implements OnInit {
  
  subnetting = require("subnet-cidr-calculator")
  repetidoraArray: any []= [];
  arrayPromises : any []=[]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private segmentService : SegmentsService,
  public dialogRef: MatDialogRef<NewSegmentComponent>, private ipService : IpService
  ) { }

  ngOnInit(): void {
    let  x  : string [] ="192.168.200.5".split(".", 4);
    let aux :number=+"5"; 
    x[3] = (aux -1) +"";
    
  console.log(this.subnetting.getSubnetDetails(x[0]+"."+x[1]+"."+x[2]+"."+x[3]+"/30"));
  console.log("---------------------------------------------------");
  console.log(this.subnetting.getSubnetDetails("192.168.200.5/30"));
  
  
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
          //se guarda el rango del segmentos y todos sus subnets
          let segmentoFinal = await this.subnetting.getIpRangeForSubnet(segmento+'/'+diagonal);
          segmentoFinal = segmentoFinal["end"]; 
          let probabal_subnets = await this.subnetting.getSubnetDetails(segmento+'/'+diagonal);
          await this.segmentService.insertarSegments({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal}).toPromise();
          
         for (let x=0; x<probabal_subnets.hosts.length; x++) {
          await this.ipService.insertarIp({ip:probabal_subnets.hosts[x],cveSegmento:this.data.id}).toPromise()
         }
       
         await  this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal, mensaje:"Se pudo"})
          
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
        this.dialogRef.close({cveRepetdora:SelectRepetidora,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, tipo: selectTipo, mensaje:"Se pudo"})
      }else{
      alert("Llene todos los datos")
      }
    }
  }
}
