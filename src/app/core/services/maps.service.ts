import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  local = environment.api; 
  constructor(private http : HttpClient, private Maps:MapsService) { }

  updateManual(){
    return this.http.patch(this.local+"Services/maps.php",{responseType: 'text'});
  }



}
