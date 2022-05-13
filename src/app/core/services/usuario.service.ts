import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  local = environment.api;

  constructor(private http:HttpClient) { }

  login(contrasena:String, usuario:String, tipo : number)  {
    console.log(this.local+'/Users/userLogin.php?usuario='+usuario+'&contrasena='+contrasena+'&tipo='+tipo);
    
    return this.http.get(this.local+'/Users/userLogin.php?usuario='+usuario+'&contrasena='+contrasena+'&tipo='+tipo);
  }
}
