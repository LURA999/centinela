import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RsService } from 'src/app/core/services/rs.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewRsComponent } from '../popup/new-rs/new-rs.component';

@Component({
  selector: 'app-table-rs',
  templateUrl: './table-rs.component.html',
  styleUrls: ['./table-rs.component.css']
})
export class TableRsComponent implements OnInit {
  ELEMENT_DATA : any = [ ]
  cargando : boolean = false;
  @Input ()hijoRS :string = ""
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  id :number = this.rutaActiva.snapshot.params["id"];
  mayorNumero : number = 0
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
      this.eliminar();
    }else if(c.currentValue[0] == "a"){
      this.hijoRS = ""
      this.insertar();
    }
  }
}

  ngOnInit(): void {
   this.llenarTabla()
  }

  async llenarTabla(){
    this.cargando = false;             
     await this.serviceRs.llamarTodo(this.id).subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idRazonSocial;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          rs:resp.container[i].razonSocial,
          fechaAlta:resp.container[i].fechaAlta,
          estatus:resp.container[i].estatus,  
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }
    })
    this.cargando = true;

  }

  eliminar(){
    let dialogRef  = this.dialog.open(DeleteComponent,
      {data: {idCliente: this.id, opc : 3 },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
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
     })
  }

  editar(){
    let dialogRef  = this.dialog.open(NewRsComponent,
      {data: {opc : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
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
     })
  }
  
  insertar(){
    let dialogRef  = this.dialog.open(NewRsComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
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
     })
  }
}
