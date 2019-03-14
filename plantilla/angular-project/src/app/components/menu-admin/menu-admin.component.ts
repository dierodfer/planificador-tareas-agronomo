import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  lastEvent;

  constructor() { }

  click(event) {
    if (this.lastEvent) {
      this.lastEvent.target.classList.toggle('click');
    }
    event.target.classList.toggle('click');
    this.lastEvent = event;
  }

  ngOnInit() {
  }

}
