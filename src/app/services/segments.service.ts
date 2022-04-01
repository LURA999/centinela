import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { segmentsModel } from '../pages/red/segments/models/segments.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SegmentsService {
  local = environment.api; 
  constructor(private http : HttpClient) { }

  llamarSegments(){
    
    return this.http.get(this.local+"Repeater/segment.php");
  }

  deleteSegments(){
    return this.http.get(this.local+"Repeater/segment.php");
  }

  insertarSegments(input :segmentsModel){
    console.log(input);
    return this.http.post(this.local+"Repeater/segment.php",input, {responseType:"text"});
  }
  
  actualizarSegment(input :segmentsModel){
    console.log(input);
    return this.http.patch(this.local+"Repeater/segment.php",input, {responseType:"text"});
  }

 updateElimSegment(id:String){    
    console.log(id);
    return this.http.patch(this.local+"Repeater/segment.php?id="+id,{responseType: 'text'});
   
  }

}
