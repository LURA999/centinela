import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class LogService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(cve:number){
        return this.http.get(this.local+"Users/log.php?cve="+cve);
    }

    deleteLog(){

    }

    updateLog(){

    }

    insertLog() {
    
    }
} 