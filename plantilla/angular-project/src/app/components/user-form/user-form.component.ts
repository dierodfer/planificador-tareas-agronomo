import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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
      if (this.checkPhone()) {
        this.userService.getUserById(this.getUsuario().empleado).forEach((usuario: Usuario) => {
          if (usuario) {
            this.snackBar.open('Ya existe un usuario con ese número de empleado', 'Cerrar', {
              duration: 3000,
              panelClass: 'bg-danger',
            });
          } else {
            this.userService.addUsuario(this.getUsuario());
            this.resetValidators();
          }
        });
      }
    }
  }

  updateUsuario() {
    if (this.checkStatus()) {
      if (this.checkPhone()) {
        this.userService.updateUsuario(this.getUsuario());
        this.router.navigate(['inicio/admin/usuarios/lista']);
      }
    }
  }

  checkPhone() {
    if (this.controlTelefono.value && this.controlTelefono.value.length === 9){
      return true;
    } else {
      this.snackBar.open('Teléfono inválido', 'Cerrar', {
        duration: 3000,
        panelClass: 'bg-danger',
      });
      return false;
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
    if (this.controlNombre.status === 'VALID'
    && this.controlApellidos.status === 'VALID'
    && this.controlRol.status === 'VALID'
    && this.controlEmpleado.status === 'VALID'
    && this.controlGenero.status === 'VALID'
    && this.controlTelefono.status === 'VALID') {
      return true;
    } else {
      this.snackBar.open('Debe rellenar todos los campos obligatorios', 'Cerrar', {
        duration: 3000,
        panelClass: 'bg-danger',
      });
      return false;
    }
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
