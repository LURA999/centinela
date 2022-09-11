import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { responseService } from 'src/app/models/responseService.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class dashboardTicketsService { 
    api = environment.api;
    constructor(private http : HttpClient) { }

  rangoDeFechas(fechaInicio:string, fechaFinal : string, condicion:number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio="+fechaInicio+"&fechaFin="+fechaFinal+"&tipo="+condicion)
  }

  rangoDeFechasForm(fechaInicio:string, fechaFinal : string, condicion:number,empresa:number):Observable<responseService>{
    return this.http.get<responseService>(this.api+"Tickets/ticketDashboard.php?fechaInicio="+fechaInicio+"&fechaFin="+fechaFinal+"&filtro="+condicion+"&empresa="+empresa)
  }
}