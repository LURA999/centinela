import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewServiceComponent } from '../popup/new-service/new-service.component';
import { CityService } from 'src/app/core/services/city.service';
import { RsService } from 'src/app/core/services/rs.service';
import { planService } from 'src/app/core/services/plan.service';
import { responseService } from 'src/app/models/responseService.model';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-table-service',
  templateUrl: './table-service.component.html',
  styleUrls: ['./table-service.component.css']
})
export class TableServiceComponent implements OnInit {

  ELEMENT_DATA : any = [ ]
  metodo = new RepeteadMethods();
  cargando : boolean = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;  
  @Input() hijoService :string ="";
  id :number = this.rutaActiva.snapshot.params["id"];
  mayorNumero : number = 0
  ultimoId : number = 0

  arrayCiudades : string[] = []
  arrayRS : string [] = []
  arrayPlan : string [] = []
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = [ 'identificador','nombre', 'rs','ciudad','estatus','opciones'];
  
  constructor(private dialog:NgDialogAnimationService, private rutaActiva:ActivatedRoute
    ,  private notificationService: NotificationService, private serviceService : ServiceService,
    private city : CityService, private rs : RsService, private plan : planService) {
      this.inicio()
    }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoService'];
    if(!c.firstChange && c.currentValue != ""){
    if(c.currentValue[0] == "d"){
      this.descargar()
    }else if(c.currentValue[0] == "a"){
      this.hijoService = ""
      this.insertar()
    }
  }
  }

  descargar(){

  }

  ngOnInit(): void {

  }

  async inicio(){
    await this.ultimoID()
    await this.todasCiudades();
    await this.todasRS();
    await this.todosPlan();
    await this.llenarTabla()
  }
  async todasCiudades(){
    await this.city.llamarCiudades().subscribe((resp:any) =>{
      this.arrayCiudades = resp.container
    });
  }
  async todasRS(){
    await this.rs.llamarTodo(this.id).subscribe((resp:any) =>{
      this.arrayRS = resp.container
    });
  }
  async todosPlan(){
    await this.plan.llamarTodo().subscribe((resp:any) =>{
      this.arrayPlan = resp.container
    });
  }
  async ultimoID() {
    await this.serviceService.llamarService_maxId().subscribe((resp:responseService)=>{
      this.ultimoId = resp.container[0].idServicio
    })
  }

  async llenarTabla(){
    this.cargando = false;             
     await this.serviceService.llamarTodo(this.id).subscribe((resp:responseService) =>{            
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[0].idServicio;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          id:resp.container[i].idServicio,
          nombre:resp.container[i].servicio,
          rs:resp.container[i].razonSocial,
          identificador:resp.container[i].identificador,
          ciudad:resp.container[i].ciudad,
          servicio:resp.container[i].servicio,
          estatus:resp.container[i].estatus  
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }else{
      this.mayorNumero = this.ultimoId;      
    }
    })
    this.cargando = true;
  }


  async eliminar(id : number){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 4},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(id,this.ELEMENT_DATA))
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
  
  editar(){
    let dialogRef  = this.dialog.open(NewServiceComponent,
      {data: {opc : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: ++this.mayorNumero,nombre:result.nombre,
        rs:result.rs, ip:result.ip, ciudad:result.ciudad, servicio:result.servicio,  estatus: this.metodo.estatus(result.estatus)});
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

  insertar(){   
    let dialogRef  = this.dialog.open(NewServiceComponent,
      {data: {opc: false, idNuevo: ++this.mayorNumero, arrayCiudad: this.arrayCiudades, arrayRs: this.arrayRS, arrayPlan:this.arrayPlan},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();

     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.idServicio > 0  ){
        this.ELEMENT_DATA.unshift({id: result.idServicio,nombre:result.nombre,
          rs:result.rs, ip:result.ip, ciudad:result.ciudad, servicio:result.servicio, identificador: result.identificador, estatus: this.metodo.estatus(result.estatus)});
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
