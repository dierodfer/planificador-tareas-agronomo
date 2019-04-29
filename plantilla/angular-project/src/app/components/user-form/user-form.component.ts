import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  controlNombre = new FormControl('', [Validators.required]);
  controlApellidos = new FormControl('', [Validators.required]);
  controlRol = new FormControl('', [Validators.required]);
  controlEmpleado = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);
  controlGenero = new FormControl('', [Validators.required]);
  controlTelefono = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);

  editar: Boolean = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location) {
    }

  addUsuario() {
    if (this.checkStatus()) {
      this.userService.addUsuario(this.getUsuario());
      this.resetValidators();
    } else {
      this.snackBar.open('Debe rellenar todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
        panelClass: 'bg-danger',
      });
    }
  }

  updateUsuario() {
    if (this.checkStatus()) {
      this.userService.addUsuario(this.getUsuario());
      this.router.navigate(['inicio/admin/usuarios/lista']);
    } else {
      this.snackBar.open('Debe rellenar todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
        panelClass: 'bg-danger',
      });
    }
  }

  getUsuario() {
    const usuario = new Usuario();
    usuario.nombre = this.controlNombre.value.trim();
    usuario.apellidos = this.controlApellidos.value.trim();
    usuario.rol = this.controlRol.value;
    usuario.empleado = this.controlEmpleado.value.toString();
    usuario.genero = this.controlGenero.value;
    usuario.telefono = this.controlTelefono.value;
    return usuario;
  }

  checkStatus(): boolean {
    return this.controlNombre.status === 'VALID'
    && this.controlApellidos.status === 'VALID'
    && this.controlRol.status === 'VALID'
    && this.controlEmpleado.status === 'VALID'
    && this.controlGenero.status === 'VALID'
    && this.controlTelefono.status === 'VALID';
  }

  resetValidators() {
    this.controlNombre.reset('');
    this.controlApellidos.reset('');
    this.controlRol.reset('');
    this.controlEmpleado.reset('');
    this.controlGenero.reset('');
    this.controlTelefono.reset('');
  }

  getRouteParams() {
    // Recupera el id pasado por url
    if (this.route.snapshot.paramMap.get('id').length > 0) {
      this.userService.getUserById(this.route.snapshot.paramMap.get('id')).forEach((usuario: Usuario) => {
        this.editar = true;
        this.controlApellidos.setValue(usuario.apellidos);
        this.controlEmpleado.setValue(usuario.empleado);
        this.controlGenero.setValue(usuario.genero);
        this.controlNombre.setValue(usuario.nombre);
        this.controlRol.setValue(usuario.rol);
        this.controlTelefono.setValue(usuario.telefono);
      });
    }
  }

  goBack() {
    this._location.back();
  }

  ngOnInit() {
    this.controlGenero.setValue('MUJER');
    this.getRouteParams();
  }

}
