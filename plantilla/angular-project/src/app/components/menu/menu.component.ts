import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(
    private router: Router,
    private cookieService: CookieService) { }

  cerrarSesion() {
    this.cookieService.set('sesionId', 'null');
    this.router.navigate(['login']);
  }

  ngOnInit() {
    if (this.cookieService.check('sesionId')) {
      if (this.cookieService.get('sesionId') === 'null') {
        this.router.navigate(['login']);
      }
    } else {
      this.router.navigate(['login']);
    }
  }

}
