import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { UsersModel } from 'src/app/models/users.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersmoduleService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarUsuarios(){ 
        return this.http.get(this.local+"Users/usersModule.php");
      }
      llamarCve(){ 
        return this.http.get(this.local+"Users/usersModule.php");
      }
      llamarUserbycount(){ 
        return this.http.get(this.local+"Users/usersModule.php");
      }
      insertarUser(input:UsersModel){
        let headers = new HttpHeaders().set('Content-type','Application/json')
        return this.http.post(this.local+"Users/UsersModule.php",input, {headers});
      }
      }
  

