import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ManualModel } from 'src/app/models/manual.model';

@Injectable({
  providedIn: 'root'
})
export class ManualService {
  local = environment.api; 
  constructor(private http : HttpClient, private manualservice:ManualService) { }

  llamarManual(){
  
    return this.http.get(this.local+"Manual/manual.php");
  }

  

  updateManual(input:ManualModel){
    return this.http.patch(this.local+"Manual/manual.php",input,{responseType: 'text'});
  }

  insertarManual(input :ManualModel){
   
    
    return this.http.post(this.local+"Manual/manual.php",input, {responseType:"text"});
  }

  deleteManual(id:number){
    console.log(id);
    
    return this.http.delete(this.local+"Manual/manual.php?id="+id,{responseType: 'text'});  }

}
