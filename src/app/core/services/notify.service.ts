import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotifyModel } from 'src/app/models/notify.model';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarNotify(){
    
    
    return this.http.get(this.local+"Config/notify.php");
  }

  

  deleteNotify(id:number){
    return this.http.patch(this.local+"Repeater/repeater.php?id="+id,{responseType: 'text'});
  }

  insertarNotify(input :NotifyModel){
    return this.http.post(this.local+"Config/notify.php",input, {responseType:"text"});
  }

  

}
