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

@Component({
  selector: 'app-repetear-contact',
  templateUrl: './repetear-contact.component.html',
  styleUrls: ['./repetear-contact.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class RepetearContactComponent implements OnInit {
  
cargando :boolean= false;
todosContactos : any;
arrayrepetear : any = [];
mayorNumero : number = 0
mayorNumero2 : number = 0
id :number = this.rutaActiva.snapshot.params["id"];

ELEMENT_DATA2: any = [
  {
    id:"ejemplo",
    seg: "ejemplo",
    x: "ejemplo",
    tipo:"ejemplo",
    nom:"ejemplo",
  }
];

ELEMENT_DATA: any = [ ];


@ViewChild ("paginator") paginator:any;
@ViewChild ("paginator2") paginator2:any;
@ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
@ViewChild(MatSort, { static: true })
  sort2: MatSort  = new MatSort;

dataSource = new MatTableDataSource(this.ELEMENT_DATA);
displayedColumns: string[] = ['id', 'nombre', 'telefono', 'correo', 'estatus','opciones'];
dataSource2 = new MatTableDataSource(this.ELEMENT_DATA2);
displayedColumns2: string[] = ['id', 'seg', 'x', 'tipo', 'nom','opciones'];

constructor(private dialog:NgDialogAnimationService, private contactService : ContactService, 
  private repeaterService: RepeaterService, private notificationService : NotificationService,
  private rutaActiva: ActivatedRoute ) { 

}

  ngOnInit(): void {
    this.llenarTabla1(this.id); 
  }

  ngAfterViewInit(): void {
    this.obteniendoRepetidor();
  }

  async obteniendoRepetidor(){

   await this.repeaterService.llamarRepitdor(this.id).toPromise().then((result:any)=>{
     console.log(result);
     
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

  async llenarTabla1(cve :number){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.todosContactos =  await this.contactService.llamarContacto(cve).toPromise();
      for (const iterator of this.todosContactos.container) {
        this.ELEMENT_DATA.push(
          {id:iterator.idContacto,
          nombre:iterator.nombre,
          telefono:iterator.telefono ,
          correo:iterator.correo,
          cverepetear:iterator.cverepetear,
          estatus:this.estatus(iterator.estatus)}
        );   
        this.mayorNumero = iterator.idContacto;
      }
     
      this.dataSource = await new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = await this.paginator;    
      this.dataSource.sort = await this.sort;
      this.cargando = true;
  }
 /**Funciones extras, para buscar indice del array y para los estatus */
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
      {data: {opc : false/*, repetears: this.todosrepetears*/ , cverepetear: this.id},
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
  if(this.cargando !=false){
    return "table-row";
  }else{
    return "none";
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

  numeroMayor(numero : number){
    if(this.mayorNumero <numero){
      this.mayorNumero = numero
    }
  }
  numeroMayor2(numero : number){
    if(this.mayorNumero2 <numero){
      this.mayorNumero2 = numero
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
  async editar(estatus : string,nombre : string ,telefono : string, correo : string,selectRep : string,id:number){
    let dialogRef  = await this.dialog.open(NewContactComponent,
      {data: {telefono:+telefono, correo:correo, estatus:this.estatusNumero(estatus),nombre:nombre,repetear:+selectRep, id:id/*,repetears:this.todosrepetears*/, opc:true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      }); 
      
      await dialogRef.afterClosed().subscribe((result:any) => {
        try{
        if(result.mensaje.length > 0){
          this.ELEMENT_DATA.splice(this.buscandoIndice(id)
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
