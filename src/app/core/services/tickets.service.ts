import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { formTicketInterface } from "src/app/interfaces/formTicketInterface.interface";
import { responseService } from "src/app/models/responseService.model";
import { environment } from 'src/environments/environment';
import {  contactsEmailTicket } from "../../models/contactsEmailTicket.model"

@Injectable({
    providedIn:'root'
})
export class TicketService {
    local = environment.api;

    constructor(private http:HttpClient){}

    tickets(cond : number,cve:number) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Tickets/tickets.php?cond="+cond+"&cve="+cve);
    }
    
    llamarTodo(cve:number,identificador:string) : Observable<responseService>{
        return this.http.get<responseService>(this.local+"Tickets/tickets.php?cve="+cve+"&identificador="+identificador);
    }
    
    deleteTickets(){

    }

    updateTickets(){

    }

    insertTickets(ticket:formTicketInterface) : Observable<responseService> {
        return this.http.post<responseService>(this.local+"Tickets/tickets.php",ticket);
    }


    //Enviar correoTicket 
    enviarCorreo(email: contactsEmailTicket) : Observable<responseService>{
        return this.http.post<responseService>(this.local+"Tickets/correoTicket.php",email);
    }

} 