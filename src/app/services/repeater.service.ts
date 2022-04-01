import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RepetidorModel } from '../pages/repeater/models/repetidor.model';

@Injectable({
  providedIn: 'root'
})
export class RepeaterService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarRepitdores(){
    return this.http.get(this.local+"Repeater/repeater.php");
  }

  deleteRepetidor(id:number){
    console.log(id)
    return this.http.patch(this.local+"Repeater/repeater.php?id="+id,{responseType: 'text'});
  }

  insertarRepetidor(input :RepetidorModel){
    return this.http.post(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }

  updateRepetidor(input :RepetidorModel){
    return this.http.patch(this.local+"Repeater/repeater.php",input, {responseType:"text"});
  }

}
