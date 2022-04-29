import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { responseService } from "src/app/models/responseService.model";
import { serviceModel } from "src/app/models/service.model";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class ServiceService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(cve : number) : Observable<responseService> {
        return this.http.get<responseService>(this.local+"Services/services.php?cve="+cve);
    }

    deleteService(cve : number){
        return this.http.patch(this.local+"Services/services.php?cve="+cve,cve);
    }

    updateService(){

    }

    insertService(input : serviceModel) : Observable<responseService> {
        let headers = new HttpHeaders().set('Content-type','Application/json');
        return this.http.post<responseService>(this.local+"Services/services.php", input, {headers});
    }

    llamarService_maxId(): Observable<responseService>{        
        return this.http.get<responseService>(this.local+"Services/services.php");
      }
    
} 