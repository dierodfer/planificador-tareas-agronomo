import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './services/connection.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private connect: ConnectionService) { }

  ngOnInit() {
    this.connect.init();
  }
}
