import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RepetidorModel } from '../../models/repetidor.model';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';

@Injectable({
  providedIn: 'root'
})
export class RepeaterService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarRepitdores():Observable<responseService>{
    return this.http.get<responseService>(this.local+"Repeater/repeater.php");
  }

  llamarRepitdor(cve : number){
    return this.http.get(this.local+"Repeater/repeater.php?id="+cve);
  }

  deleteRepetidor(id:number){
    return this.http.patch(this.local+"Repeater/repeater.php?id="+id,{responseType: 'text'});
  }

  insertarRepetidor(input :RepetidorModel){
    return this.http.post(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }

  updateRepetidor(input :RepetidorModel){
    return this.http.patch(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }
  
  segmentosTodoRepetidor(cve:number){
    return this.http.get(this.local+"Repeater/repeater.php?cve="+cve);    
  }

  buscarSegmentoRepetidor(cve:number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Repeater/repeater.php?idr="+cve);    
  }
  

}
