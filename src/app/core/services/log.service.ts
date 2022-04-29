import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LogModel } from "src/app/models/log.model";
import { responseService } from "src/app/models/responseService.model";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class LogService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(cve:number) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Users/log.php?cve="+cve);
    }

    deleteLog(){

    }

    updateLog(){

    }

    insertLog(input : LogModel):Observable<responseService> {
       // let headers = new HttpHeaders().set('Content-type','Application/json')
        return this.http.post<responseService>(this.local+"Users/log.php",input);
    }                                                                                                                                                                                                                         
} 