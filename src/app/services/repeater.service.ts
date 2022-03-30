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

  deleteRepetidor(){
    return this.http.get(this.local+"Repeater/repeater.php");
  }

  insertarRepetidor(input :RepetidorModel){
    console.log(input);
    return this.http.post(this.local+"Repeater/repeater.php",{input:input}, {responseType:"text"});
  }

}
