import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;

  constructor(
    private titleService: Title,
 ) {
  }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Dashboard');
    
  }
}
