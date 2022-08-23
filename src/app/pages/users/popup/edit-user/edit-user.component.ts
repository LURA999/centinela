import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';
interface Grupo {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  cargando : boolean = false;
  mayorNumero : number =0;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  metodos=new RepeteadMethods ()
nombres:string=""
apellidoPaterno:string=""
apellidoMaterno:string=""
correo:string=""
contraseña:string=""
usuario:string=""
contrasena:string=""
estatus:number=0;
  ELEMENT_DATA : any =[]
  Grupos:Grupo[]=[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
 grupo:number=0;
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,   private notificationService: NotificationService
    ,   private dialog : NgDialogAnimationService, private userservice : UsersmoduleService) { }

  ngOnInit(): void {
    this.llamarCve();
this.llenarlista();
  }

  async llamarCve(){
    await this.userservice.llamarGroup("Group").toPromise().then( (result : any) =>{
      console.log(result.container);
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"] })
    }
    })
  }

  async llenarlista(){
    await this.userservice.llamarUserInfo(this.data.idUsuario).toPromise().then( (result : any) =>{
      console.log(result.container);
      
    this.nombres=result.container[0]["nombres"]

    this.usuario=result.container[0]["usuario"]
    console.log(this.usuario);
  
    this.correo=result.container[0]["correo"]
    this.apellidoMaterno=result.container[0]["apellidoMaterno"]
    this.apellidoPaterno=result.container[0]["apellidoPaterno"]
    this.estatus=result.container[0]["estatus"]
    this.grupo=result.container[0]["cveGroup"]
    
   


  });
  
  }
}
  