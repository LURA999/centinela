import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
interface TimeZone {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  selectedValue: string | undefined;
  Zones: TimeZone[] = [

    {value: 'Alpha Time Zone', viewValue: 'Alpha Time Zone : UTC +1'},
    {value: 'Central Standard Time', viewValue: 'Central Standard Time :UTC -6'},
    {value: 'Central Standard Time', viewValue: 'Central Standard Time :UTC -6'},
    {value: 'Central Standard Time', viewValue: 'Central Standard Time :UTC -6'},
    {value: 'Central Standard Time', viewValue: 'Central Standard Time :UTC -6'},
    
  ];
  todayDate : Date = new Date();
  selectFormControl = new FormControl('', Validators.required);
  constructor() { }

  ngOnInit(): void {
  }

}
