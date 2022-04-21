import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ContactModel } from '../../models/contact.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  /**Carpeta de repetidores */
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

  /**Carpeta de servicios */
  llamarContactos_tServicos(cve : number){        
    return this.http.get(this.local+"Services/contacts.php?cve="+cve);
  }

  deleteContactos_tServicos(){

  }

  updateServicios_tServicos(){

  }

  insertServicios_tServicos() {
  
  }
}
