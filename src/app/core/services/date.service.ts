import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DateModel } from 'src/app/models/date.model';


@Injectable({
  providedIn: 'root'
})
export class DateService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarDate(){
    
    
    return this.http.get(this.local+"date.php");
  }
  insertarDate(input :DateModel){
    return this.http.post(this.local+"date.php",input, {responseType:"text"});
  }
  updateDate(input:DateModel){
    console.log(input);
    
    return this.http.patch(this.local+"date.php",input,{responseType: 'text'});

  }

  

}
