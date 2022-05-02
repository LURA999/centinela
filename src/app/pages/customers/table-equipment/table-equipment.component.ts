import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RsService } from 'src/app/core/services/rs.service';
import { responseService } from 'src/app/models/responseService.model';
import { RsModel } from 'src/app/models/rs.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewRsComponent } from '../popup/new-rs/new-rs.component';

@Component({
  selector: 'app-table-equipment',
  templateUrl: './table-equipment.component.html',
  styleUrls: ['./table-equipment.component.css']
})
export class TableEquipmentComponent implements OnInit {
  ELEMENT_DATA : any = [ ]
  cargando : boolean = false;
  $sub = new Subscription()
  @Input ()hijoRS :string = ""
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  id :number = this.rutaActiva.snapshot.params["id"];
  mayorNumero : number = 0
  mayorNumeroAux : number = 0
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['rs', 'fechaAlta', 'estatus','opciones'];
  metodo = new RepeteadMethods();

  constructor(private dialog:NgDialogAnimationService,private serviceRs : RsService, private rutaActiva:ActivatedRoute,
    private notificationService: NotificationService,
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoRS'];
    if(!c.firstChange && c.currentValue != ""){
    if(c.currentValue[0] == "d"){
      this.descargar();
    }else if(c.currentValue[0] == "a"){
      this.hijoRS = ""
      this.insertar();
    }
  }
}

  ngOnInit(): void {
   this.llenarTabla()
  }

  async descargar(){

  }
  async llenarTabla(){
    this.cargando = false;             
    this.$sub.add(await this.serviceRs.llamarTodo(this.id).subscribe((resp:responseService) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[0].idRazonSocial;
      this.mayorNumeroAux = this.mayorNumero;      

      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          id: resp.container[i].idRazonSocial,
          rs:resp.container[i].razonSocial,
          fechaAlta:this.metodo.formatoFechaEspanolMysql(resp.container[i].fechaAlta),
          cveEstatus:resp.container[i].estatus,  
          estatus:this.metodo.estatus(resp.container[i].estatus),  
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }
    }))
    this.cargando = true;

  }

  eliminar(id : number){
    let dialogRef  = this.dialog.open(DeleteComponent,
      {data: {idCliente: id, opc : 3 },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {
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

  editar(rs:string,fechaAlta:string,estatus:number){
    let dialogRef  = this.dialog.open(NewRsComponent,
      {data: {opc : true, rs:rs,fechaAlta:fechaAlta,cveEstatus:estatus },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: ++this.mayorNumero,rs:result.rs, fechaAlta:result.fechaAlta, estatus:this.metodo.estatus(result.estatus)});
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
  
  insertar(){
    this.mayorNumeroAux = Number(this.mayorNumeroAux) + 1;
    let dialogRef  = this.dialog.open(NewRsComponent,
      {data: {opc : false, idCliente : this.id },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:RsModel)=>{

       try{
        this.ELEMENT_DATA.unshift({id: this.mayorNumeroAux,rs:result.rs, fechaAlta:result.fechaEspanol, estatus:this.metodo.estatus(result.estatus)});
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;
        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
      }catch(Exception){}
     }))
  }
}


