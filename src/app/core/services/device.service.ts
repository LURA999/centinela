import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceModel } from 'src/app/models/device.model';
import { responseService } from 'src/app/models/responseService.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http : HttpClient) { }

  local = environment.api;

  todosRadios(identificador : string,contador: number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/radio.php?identificador="+identificador+"&contador="+contador);
  }

  actualizarRadio(input : DeviceModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<responseService>(this.local+"Devices/radio.php",input,{headers});
  }

  eliminarRadio(input: number) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')    
    return this.http.delete<responseService>(this.local+"Devices/radio.php?id="+input,{headers});
  }

  insertarRadio(input : DeviceModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.post<responseService>(this.local+"Devices/radio.php",input,{headers});
  }

  idMaxRadio(): Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/radio.php");
  }
/////////////////////////////////////
  todosRouter(identificador : string,contador: number, condicion : number, id?:number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/router.php?identificador="+identificador+" &contador="+contador+"&condicion="+condicion+"&iddevice="+id);
  }
  actualizarRouter(input : DeviceModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<responseService>(this.local+"Devices/router.php",input,{headers});
  }

  eliminarRouter(input: number) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')    
    return this.http.delete<responseService>(this.local+"Devices/router.php?id="+input,{headers});
  }

  insertarRouter(input : DeviceModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')    
    return this.http.post<responseService>(this.local+"Devices/router.php",input,{headers});
  }
  
  idMaxRotuer(): Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/router.php");
  }
////////////////////////////////////////////
  todosOtros(identificador : string,contador: number, condicion : number, id?:number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/others.php?identificador="+identificador+" &contador="+contador+"&condicion="+condicion+"&iddevice="+id);
  }

  actualizarotros(input : DeviceModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')
    return this.http.patch<responseService>(this.local+"Devices/others.php",input,{headers});
  }

  eliminarOtros(input: number) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')    
    return this.http.delete<responseService>(this.local+"Devices/others.php?id="+input,{headers});
  }

  insertarOtros(input : DeviceModel) : Observable<responseService>{
    let headers = new HttpHeaders().set('Content-type','Application/json')    
    return this.http.post<responseService>(this.local+"Devices/others.php",input,{headers});
  }

  idMaxOther(): Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/others.php");
  }
}
