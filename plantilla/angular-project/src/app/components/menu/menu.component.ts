import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  rol;

  constructor(
    private router: Router,
    private cookie: CookieService) { }

  cerrarSesion() {
    this.cookie.set('sesionId', 'null');
    this.cookie.set('rol', 'null');
/*     this.cookie.deleteAll(); */
    this.router.navigate(['/login']);
  }

  isCoordinador() {
    return (this.rol === 'COORDINADOR') || (this.rol === 'ADMIN');
  }

  isAdmin() {
    return (this.rol === 'ADMIN');
  }

  ngOnInit() {
    if (!this.cookie.check('sesionId') || !this.cookie.check('rol')) {
      this.router.navigate(['login']);
    } else {
      if (this.cookie.get('sesionId') === 'null' || this.cookie.get('rol') === null) {
        this.router.navigate(['login']);
      } else {
        this.rol = this.cookie.get('rol');
      }
    }
  }

}
