import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  todosRouter(identificador : string,contador: number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/router.php?identificador="+identificador+"&contador="+contador);
  }

  todosOtros(identificador : string,contador: number) : Observable<responseService>{
    return this.http.get<responseService>(this.local+"Devices/others.php?identificador="+identificador+"&contador="+contador);
  }
}
