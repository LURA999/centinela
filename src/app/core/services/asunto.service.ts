import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ManualModel } from 'src/app/models/manual.model';

@Injectable({
  providedIn: 'root'
})
export class AsuntoService {
  local = environment.api; 
  constructor(private http : HttpClient, private asunto:AsuntoService) { }

  llamarAsunto(){
  
    return this.http.get(this.local+"Asunto/asunto.php");
  }

  

  updateAsunto(input:ManualModel){
    return this.http.patch(this.local+"Asunto/asunto.php",input,{responseType: 'text'});
  }

  insertarAsunto(input :ManualModel){
   
    
    return this.http.post(this.local+"Asunto/asunto.php",input, {responseType:"text"});
  }

  deleteAsunto(id:number){
    
    return this.http.delete(this.local+"Asunto/asunto.php?id="+id,{responseType: 'text'});  }

}
