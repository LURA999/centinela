import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
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
  
}
