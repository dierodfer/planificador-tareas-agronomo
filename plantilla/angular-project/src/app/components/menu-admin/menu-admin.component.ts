import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  lastEvent;

  constructor(private cookie: CookieService) { }

  click(event) {
    if (this.lastEvent) {
      this.lastEvent.target.classList.toggle('click');
    }
    event.target.classList.toggle('click');
    this.lastEvent = event;
  }

  isAdmin() {
    return this.cookie.get('rol') === 'ADMIN';
  }

  ngOnInit() {
  }

}
