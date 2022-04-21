import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn:'root'
})
export class TicketService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarTodo(cve : number){
        return this.http.get(this.local+"Tickets/tickets.php?cve="+cve);
    }

    deleteTickets(){

    }

    updateTickets(){

    }

    insertTickets() {
    
    }
} 