import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NewSegmentComponent } from '../new-segment/new-segment.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { InfoComponent } from '../info/info.component';
import { DeleteComponent } from '../delete/delete.component';
import { MatSort } from '@angular/material/sort';
import { SegmentsService } from 'src/app/services/segments.service';
import { animation } from '@angular/animations';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.css']
})
export class SegmentsComponent implements OnInit {


  ELEMENT_DATA: any = [ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  subnet = require("subnet-cidr-calculator")

  displayedColumns: string[] = ['id','nombre', 'segmento', 'diagonal', 'tipo', 'estatus','repetidora','opciones'];
  cargando = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  mayorNumero : number = 0
  


  constructor(
    private dialog : NgDialogAnimationService,
    private segmentServicio : SegmentsService,
    private notificationService: NotificationService,
  ) { }

 async nuevoSegmento (){
    let dialogRef = await this.dialog.open(NewSegmentComponent,
      {data: {idCliente : "", opc: false},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      this.paginator2.firstPage();
      await dialogRef.afterClosed().subscribe((result:any)=>{
        try{
       if(result.mensaje.length > 0  ){

       
         this.ELEMENT_DATA.unshift({id:++this.mayorNumero,nombre:result.nombre,segmento:result.segmento
          ,diagonal:result.diagonal,tipo:result.tipo, estatus:result.estatus, repetidora:result.cveRepetdora});
          this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator2; 
         this.dataSource.sort = this.sort;

         setTimeout(()=>{
         this.notificationService.openSnackBar("Se agrego con exito");
         })
        }
       }catch(Exception){}
      })
  }

  async editarSegmento (id:number, nombre:string,segmento:string,diagonal:string,repetidora:number,tipo: number,estatus:string){
    let dialogRef  = await this.dialog.open(NewSegmentComponent,
      {data: {id : id, nombre : nombre ,segmento : segmento, diagonal : diagonal, cveRepetdora:repetidora ,tipo: tipo, estatus:this.estatusNumero(estatus),opc:true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      await dialogRef.afterClosed().subscribe((result:any) => {
        try{
        if(result.mensaje.length > 0  ){
          this.ELEMENT_DATA.splice(this.buscandoIndice(id)
            ,1,{id:id,nombre:result.nombre, segmento: result.segmento,diagonal:result.diagonal,
              repetidora: result.cveRepetdora,tipo: result.tipo,estatus:this.estatus(result.estatus)})
          this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator2;  
          this.dataSource.sort = this.sort;
          setTimeout(()=>{          
          this.notificationService.openSnackBar("Se actualizo con exito");  
          })
        }
        }catch(Exception){}
      }); 
  }
  async eliminarSegmento (id:number){    
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idSegmento : id},
      animation: { to: "bottom" },
      height:"auto", width:"300px",
      });
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.arrayRemove(this.ELEMENT_DATA, this.buscandoIndice(id)) 
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }
      }catch(Exception){}
      });
  }
  
  

  info (){
    this.dialog.open(InfoComponent,
    {data: {idCliente : ""},
    animation: { to: "bottom" },
    height:"auto", width:"300px",
  });
  }
  
  ngOnInit(): void {
    this.llenarTabla()
   }
  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    await this.segmentServicio.llamarSegments().toPromise().then( (result : any) =>{
      for (let i=0; i<result.container.length; i++){
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idSegmento"],nombre: result.container[i]["nombre"],segmento:result.container[i]["segmento"]
          ,diagonal:result.container[i]["diagonal"],tipo:result.container[i]["tipo"], estatus:result.container[i]["estatus"], repetidora:result.container[i]["cveRepetdora"]}
      );
      this.numeroMayor(result.container[i]["idSegmento"]);
    }
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
      this.cargando = true;
    });
      
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /**para el loading */
hayClientes(){
  if(this.ELEMENT_DATA != 0 || this.cargando ==false){
    return true;
  }else{
    return false;
  }
}
/**Ayudante de loading p */
hayClientes2(){
  if(this.cargando !=false){
    return "table-row";
  }else{
    return "none";
  }
}


  /**Guardando numero mayor */
   numeroMayor(numero : number){
    if (this.mayorNumero <numero){
      this.mayorNumero = numero
    }
  }
  arrayRemove(arr : any, index : any) { 
    for( var i = 0; i < arr.length; i++){ 
    
      if ( arr[i]["id"] === arr[index]["id"]) { 
  
          arr.splice(i, 1); 
      }
  
    }
    return arr;
  }
  buscandoIndice(id:number){
    let i = 0
    while (true) {
      const element = this.ELEMENT_DATA[i]["id"];
      if(element===id){
       return i
      }
      i++;
    }
  }
  estatus(numero : string) {
    switch(numero){
      case '1':
        return "activo"
      case '2':
        return "inactivo"
    }
  }
  estatusNumero(numero : string) {
    switch(numero){
      case 'activo':
        return '1'
      case 'inactivo':
        return '2'
      case 'ausente': 
        return '3'
      default:
        return ""
    }



}

}
