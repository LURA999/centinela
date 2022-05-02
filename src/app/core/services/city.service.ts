import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarCiudades(){
    return this.http.get(this.local+"city.php");
  }
  llamarSoloUno(cve : number):Observable<responseService>{
    return this.http.get<responseService>(this.local+"city.php?cve="+cve);
  }

}
