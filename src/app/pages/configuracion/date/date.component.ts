import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { DateService } from 'src/app/core/services/date.service';
import { DateModel } from 'src/app/models/date.model';
import { responseService } from 'src/app/models/responseService.model';
interface TimeZone {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  
  dateModel = new DateModel
fecha:string =""
hora:string=""
zona_horaria=""
llamarDatos :  Observable<responseService> | undefined
  selectedValue: string | undefined;
  Zones: TimeZone[] = [

    {value: 1, viewValue: 'Alpha Time Zone : UTC +1'},
    {value: 2, viewValue: 'Central Standard Time :UTC -6'},
    {value: 3, viewValue: 'Central Standard Time :UTC -6'},
    {value: 4, viewValue: 'Central Standard Time :UTC -6'},
    {value: 5, viewValue: 'Central Standard Time :UTC -6'},
    
  ];
  todayDate : Date = new Date();
  selectFormControl = new FormControl('', Validators.required);
  constructor(private dateservice :DateService) { }

  ngOnInit(): void {
   this.llamarDatos =  this.dateservice.llamarDate()
   
   /*.toPromise().then( (result : any) =>{
      this.hora=result.container[0]["hora"]
      this.fecha=result.container[0]["fecha"]
      this.zona_horaria=result.container[0]["zona_horaria"]
      
console.log(result.container);


  });*/
}
  async editarDate (hora:string,fecha:string,zona_horaria:number){    
    this.dateModel.hora=hora
    var fechas =fecha.split("/",3)
    this.dateModel.fecha=fechas[2]+"-"+fechas[0]+"-"+fechas[1]
    console.log(this.dateModel);
    this.dateModel.zona_horaria=zona_horaria

    lastValueFrom(this.dateservice.updateDate(this.dateModel));  
            
  }


}
