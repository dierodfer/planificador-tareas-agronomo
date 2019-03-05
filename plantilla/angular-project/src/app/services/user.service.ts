import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {MatSnackBar} from '@angular/material';
import { NotificationService } from './notification.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar,
    private notificacionService: NotificationService,
    private cookie: CookieService) { }

  getUserById(id) {
    return this.db.collection('usuarios').doc(id).valueChanges();
  }

  getUsuarios() {
     return this.db.collection('usuarios').valueChanges();
  }

  getCoordinators() {
    return this.db.collection('usuarios' ,
    ref => ref.where('rol', '==' , 'COORDINADOR')
    ).valueChanges();
  }

  getWorkers() {
    return this.db.collection('usuarios' ,
    ref => ref.where('rol', '==' , 'TRABAJADOR')
    ).valueChanges();
  }

  getMyUser() {
    return this.db.collection('usuarios').doc(this.cookie.get('sesionId')).valueChanges();
  }

  addUsuario(usuario: Usuario) {
    this.db.collection('usuarios').doc(usuario.empleado).set({
      empleado: usuario.empleado,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      genero: usuario.genero
    }).then(() => {
        this.snackBar.open('El usuario se ha guardado correctamente', 'Cerrar', {
          duration: 4000,
        });
        this.notificacionService.createBuzon(usuario.empleado);
    });
  }

  // Cambiar por bloquear
  deleteUsuario(id: string) {
    this.db.collection('usuarios').doc(id).delete().then(() => {
      this.snackBar.open('El usuario ¡se ha borrado correctamente!', 'Cerrar', {
        duration: 4000,
      });
    });
  }
}
