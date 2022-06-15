import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { responseService } from "src/app/models/responseService.model";
import { serviceModel } from "src/app/models/service.model";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class SearchService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarServicio(){
  
        return this.http.get(this.local+"Search/search.php");
      }

      llamarServicioEstatus(cve:number){
        return this.http.get(this.local+"Search/search.php?id="+cve);
      }
      


    
} 