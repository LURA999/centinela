import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Observable, Subscription } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RolService } from 'src/app/core/services/rol.service';
import { ContactServiceModel } from 'src/app/models/contactService.model';
import { responseService } from 'src/app/models/responseService.model';
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
  identificador :string = this.rutaActiva.snapshot.params["identificador"];

  contactos : Observable<any> | undefined;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id',  'nombre',  'apPaterno',  'apMaterno',  'correo',  'estatus',  'celular',  'puesto',  'opciones'];
  cargando : boolean = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  mayorNumero : number = 0
  mayorNumeroUltimo : number = 0

  arrayRol : string [] = []
  arrayServicios : string [] = []

  constructor(private dialog:NgDialogAnimationService,private serviceContact : ContactService,private rutaActiva: ActivatedRoute,
    private notificationService: NotificationService,  private rol :RolService) { }
  
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
    this.inicio();    
  }

  descargar(){
  
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  async inicio(){
    await this.ultimoID()
    await this.todoRol()
    await this.buscarServicios()
    if(this.id != undefined && this.identificador == undefined)
      await this.llenarTablaContactoEmpresa()
    else
      await this.llenarTablaContactoServicio()
  }
  async ultimoID(){
    await  this.$sub.add(this.serviceContact.llamarContactos_maxId().subscribe((resp:responseService) => {
      try{
      this.mayorNumeroUltimo = resp.container[0].idContacto;
      }catch(Exception) {}      
    }))
  }

  async todoRol(){
    await  this.$sub.add(this.rol.llamarTodo().subscribe((resp:responseService) => {
      this.arrayRol = resp.container;
    }))
  }

  async buscarServicios(){
    await  this.$sub.add(this.serviceContact.llamarContactos_tServicos_servicios(this.id).subscribe((resp:responseService) => {
      this.arrayServicios = resp.container;
    }))
  }

  async llenarTablaContactoEmpresa(){
    this.cargando = false;
    await this.$sub.add( this.serviceContact.llamarContactos_tServicos(this.id).subscribe((resp:any) =>{       
      if(resp.container.length !=0){
        this.mayorNumero = resp.container[0].idContacto;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ id:resp.container[i].idContacto,
        nombre:resp.container[i].nombre,
        apPaterno:resp.container[i].apellidoMaterno,
        apMaterno:resp.container[i].apellidoMaterno,
        correo:resp.container[i].correo,
        cveEstatus:resp.container[i].estatus,
        estatus:this.metodo.estatus(resp.container[i].estatus),
        celular:resp.container[i].celular,
        telefono:resp.container[i].telefono,
        puesto:resp.container[i].puesto,
        idServicio:resp.container[i].idServicio,
        idRol:resp.container[i].cveRol,
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }else{
      this.mayorNumero = this.mayorNumeroUltimo;
    }
    }));
    this.cargando = true;
  }

  async llenarTablaContactoServicio(){
    this.cargando = false;
    await this.$sub.add( this.serviceContact.llamarContactos_tContactos_cliente(this.id,this.identificador).subscribe((resp:any) =>{       
      if(resp.container.length !=0){
        this.mayorNumero = resp.container[0].idContacto;
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ id:resp.container[i].idContacto,
        nombre:resp.container[i].nombre,
        apPaterno:resp.container[i].apellidoMaterno,
        apMaterno:resp.container[i].apellidoMaterno,
        correo:resp.container[i].correo,
        cveEstatus:resp.container[i].estatus,
        estatus:this.metodo.estatus(resp.container[i].estatus),
        celular:resp.container[i].celular,
        telefono:resp.container[i].telefono,
        puesto:resp.container[i].puesto,
        idServicio:resp.container[i].idServicio,
        idRol:resp.container[i].cveRol,
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }else{
      this.mayorNumero = this.mayorNumeroUltimo;
    }
    }));
    this.cargando = true;
  }


  async eliminar(id : number){  
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 1},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await  this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {
        try{
          this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(id,this.ELEMENT_DATA))
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }catch(Exception){}
      }));
  }
  editar(idContacto : number, nombre:string,apPaterno:string,apMaterno:string, correo:string, estatus:number,celular:number,telefono:number,puesto:string,idServicio:number,idRol:number){
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {opc : true,arrayRol:this.arrayRol, arrayServicios:this.arrayServicios,idContacto:idContacto,nombre:nombre,apPaterno:apPaterno,apMaterno:apMaterno, 
        correo:correo, estatus:estatus,celular:celular,puesto:puesto, telefono:telefono,idServicio:idServicio,idRol:idRol },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{
       try{
          this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(idContacto,this.ELEMENT_DATA)
        ,1,{id:idContacto,
          nombre:result.nombre,
          apPaterno:result.paterno,
          apMaterno:result.materno,
          correo:result.correo,
          cveEstatus:result.estatus,
          estatus:this.metodo.estatus(result.estatus),
          celular:result.celular,
          telefono:result.telefono,
          puesto:result.puesto,
          idServicio:result.cveServicio,
          idRol:result.cveRol});
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
      }catch(Exception){}
     }))

  }

  insertar(){
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {opc : false, arrayRol : this.arrayRol, arrayServicios: this.arrayServicios, proximoID: this.mayorNumero },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:ContactServiceModel)=>{
       try{
        this.ELEMENT_DATA.unshift({id: result.cveContacto,nombre:result.nombre,
        apPaterno:result.paterno,
        apMaterno:result.materno,
        correo:result.correo,
        estatus:this.metodo.estatus(result.estatus),
        celular:result.celular,
        puesto:result.puesto});
        this.mayorNumero = result.cveContacto;
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
