import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { serviceModel } from 'src/app/models/service.model';
import { Workbook } from 'exceljs'; 
import * as fs from 'file-saver';

@Component({
  selector: 'app-table-service',
  templateUrl: './table-service.component.html',
  styleUrls: ['./table-service.component.css']
})
export class TableServiceComponent implements OnInit {

  ELEMENT_DATA : any = [ ]
  metodo = new RepeteadMethods();
  cargando : boolean = false;
  $sub = new Subscription()
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;  
  @Input() hijoService :string ="";
  @Input() nombreEmpresa :string ="";

  id :number = this.rutaActiva.snapshot.params["id"];
  mayorNumero : number = 0
  ultimoId : number = 0
  nombreRs: string =""
  nombreCi : string = ""
  arrayCiudades : any[] = []
  arrayRS : string [] = []
  arrayPlan : any [] = []
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = [ 'identificador','nombre', 'rs','ciudad','estatus','opciones'];
  
  constructor(private dialog:NgDialogAnimationService, private rutaActiva:ActivatedRoute
    ,  private notificationService: NotificationService, private serviceService : ServiceService,
    private city : CityService, private rs : RsService, private plan : planService) {
      this.inicio();
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
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header : string[]=["Id","Nombre","Razon Social","Latitud", "Longitud", "Dominio","Direccion","Ciudad","Identificador","Servicio","Plan", "Estatus"]
    worksheet.addRow(header);
  
    for  (let x1 in this.ELEMENT_DATA)
    {
      let x2=Object.keys(x1);
      let temp : any=[]

        temp.push(this.ELEMENT_DATA[x1]["id" ])
        temp.push(this.ELEMENT_DATA[x1]["nombre"])
        temp.push(this.ELEMENT_DATA[x1]["rs"])
        temp.push(this.ELEMENT_DATA[x1]["latitud"])
        temp.push(this.ELEMENT_DATA[x1]["longitud"])
        temp.push(this.ELEMENT_DATA[x1]["dominio"])
        temp.push(this.ELEMENT_DATA[x1]["direccion"])
        temp.push(this.ELEMENT_DATA[x1]["ciudad"])
        temp.push(this.ELEMENT_DATA[x1]["identificador"])
        temp.push(this.ELEMENT_DATA[x1]["servicio"])
        temp.push(this.ELEMENT_DATA[x1]["plan"])
        temp.push(this.ELEMENT_DATA[x1]["estatus"])
      worksheet.addRow(temp)
    }

    let fname="ExcelClientes"

    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');  

    });
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  ngOnInit(): void {
//    console.log(this.ultimoIdFalso);
    
  }

  async inicio(){
  //  await this.ultimoIDFalso();
    await this.ultimoID()
    await this.todasCiudades();
    await this.todasRS();
    await this.todosPlan();
    await this.llenarTabla()    
  }

  async todasCiudades(){
    this.$sub.add(await this.city.llamarCiudades().subscribe((resp:any) =>{
      this.arrayCiudades = resp.container      
    }));
  }
  async todasRS(){
    this.$sub.add(await this.rs.llamarTodo(this.id).subscribe((resp:any) =>{
      this.arrayRS = resp.container
      
    }));
  }
  async todosPlan(){
    this.$sub.add(await this.plan.llamarTodo().subscribe((resp:any) =>{
      this.arrayPlan = resp.container
    }));
  }

  async ultimoID() {
    this.$sub.add(await this.serviceService.llamarService_maxId().subscribe((resp:responseService)=>{
      try{
      this.ultimoId = resp.container[0].idServicio
      }catch(Exception){}
    }))
  }

  async llenarTabla(){
    this.cargando = false;             
    this.$sub.add(await this.serviceService.llamarTodo(this.id).subscribe((resp:responseService) =>{               
      if(resp.container.length !=0){
        console.log(resp.container);
        
      this.mayorNumero = resp.container[0].idServicio;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          id:resp.container[i].idServicio,
          nombre:resp.container[i].servicio,
          rs:resp.container[i].razonSocial,
          idRazonSocial : resp.container[i].idRazonSocial,
          latitud :  resp.container[i].latitud,
          longitud :  resp.container[i].longitud,
          dominio :  resp.container[i].dominio,
          direccion :  resp.container[i].direccion,
          cveEstatus :  resp.container[i].estatus,
          cvePlan :  resp.container[i].cvePlan,
          cveCiudad :  resp.container[i].cveCiudad,
          identificador:((resp.container[i].identificador)+""+(resp.container[i].contador.toString().padStart(5,"0"))),
          ciudad:resp.container[i].ciudad,
          servicio:resp.container[i].servicio,
          plan:resp.container[i].plan,
          estatus:this.metodo.estatus(resp.container[i].estatus)  

        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }else{
      this.mayorNumero = this.ultimoId;      
    }
    }))
    this.cargando = true;
  }


  async eliminar(id : number){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 4},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      this.$sub.add(await dialogRef.afterClosed().subscribe((result : any) => {
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
      }));
  }
  
  editar(idServicio : number, nombre : string, rs :string, idRazonSocial : number, latitud : string, longitud : string,
    dominio :string, direccion : string, cvePlan :number, cveEstatus : number,cveCiudad : number, identificador : string, ciudad :number, 
    servicio : string){
 
    let dialogRef  = this.dialog.open(NewServiceComponent,
      {data: {opc : true,
        idEmpresa: this.id,
        Empresa: this.nombreEmpresa[0],
        idServicio: idServicio, 
        arrayCiudad:this.arrayCiudades, 
        arrayPlan:this.arrayPlan,
        arrayRS:this.arrayRS, 
        servicio : servicio, 
        idRazonSocial:idRazonSocial, 
        latitud:latitud, 
        longitud:longitud,
        direccion:direccion,
        cvePlan:cvePlan,
        dominio:dominio,
        cveCiudad:cveCiudad,
        cveEstatus : cveEstatus
        ,identificador : identificador, 
        nombre:nombre, 
        rs:rs },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
     this.paginator2.firstPage();
     this.$sub.add( dialogRef.afterClosed().subscribe((result:any)=>{       
       try{
        this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(idServicio,this.ELEMENT_DATA)
        ,1,{
          id:result.id, 
          nombre:result.nombre,
          rs:result.rs,
          idRazonSocial : result.idRazonSocial,
          latitud :  result.latitud,
          longitud :  result.longitud,
          dominio :  result.dominio,
          direccion :  result.direccion,
          cvePlan : result.cvePlan,
          cveEstatus :  result.cveEstatus,
          cveCiudad : result.cveCiudad,
          identificador:result.identificador,
          ciudad:result.ciudadNombre,
          servicio:result.servicio,
          plan:result.plan,
          estatus:this.metodo.estatus(result.cveEstatus)  
        });
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
      }catch(Exception){}
     }))
  }

 async insertar(){   
    let dialogRef  = this.dialog.open(NewServiceComponent,
      {data: {opc: false,idEmpresa: this.id,
        Empresa: this.nombreEmpresa[0] ,idNuevo: this.mayorNumero, arrayCiudad: this.arrayCiudades, arrayRS: this.arrayRS, arrayPlan:this.arrayPlan},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(await dialogRef.afterClosed().subscribe((result:serviceModel)=>{

       try{
      if(result.id > 0  ){
        this.ELEMENT_DATA.unshift({
          
          id: result.id,
          nombre:result.nombre,
          servicio:result.nombre,
          rs:result.rs, 
          ciudad:result.ciudadNombre, 
          identificador: result.identificador, 
          estatus: this.metodo.estatus(result.cveEstatus),
          cveEstatus : result.cveEstatus,
          idRazonSocial : result.idRazonSocial,
          latitud :  result.latitud,
          longitud :  result.longitud,
          dominio :  result.dominio,
          direccion :  result.direccion,
          cvePlan : result.cvePlan,
          cveCiudad : result.cveCiudad,
          plan:result.plan
        });
          
        this.mayorNumero = result.id;
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       }
      }catch(Exception){}
     }))
  }

}
