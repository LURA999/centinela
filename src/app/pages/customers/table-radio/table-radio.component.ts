import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeviceModel } from 'src/app/models/device.model';
import { DataService } from 'src/app/core/services/data.service';
import { NewRadioComponent } from '../popup/new-radio/new-radio.component';
import { DeviceService } from 'src/app/core/services/device.service';
import { responseService } from 'src/app/models/responseService.model';
import { DeleteComponent } from '../popup/delete/delete.component';

@Component({
  selector: 'app-table-radio',
  templateUrl: './table-radio.component.html',
  styleUrls: ['./table-radio.component.css']
})
export class TableRadioComponent implements OnInit {

  ELEMENT_DATA : any = [ ] 
  cargando : boolean = false;
  radios :any;
  $sub = new Subscription()
  @ViewChild ("paginator") paginator2:any;
  @Input () tamanoTabla : number = 0
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  identificador :string = this.ruta.url.split("/")[4];
  mayorNumero : number = 0
  mayorNumeroAux : number = 0
  metodo  = new RepeteadMethods();
  modelRadio = new DeviceModel();
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['IdDevice', 'Nombre', 'Tipo', "Modelo","Ip","Estatus",'opciones'];
  constructor(private dialog:NgDialogAnimationService,
    private notificationService: NotificationService, private DataService : DataService,
    private deviceService : DeviceService, private ruta : Router
    ) { }

  ngOnInit(): void {
   this.llenarTabla()
    
   this.$sub.add(this.DataService.open.subscribe(res => {
    if(res ==true){
      this.insertar()
  
    }else{
      
    }
    })) 
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  async descargar(){
   
  }

  async llenarTabla(){
    this.cargando = false;             
    this.$sub.add (this.deviceService.todosRadios(this.identificador.slice(0,2),Number(this.identificador.slice(2,7))).subscribe((resp:responseService)=>{
      if(resp.container.length !=0){
        this.mayorNumero = resp.container[0].idRadio;
                
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ 
          idDevice : resp.container[i].idRadio,
          device : resp.container[i].radio,
          idEstatus : resp.container[i].estatus,
          estatus : this.metodo.estatus(resp.container[i].estatus),
          tipo : this.metodo.tipo(resp.container[i].tipo),
          idTipo : resp.container[i].tipo,
          idRepetidora : resp.container[i].idRepetidora,
          repetidora : resp.container[i].repetidora,
          modelo :resp.container[i].modelo,
          idSegmento : resp.container[i].idSegmento,
          segmento : resp.container[i].segmento,
          idIp : resp.container[i].idIp,
          ip : resp.container[i].ip,
          idUsuario : resp.container[i].idUsuario,
          usuario : resp.container[i].usuario,
          contrasena : resp.container[i].contrasena, 
          snmp : resp.container[i].snmp
        })
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
      {data: {idCliente : id, opc: 7, salir : true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await  this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {

        if(result.salir == false ){
        try{
          this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(id,this.ELEMENT_DATA,"idDevice"))
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }catch(Exception){}
      }
      }));
    
  }

  editar(idRadio : number,  radio : string,  cveEstatus : number, estatus : string,
    tipo : string, cveTipo : number, idRepetidora  : number,  repetidora : string,  modelo : string,  idSegmento : number,
    segmento : string, idIp : number, ip : string,  idUsuario : number,  usuario : string, contrasena : string, snmp : string){
    this.modelRadio.idDevice= idRadio;
    this.modelRadio.device = radio;
    this.modelRadio.estatus = estatus;
    this.modelRadio.idEstatus = cveEstatus;
    this.modelRadio.idTipo = cveTipo;
    this.modelRadio.tipo = tipo;
    this.modelRadio.idRepetidora = idRepetidora;
    this.modelRadio.repetidora = repetidora;
    this.modelRadio.modelo = modelo;
    this.modelRadio.idSegmento = idSegmento;
    this.modelRadio.segmento = segmento;
    this.modelRadio.idIp = idIp;
    this.modelRadio.ip = ip;
    this.modelRadio.idUsuario = idUsuario;
    this.modelRadio.usuario = usuario;
    this.modelRadio.contrasena = contrasena;
    this.modelRadio.snmp = snmp;
      
    let dialogRef  = this.dialog.open(NewRadioComponent,
      {data: {opc : true, model : this.modelRadio, salir : true },
      animation: { to: "bottom" },
      height:"auto", width:"70%"
     });

     this.paginator2.firstPage();
     this.$sub.add (dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
      try{
        console.log(result);
        
        this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(idRadio,this.ELEMENT_DATA, "idDevice")
      ,1,{idDevice:result.idDevice,
        device : result.device,
        estatus : result.estatus,
        idEstatus : result.idEstatus,
        tipo : result.tipo,
        idTipo : result.idTipo,
        idRepetidora : result.idRepetidora,
        repetidora : result.repetidora,
        modelo : result.modelo,
        idSegmento : result.idSegmento,
        segmento : result.segmento,
        idIp : result.idIp,
        ip : result.ip,
        idUsuario : result.idUsuario,
        usuario : result.usuario,
        contrasena :result.contrasena ,
        snmp : result.snmp});
        console.log(this.ELEMENT_DATA);
        
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
    this.modelRadio.idDevice= this.mayorNumero;    
    console.log(this.modelRadio);
    
    let dialogRef  = this.dialog.open(NewRadioComponent,
      {data: {opc : false , model : this.modelRadio, salir : true},
      animation: { to: "bottom" },
      height:"auto", width:"70%"
    });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
       try{
        this.ELEMENT_DATA.unshift({ 
          idDevice : result.idDevice,
          device : result.device,
          estatus : result.estatus,
          idEstatus : result.idEstatus,
          tipo : result.tipo,
          idTipo : result.idTipo,
          idRepetidora : result.idRepetidora,
          repetidora : result.repetidora,
          modelo : result.modelo,
          idSegmento : result.idSegmento,
          segmento : result.segmento,
          idIp : result.idIp,
          ip : result.ip,
          idUsuario : result.idUsuario,
          usuario : result.usuario,
          contrasena :result.contrasena ,
          snmp : result.snmp});
        
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
