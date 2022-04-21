import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class ServiceService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(cve : number){
        return this.http.get(this.local+"Services/services.php?cve="+cve);
    }

    deleteService(){

    }

    updateService(){

    }

    insertService() {
    
    }
} 