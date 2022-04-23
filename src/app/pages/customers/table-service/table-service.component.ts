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
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id','servicio', 'rs', 'ip', 'nombre','ciudad','estatus','opciones'];
  
  constructor(private dialog:NgDialogAnimationService, private rutaActiva:ActivatedRoute
    ,  private notificationService: NotificationService, private serviceService : ServiceService) { 
    
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
    this.llenarTabla();
  }
  async llenarTabla(){
    this.cargando = false;             
     await this.serviceService.llamarTodo(this.id).subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idServicio;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          id:resp.container[i].idServicio,
          nombre:resp.container[i].nombre,
          rs:resp.container[i].razonSocial,
          ip:"----",
          ciudad:resp.container[i].ciudad,
          servicio:resp.container[i].servicio,
          estatus:resp.container[i].estatus  
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }
    })
    this.cargando = true;

  }


  async eliminar(){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : this.id, opc: 4},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(this.id,this.ELEMENT_DATA))
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
      {data: {opc : false },
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

}
