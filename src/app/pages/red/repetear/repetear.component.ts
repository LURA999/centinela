import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from '../../../core/services/notification.service';
import { RepeaterService } from '../../../core/services/repeater.service';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewRepeaterComponent } from '../popup/new-repeater/new-repeater.component';
import { CityService } from '../../../core/services/city.service';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-repetear',
  templateUrl: './repetear.component.html',
  styleUrls: ['./repetear.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})

  export class RepetearComponent implements OnInit {
  ELEMENT_DATA: any = [ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  reptidores : any = [];
  ciudades : any  = [ ];
  displayedColumns: string[] = ['id','nombre', 'latitud', 'longitud', 'ciudad', 'estatus','opciones'];
  cargando = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  mayorNumero : number = 0

  constructor(private dialog:NgDialogAnimationService, private repeater : RepeaterService, 
    private notificationService: NotificationService,private cityService : CityService) { 
  }

  ngOnInit(): void {
    this.llenarTabla()
    this.imprimirCiudades();  
    
  }

  async imprimirCiudades(){
    this.ciudades = await this.cityService.llamarCiudades().toPromise()
    this.ciudades = this.ciudades.container;
  
  }

  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    await this.repeater.llamarRepitdores().toPromise().then( (result : any) =>{
      console.log(result)

      for (let i=0; i<result.container.length; i++){
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idRepetidora"],nombre: result.container[i]["nombreRepetidora"],latitud:result.container[i]["latitud"]
          ,longitud:result.container[i]["longitud"],ciudad:result.container[i]["nombreCiudad"], estatus:this.estatus(result.container[i]["estatus"])}
      );
    this.numeroMayor(result.container[i]["idRepetidora"]);
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


Newregister(){
  console.log(this.ciudades);
  
  let dialogRef  = this.dialog.open(NewRepeaterComponent,
    {data: {opc : false, ciudades: this.ciudades },
    animation: { to: "bottom" },
    height:"auto", width:"350px",
   });

   this.paginator2.firstPage();
   dialogRef.afterClosed().subscribe((result:any)=>{
     try{
    if(result.mensaje.length > 0  ){
      this.ELEMENT_DATA.unshift({id:++this.mayorNumero,nombre:result.nombre, latitud: result.latitud,longitud:result.longitud,
      ciudad: result.cveCiudad ,estatus:this.estatus(result.estatus)});

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


async eliminar(id:number){
  let dialogRef = await this.dialog.open(DeleteComponent,
    {data: {idCliente : id, opc:2},
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

//element.id,element.nombre,element.latitud,element.longitud,element.ciudad,element.estatus
async editar(id : number, nombre : string,latitud:string,longitud:number, ciudad :string, estatus: string){
  
  let dialogRef  = await this.dialog.open(NewRepeaterComponent,
    {data: {id : id, nombre : nombre ,latitud : latitud, longitud : longitud ,ciudad : this.ciudadId(ciudad), estatus:this.estatusNumero(estatus),opc:true, ciudades: this.ciudades},
    animation: { to: "bottom" },
      height:"auto", width:"300px",
    });
    await dialogRef.afterClosed().subscribe((result:any) => {
      try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.splice(this.buscandoIndice(id)
          ,1,{id:id,nombre:result.nombre, latitud: result.latitud,longitud:result.longitud,
            ciudad:this.ciudades[result.cveCiudad]["nombre"],estatus:this.estatus(result.estatus)})
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

ciudadId(ciudad : string){
  for(let x=0; x<this.ciudades.length; x++)
  {
    if(ciudad === this.ciudades[x].nombre){
      return this.ciudades[x].idCiudad
    }
  }
  return ""
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
    if(this.mayorNumero <numero){
      this.mayorNumero = numero
    }
  }

}
