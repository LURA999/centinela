import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewContactComponent } from '../popup/new-contact/new-contact.component';
import { RepeteadMethods } from './../../RepeteadMethods';
@Component({
  selector: 'app-table-contact',
  templateUrl: './table-contact.component.html',
  styleUrls: ['./table-contact.component.css']
})
export class TableContactComponent implements OnInit {
  ELEMENT_DATA : any = [ ]
  $sub = new Subscription();
  metodo = new RepeteadMethods();
  @Input ()hijoContact :string = ""
  id :number = this.rutaActiva.snapshot.params["id"];
  contactos : Observable<any> | undefined;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id',  'nombre',  'apPaterno',  'apMaterno',  'correo',  'estatus',  'celular',  'puesto',  'opciones'];
  cargando : boolean = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  mayorNumero : number = 0
  constructor(private dialog:NgDialogAnimationService,private serviceContact : ContactService,private rutaActiva: ActivatedRoute,
    private notificationService: NotificationService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    let c = changes['hijoContact'];
    
    if(!c.firstChange && c.currentValue != ""){
    if(c.currentValue[0] == "a"){
      this.insertar();

    }else if(c.currentValue[0] == "d"){
      this.hijoContact = ""
      this.descargar();
    }
  }
}

  ngOnInit(): void {    
    this.llenarTabla()
  }

  descargar(){
  
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$sub.unsubscribe();
  }

  async llenarTabla(){
    this.cargando = false;             
     await this.serviceContact.llamarContactos_tServicos(this.id).subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idContacto;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ id:resp.container[i].idContacto,
        nombre:resp.container[i].nombre,
        apPaterno:resp.container[i].apellidoMaterno,
        apMaterno:resp.container[i].apellidoMaterno,
        correo:resp.container[i].correo,
        estatus:resp.container[i].estatus,
        celular:resp.container[i].celular,
        puesto:resp.container[i].puesto,
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
      {data: {idCliente : this.id, opc: 1},
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
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {opc : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: "" /*id*/,
          nombre:result.nombre,
          apPaterno:result.apPaterno,
          apMaterno:result.apMaterno,
          correo:result.correo,
          estatus:result.estatus,
          celular:result.celular,
          puesto:result.puesto});

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
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: ++this.mayorNumero,nombre:result.nombre,
        apPaterno:result.apPaterno,
        apMaterno:result.apMaterno,
        correo:result.correo,
        estatus:result.estatus,
        celular:result.celular,
        puesto:result.puesto});

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
