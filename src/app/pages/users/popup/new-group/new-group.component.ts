import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { count } from 'console';
import { read } from 'fs';
import { max } from 'moment';
import { lastValueFrom } from 'rxjs';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { GroupModel } from 'src/app/models/group.model';
import { UsersModel } from 'src/app/models/users.model';
interface Rol {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {
  count:string=""
  groupmodel=new GroupModel()
  Roles: Rol[] = [];
  selectedasunto:number =0;
   archivo:string=""
  public files: any [] = [];
  constructor(private userservice : UsersmoduleService, public dialogRef: MatDialogRef<NewGroupComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.llamarRol();
    }
  
    async llamarRol(){
    await this.userservice.llamarRol("Rol").toPromise().then( (result : any) =>{
      console.log(result.container);
      
    for(let i=0;i<result.container.length;i++){
      
    console.log(typeof(result.container[i]["idRol"]));
    
    this.Roles.push({value:result.container[i]["idRol"], viewValue:result.container[i]["nombre"] })
    console.log(this.Roles);
    
    }
    })
  }
  
  subir(nombre:string,rol:number,estatus:number){
    if(nombre==undefined||rol==undefined||estatus==undefined||nombre==""){
      alert("Por favor llene todos los campos");
    }else{
    this.groupmodel.nombre=nombre
    console.log(rol+"ESTE ES EL ROL VALUE");
    
    this.groupmodel.cveRol=rol
this.groupmodel.estatus=estatus
    console.log(this.groupmodel);

    lastValueFrom(this.userservice.insertarGroup(this.groupmodel)); 
    this.dialogRef.close()
    }
    }
    
  }

