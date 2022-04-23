import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { LogService } from 'src/app/core/services/log.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewLogComponent } from '../popup/new-log/new-log.component';

@Component({
  selector: 'app-table-log',
  templateUrl: './table-log.component.html',
  styleUrls: ['./table-log.component.css']
})
export class TableLogComponent implements OnInit {
  ELEMENT_DATA : any = [ ]

  @Input ()hijoLog :string = ""
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'tipo', 'descripcion', 'fecha', 'usuario','opciones'];
  cargando : boolean = false;
  id :number = this.rutaActiva.snapshot.params["id"];
  mayorNumero : number = 0
  metodo = new RepeteadMethods();

  constructor(private dialog:NgDialogAnimationService, private rutaActiva:ActivatedRoute,  
    private notificationService: NotificationService, private servicioLog : LogService) { }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoLog'];
    if(!c.firstChange && c.currentValue != ""){
      console.log(c.currentValue);

    if(c.currentValue[0] == "d"){
      this.descargar();
    }else if(c.currentValue[0] == "a"){
     // this.insertar();
    }
  }
  }

  ngOnInit(): void {
    this.llenarTabla();
  }

  descargar(){

  }

  async llenarTabla(){
    this.cargando = false;             
     await this.servicioLog.llamarTodo(this.id).subscribe((resp:any) =>{

      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idLog;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({num: resp.container[i].idLog,
          tipo: resp.container[i].tipo,
          descripcion: resp.container[i].descripcion,
          fecha:resp.container[i].fecha,
          usuario:resp.container[i].usuario
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
      {data: {idCliente : this.id, opc: 2},
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
  /*editar(){
    let dialogRef  = this.dialog.open(NewLogComponent,
      {data: {opc : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: "" id,
          tipo: "----",
          descripcion: result.detalle,
          fecha:result.fecha,
          usuario:result.usuario});

        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;
        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       }
      }catch(Exception){}
     })

  }*/

  /*insertar(){
    let dialogRef  = this.dialog.open(NewLogComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({num: ++this.mayorNumero,
          tipo: "----",
          descripcion: result.detalle,
          fecha:result.fecha,
          usuario:result.usuario});
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       }
      }catch(Exception){}
     })
  }*/
 

}
