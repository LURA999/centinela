import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigModel } from '../../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarEmpresa(){
    return this.http.get(this.local+"config.php");
  }

  llamarRepitdor(cve : number){
    return this.http.get(this.local+"config.php?id="+cve);
  }

  deleteRepetidor(id:number){
    return this.http.patch(this.local+"config.php?id="+id,{responseType: 'text'});
  }

  insertarRepetidor(input :ConfigModel){
    return this.http.post(this.local+"config.php",input, {responseType:"text"});
  }

  updateRepetidor(input :ConfigModel){
    console.log(input)
    return this.http.patch(this.local+"config.php",input, {responseType:"text"});
  }

}
