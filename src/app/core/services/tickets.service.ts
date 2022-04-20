import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class TicketService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(){
        return this.http.get(this.local+"Tickets/contact.php");
    }
} 