import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { count } from 'console';
import { read } from 'fs';
import { max } from 'moment';
import { lastValueFrom } from 'rxjs';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { UsersModel } from 'src/app/models/users.model';
interface Rol {
  value: number;
  viewValue: string;
}
interface Grupo {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  count:string=""
  usermodel=new UsersModel()
  Roles: Rol[] = [];
  Grupos: Grupo[] = [];

  selectedasunto:number =0;
   archivo:string=""
  public files: any [] = [];
  constructor(private userservice : UsersmoduleService, public dialogRef: MatDialogRef<NewUserComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.llamarCve();
    }
  
    async llamarCve(){
    await this.userservice.llamarCve().toPromise().then( (result : any) =>{
    for(let i=0;i<result.container.length;i++){
      
    this.Roles.push({value:result.container[i]["idRol"], viewValue:result.container[i]["nombre"] })
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"] })
    }
    })
  }
  
  subir(nombre:string,apellidop:string,apellidom:string,correo:string,contraseña:string,estatus:number,rol:number,grupo:number){
    
    this.usermodel.nombre=nombre
    this.usermodel.apellidop=apellidop
    this.usermodel.apellidom=apellidom
    this.usermodel.correo=correo
    this.usermodel.contraseña=contraseña
    this.usermodel.estatus=estatus
    this.usermodel.rol=rol
    this.usermodel.grupo=grupo
    lastValueFrom(this.userservice.insertarUser(this.usermodel)); 
    console.log(this.usermodel);
  
    }
    
  }
