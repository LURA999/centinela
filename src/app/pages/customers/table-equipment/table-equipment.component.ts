import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DataService } from 'src/app/core/services/data.service';
import { NewEquipamentComponent } from '../popup/new-equipament/new-equipament.component';
import { DeviceModel } from 'src/app/models/device.model';
import { DeviceService } from 'src/app/core/services/device.service';
import { responseService } from 'src/app/models/responseService.model';
import { DeleteComponent } from '../popup/delete/delete.component';

@Component({
  selector: 'app-table-equipment',
  templateUrl: './table-equipment.component.html',
  styleUrls: ['./table-equipment.component.css']
})
export class TableEquipamentComponent implements OnInit {

  ELEMENT_DATA : any = [ ]
  cargando : boolean = false;
  $sub = new Subscription()
  @ViewChild ("paginator") paginator2:any;
  @Input () tamanoTabla : number = 0
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  identificador :string = this.ruta.url.split("/")[4];
  mayorNumero : number = 0
  mayorNumeroAux : number = 0
  modelOtro = new DeviceModel();

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['IdDevice', 'Nombre', 'Tipo', "Modelo","Ip","Estatus",'opciones'];
  metodo = new RepeteadMethods();

  constructor(private dialog:NgDialogAnimationService,private ruta : Router, private rutaActiva:ActivatedRoute,
    private notificationService: NotificationService,private DataService : DataService, private deviceService : DeviceService
    ) { }

  ngOnInit(): void {
   this.llenarTabla()

   this.$sub.add(this.DataService.open.subscribe(res => {
    if(res ==true){
      this.insertar()
  
    }else{
      
    }
    }));  
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  async descargar(){
   
  }
  async llenarTabla(){
    this.cargando = false;       

    this.$sub.add(this.deviceService.todosOtros(this.identificador.slice(0,2),Number(this.identificador.slice(2,7))).subscribe((resp:responseService)=>{
      
      if(resp.container.length !=0){
        this.mayorNumero = Number(resp.container[0].idOtro);    
           
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ 
          idDevice : resp.container[i].idOtro,
          device : resp.container[i].otro,
          idEstatus : resp.container[i].estatus,
          estatus : this.metodo.estatus(resp.container[i].estatus),
          tipo : this.metodo.tipo(resp.container[i].tipo),
          idTipo : resp.container[i].tipo,
          idRepetidora : resp.container[i].idRepetidora,
          repetidora : resp.container[i].repetidora,
          modelo :resp.container[i].modelo,
          idSegmento : resp.container[i].idSegmento,
          segmento : resp.container[i].segmento,
          idIp : resp.container[i].ip1.split("-")[0],
          ip : resp.container[i].ip1.split("-")[1],
          idIp2 : resp.container[i].ip2.split("-")[0],
          ip2 : resp.container[i].ip2.split("-")[1],
          idUsuario : resp.container[i].idUsuario,
          usuario : resp.container[i].usuario,
          contrasena : resp.container[i].contrasena, 
          snmp : resp.container[i].snmp,
          comentario : resp.container[i].comentario
        })
        console.log(this.ELEMENT_DATA);

      }
      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }

    }));
    this.cargando = true;

  }

  async eliminar(id : number){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 8, salir : true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await  this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {
        try{
          this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(id,this.ELEMENT_DATA,"idDevice"))
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }catch(Exception){}
      }));
  }
  editar(model : DeviceModel){
    this.modelOtro = model;
  
    let dialogRef  = this.dialog.open(NewEquipamentComponent,
      {data: {opc : true, model : this.modelOtro, salir: true },
      animation: { to: "bottom" },
      height:"auto", width:"70%"
     });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
       
      try{
        this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(result.idDevice,this.ELEMENT_DATA, "idDevice"),1,result);
                
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator2;    
      this.dataSource.sort = this.sort;
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se edito con exito");
     })
    
    }catch(Exception){ }
     }))
  }

  insertar(){
    this.modelOtro.idDevice= this.mayorNumero;    
    let dialogRef  = this.dialog.open(NewEquipamentComponent,
      {data: {opc : false , model : this.modelOtro, salir : true},
      animation: { to: "bottom" },
      height:"auto", width:"70%"
    });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
       try{
         result.contador = Number(this.identificador.slice(2,7))
         result.identificador = this.identificador.slice(0,2)
        this.ELEMENT_DATA.unshift(result);
        console.log(result);
        
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;
        this.mayorNumero = result.idDevice

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
      }catch(Exception){}
     }))
  }
}
