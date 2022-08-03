import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { responseService } from "src/app/models/responseService.model";
import { environment } from 'src/environments/environment';
import { contactsEmailTicketInterface } from "../../interfaces/contactsEmailTicketInterface.interface"

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

    insertTickets()  {
       // return this.http.get(this.local+"Tickets/tickets.php",);
    }


    //Enviar correoTicket 
    enviarCorreo(email:contactsEmailTicketInterface){
        this.http.post(this.local+"Tickets/correoTicket.php",email);
    }

} 