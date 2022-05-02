import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TicketService } from 'src/app/core/services/tickets.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewTicketComponent } from '../popup/new-ticket/new-ticket.component';

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
  @Input() hijoTickets :string ="";

  ELEMENT_DATA : any = []
  metodo = new RepeteadMethods()
  displayedColumns: string[] = ['num', 'departamento', 'asunto', 'servicio', 'fechaCerrada','fechaAbierta','estado','agente','opciones'];
  cargando : boolean = false;
  $sub = new Subscription()
  @Input ()hijoRS :string = ""
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  id :number = this.rutaActiva.snapshot.params["id"];
  mayorNumero : number = 0
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  constructor( private dialog:NgDialogAnimationService, private rutaActiva:ActivatedRoute,
    private notificationService: NotificationService, private servicioTickets : TicketService ) { }

  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoTickets'];
    
    if(!c.firstChange && c.currentValue != ""){      
    if(c.currentValue[0] == "d"){
      this.descargar()
    }else if(c.currentValue[0] == "a"){
      this.insertar()
    }    
  }
}

  ngOnInit(): void {
    this.llenarTabla();
  }

  descargar(){

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$sub.unsubscribe()
  }
  async llenarTabla(){
    this.cargando = false;             
    this.$sub.add(await this.servicioTickets.llamarTodo(this.id).subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idServicio;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          num:resp.container[i].idTicket,
          departamento: resp.container[i].departamento,
          asunto:resp.container[i].asunto,
          servicio:resp.container[i].nombre,
          fechaCerrada:resp.container[i].fechaCerrada,
          fechaAbierta:resp.container[i].fechaAbierta,
          estado:resp.container[i].estado,
          agente: resp.container[i].agente,
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }
    }))
    this.cargando = true;

  }

  async eliminar(){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : this.id, opc: 5},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      this.$sub.add(await dialogRef.afterClosed().subscribe((result : any) => {
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
      }));
  }
  
  editar(){
    let dialogRef  = this.dialog.open(NewTicketComponent,
      {data: {opc : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({num: ++this.mayorNumero, departamento:result.departamento, asunto:result.asunto,
        servicio:result.servicio,  fechaCerrada:result.fechaCerrada, fechaAbierta:result.fechaAbierta,  
        estado:this.metodo.estatus(result.estado), agente:result.agente});

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
    let dialogRef  = this.dialog.open(NewTicketComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({num: ++this.mayorNumero, departamento:result.departamento, asunto:result.asunto,
        servicio:result.servicio,  fechaCerrada:result.fechaCerrada, fechaAbierta:result.fechaAbierta,  
        estado:this.metodo.estatus(result.estado), agente:result.agente});
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

  

  async mensaje(mensaje : string){
    await console.log(mensaje);
    
  }

}
