import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;

  constructor(
    private titleService: Title,
    private logger: NGXLogger) {
  }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Dashboard');
    this.logger.log('Dashboard loaded');
  }
}
