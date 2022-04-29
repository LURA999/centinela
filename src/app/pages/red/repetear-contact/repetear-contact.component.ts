import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewContactComponent } from '../popup/new-contact/new-contact.component';
import { ContactService } from '../../../core/services/contact.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RepeaterService } from '../../../core/services/repeater.service';
import { DeleteComponent } from '../popup/delete/delete.component';
import { ActivatedRoute, Params } from '@angular/router';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { lastValueFrom } from 'rxjs';
import { NewSegmentComponent } from '../popup/new-segment/new-segment.component';

@Component({
  selector: 'app-repetear-contact',
  templateUrl: './repetear-contact.component.html',
  styleUrls: ['./repetear-contact.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class RepetearContactComponent implements OnInit {
  
cargando :boolean= false;
cargando2 :boolean= false;
todosContactos : any;
todosSegmentos : any;

arrayrepetear : any = [];
mayorNumero : number = 0
id :number = this.rutaActiva.snapshot.params["id"];
ELEMENT_DATA_SEGMENTOS: any = [ ];
ELEMENT_DATA: any = [ ];
repetearArray : any 


@ViewChild ("paginator") paginator:any;
@ViewChild ("paginator2") paginator2:any;
@ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
@ViewChild(MatSort, { static: true })
  sort2: MatSort  = new MatSort;

dataSource = new MatTableDataSource(this.ELEMENT_DATA);
displayedColumns: string[] = [/*'id',*/ 'nombre', 'telefono', 'correo', 'estatus','opciones'];
dataSource2 = new MatTableDataSource(this.ELEMENT_DATA_SEGMENTOS);
displayedColumns2: string[] = ['id', 'seg', 'x', 'tipo', 'nom','opciones'];

constructor(private dialog:NgDialogAnimationService, private contactService : ContactService, 
  private repeaterService: RepeaterService, private notificationService : NotificationService,
  private rutaActiva: ActivatedRoute ) { 

}

  ngOnInit(): void {
    this.llenarTabla1(this.id); 
    this.llenarTab2(this.id);
  }

  ngAfterViewInit(): void {
    this.obteniendoRepetidor();
  }

  async obteniendoRepetidor(){

  await lastValueFrom(this.repeaterService.llamarRepitdor(this.id)).then((result:any)=>{
     
      this.arrayrepetear={
        id : result.container[0].idRepetidora , 
        nombre : result.container[0].nombreRepetidora,
        latitud : result.container[0].latitud,
        longitud:result.container[0].longitud,
        ciudad:result.container[0].nombreCiudad,
        estatus:this.estatus(result.container[0].estatus),
      };    
   }); 
  }
  async eliminar(id:number){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idContacto : id, opc: 3},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.arrayRemove(this.ELEMENT_DATA, this.buscandoIndice(id,this.ELEMENT_DATA))

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

  async llenarTabla1(cve :number){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.contactService.llamarContacto(cve).subscribe((resp:any) =>{
      this.mayorNumero = resp.container[resp.container.length-1].idContacto;
      
      this.todosContactos =  resp.container;
      for (const iterator of this.todosContactos) {
        this.ELEMENT_DATA.push(
          {id:iterator.idContacto,
          nombre:iterator.nombre,
          telefono:iterator.telefono ,
          correo:iterator.correo,
          cverepetear:iterator.cverepetear,
          estatus:this.estatus(iterator.estatus)}
        );   
      }
     
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;    
      this.dataSource.sort =  this.sort;
      this.cargando = true;
    });
  }

  async llenarTab2(cve:number){
    this.cargando2 = false;
    this.ELEMENT_DATA_SEGMENTOS = [];
    this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA_SEGMENTOS);
    await this.repeaterService.segmentosRepetidores(cve).subscribe( (resp:any) =>{
      this.todosSegmentos = resp.container;
      for (const iterator of this.todosSegmentos) {
        this.ELEMENT_DATA_SEGMENTOS.push(
          {id:iterator.idSegmento,
          seg:iterator.segmento,
          x:iterator.diagonal ,
          tipo:this.tipo(iterator.tipo),
          nom:iterator.nombre,
          estatus:this.estatus(iterator.estatus)}
        );   
      }
     
      this.dataSource2 =  new MatTableDataSource(this.ELEMENT_DATA_SEGMENTOS);
      this.dataSource2.paginator =  this.paginator2;    
      this.dataSource2.sort =  this.sort2;
      this.cargando2 = true;
    });
  }

  async editarSegmento (id:number, nombre:string,segmento:string,diagonal:string,repetear:string,tipo: string,estatus:string){    
    let dialogRef  = await this.dialog.open(NewSegmentComponent,
      {data: {id : id, nombre : nombre ,segmento : segmento, diagonal : diagonal, cveRepetdora: repetear,tipo: this.tipoNumero(tipo), estatus:this.estatusNumero(estatus),opc:true  },
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      await dialogRef.afterClosed().subscribe((result:any) => {
        
        try{
        if(result.mensaje.length > 0  ){


          this.ELEMENT_DATA_SEGMENTOS.splice(this.buscandoIndice(id,this.ELEMENT_DATA_SEGMENTOS)
            ,1,{id:id,nom:result.nombre, seg: result.segmento,x:result.diagonal,
              tipo:this.tipo(result.tipo),estatus:this.estatus(result.estatus)})
              console.log("ENTRO");
              
          this.dataSource2 =  new MatTableDataSource(this.ELEMENT_DATA_SEGMENTOS)
          this.dataSource2.paginator = this.paginator2;  
          this.dataSource2.sort = this.sort2;
          setTimeout(()=>{          
          this.notificationService.openSnackBar("Se actualizo con exito");  
          })
        }
        }catch(Exception){}
      }); 
  }

  async eliminarSegmento (id:number){    
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idSegmento : id, opc: 1},
      animation: { to: "bottom" },
      height:"auto", width:"300px",
      });
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA_SEGMENTOS =  this.arrayRemove(this.ELEMENT_DATA_SEGMENTOS, this.buscandoIndice(id,this.ELEMENT_DATA_SEGMENTOS)) 
          this.dataSource2 = new MatTableDataSource(this.ELEMENT_DATA_SEGMENTOS);
          this.dataSource2.paginator = this.paginator2;
          this.dataSource2.sort = this.sort2;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }
      }catch(Exception){}
      });
  }
  tipoNumero(tipo:string){
    if(tipo == 'publico'){
      return "1"
     }else{
      return "2"
     }
  }

  tipo(tipo:string){
    if(tipo == '1'){
      return "publico"
     }else{
      return "privado"
     }
  }
 /**Funciones extras, para buscar indice del array y para los estatus */
 buscandoIndice(id:number, ELEMENT_DATA:any){
  let i = 0
  while (true) {
    const element = ELEMENT_DATA[i]["id"];
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
      case '3': 
        return "ausente"
      default:
        return ""
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  Newregister(){
    let dialogRef = this.dialog.open(NewContactComponent,
      {data: {opc : false/*, repetears: this.todosrepetears*/ , cveRepetidora: this.id},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: ++this.mayorNumero,telefono: result.telefono,correo:result.correo,estatus:this.estatus(result.estatus), nombre: result.nombre});
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
    if(this.ELEMENT_DATA_SEGMENTOS != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
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
  async editar(estatus : string,nombre : string ,telefono : string, correo : string,selectRep : string,id:number){
    let dialogRef  = await this.dialog.open(NewContactComponent,
      {data: {telefono:+telefono, correo:correo, estatus:this.estatusNumero(estatus),nombre:nombre,repetear:+selectRep, id:id/*,repetears:this.todosrepetears*/, opc:true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      }); 
      
      await dialogRef.afterClosed().subscribe((result:any) => {
        try{
        if(result.mensaje.length > 0){
          this.ELEMENT_DATA.splice(this.buscandoIndice(id,this.ELEMENT_DATA)
            ,1,{telefono:result.telefono, correo:result.correo, estatus:this.estatus(result.estatus),nombre:result.nombre,id:id })
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

}
