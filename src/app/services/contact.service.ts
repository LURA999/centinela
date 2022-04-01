import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ContactModel } from '../pages/repeater/models/contact.model';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarContacto(cve : number){    
    return this.http.get(this.local+"Repeater/contact.php?id="+cve);
  }

  insertarContacto(input : ContactModel){    
    return this.http.post(this.local+"Repeater/contact.php",input, {responseType:"text" });
  }

  deleteContacto(input : number){    
    return this.http.patch(this.local+"Repeater/contact.php?id="+input, {responseType:"text" });
  }

  updateContacto(input : ContactModel){    
    return this.http.patch(this.local+"Repeater/contact.php",input, {responseType:"text" });
  }

}
