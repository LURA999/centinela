import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotifyModel } from 'src/app/models/notify.model';
import { NotificationModel } from 'src/app/models/notification.model';


@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarNotify(){
    
    
    return this.http.get(this.local+"notify.php");
  }
  insertarNotify(input :NotifyModel){
    return this.http.post(this.local+"notify.php",input, {responseType:"text"});
  }
  updateNotify(input:NotificationModel){
    console.log(input);
    
    return this.http.patch(this.local+"notify.php",input,{responseType: 'text'});

  }

  

}
