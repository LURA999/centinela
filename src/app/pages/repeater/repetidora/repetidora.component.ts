import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/services/notification.service';
import { RepeaterService } from 'src/app/services/repeater.service';
import { NewRepeaterComponent } from '../new-repeater/new-repeater.component';


@Component({
  selector: 'app-repetidora',
  templateUrl: './repetidora.component.html',
  styleUrls: ['./repetidora.component.css']
})

  export class RepetidoraComponent implements OnInit {
  ELEMENT_DATA: any = [ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  reptidores : any = [];
  displayedColumns: string[] = ['id','nombre', 'latitud', 'longitud', 'ciudad', 'estatus','opciones'];
  cargando = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(private dialog:NgDialogAnimationService, private repeater : RepeaterService, private notificationService: NotificationService) { 
  }

  ngOnInit(): void {
    this.llenarTabla()
  }

  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    await this.repeater.llamarRepitdores().toPromise().then( (result : any) =>{
      console.log(result)
      for (let i=0; i<result.container.length; i++)
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idRepetidora"],nombre: result.container[i]["nombreRepetidora"],latitud:result.container[i]["latitud"]
          ,longitud:result.container[i]["longitud"],ciudad:result.container[i]["nombreCiudad"], estatus:result.container[i]["estatus"]}
      );
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


Newregister(){
  let dialogRef  = this.dialog.open(NewRepeaterComponent,
    {data: {opc : false },
    animation: { to: "bottom" },
    height:"auto", width:"350px",
   });

   this.paginator2.firstPage();
   dialogRef.afterClosed().subscribe((result:any)=>{
     try{
    if(result.mensaje.length > 0  ){
      this.ELEMENT_DATA.unshift({id:result.cveCiudad,nombre:result.nombre, latitud: result.latitud,longitud:result.longitud,
      ciudad: result.cveCiudad,estatus:result.estatus});
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
}
