import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RepeteadMethods } from '../RepeteadMethods';
import { MyCustomPaginatorIntl } from '../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class UsersComponent implements OnInit {
  cargando : boolean = false;
  mayorNumero : number =0;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  metodos=new RepeteadMethods ()
id:string=""
usuario:string=""
grupo:string=""
rol:string=""
estatus:string=""

  ELEMENT_DATA : any =[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns = ['id','usuario',"grupo","estado",'opciones'];
  constructor(     private notificationService: NotificationService
    ,   private dialog : NgDialogAnimationService, private userservice : UsersmoduleService) { }

  ngOnInit(): void {
    this.llenarTabla()
  }


  
    numeroMayor(numero : number){
      if (this.mayorNumero <numero){
        this.mayorNumero = numero
      }
  
  }
  
  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  
    await this.userservice.llamarUsuarios().toPromise().then( (result : any) =>{
      
  console.log(result.container);
  
      for (let i=0; i<result.container.length; i++){
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idUsuario"],usuario: result.container[i]["usuario"], grupo: result.container[i]["grupo"],estatus: this.Estatus( result.container[i]["estatus"])
          ,rol:result.container[i]["rol"]
      });
    this.numeroMayor(result.container[i]["idUsuario"]);
    }
    console.log(this.ELEMENT_DATA);
    
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      console.log(this.dataSource);
      
      this.dataSource.paginator =  this.paginator2;
      this.cargando = true;
      
      
    });
      
  }
  
  hayManual(){
    if(this.ELEMENT_DATA != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  
  Estatus(numero:number) {
    switch(numero){
      case 1:
        return "Activo"
      case 2:
        return "Inactivo"
        case 3:
        return "Suspendido"
      
        
    }
  }
  
  }
  


