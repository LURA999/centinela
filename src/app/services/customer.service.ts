import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http : HttpClient) { }

  local = environment.api; 

  clienteEstatus(opc : number){
    return this.http.get(this.local+"Customer/customer.php?opc="+opc);
  }
  clientesTodos(){
    return this.http.get(this.local+"Customer/customer.php");
  }
  insertaCliente(input :JSON){
    return this.http.post(this.local+"Customer/customer.php",{input}, {responseType: 'text'});
  }
}
