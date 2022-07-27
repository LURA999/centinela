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
      

      // para el componente Ticket Entry

      searchTicketEntry(variable : string,opc:number):Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/searchTicketEntry.php?var="+variable+"&opc="+opc)
      }


      //Para el componente searchId   
      buscarMasIdentificadores(variable : number, condicion : number) :Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/searchIdentifier.php?var="+variable+"&cond="+condicion)
      }
      buscarNombres(variable : string, condicion : number) :Observable<responseService>{
        return this.http.get<responseService>(this.local+"Search/searchIdentifier.php?name="+variable+"&cond="+condicion)
      }
} 