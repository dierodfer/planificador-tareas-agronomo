import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {MatSnackBar} from '@angular/material';
import { NotificationService } from './notification.service';
import { CookieService } from 'ngx-cookie-service';
import { Notificacion } from '../models/notificacion';

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

  getAllUsers() {
    return this.db.collection('usuarios').valueChanges();
  }

  getNoBannedUsers() {
    return this.db.collection('usuarios',
    ref => ref.where('baneado', '==' , false)
    ).valueChanges();
  }

  getBannedUsers() {
    return this.db.collection('usuarios',
    ref => ref.where('baneado', '==' , true)
    ).valueChanges();
  }

  getCoordinators() {
    return this.db.collection('usuarios' ,
    ref => ref.where('rol', '==' , 'COORDINADOR')
    ).valueChanges();
  }

  getAdmin() {
    return this.db.collection('usuarios').doc('0').valueChanges();
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
      genero: usuario.genero,
      telefono: usuario.telefono,
      baneado: false
    }).then(() => {
        this.snackBar.open('El usuario se ha guardado', 'Cerrar', {
          duration: 4000,
        });
        this.notificacionService.createBuzon(usuario.empleado);
    });
  }

  updateUsuario(usuario: Usuario) {
    this.db.collection('usuarios').doc(usuario.empleado).update({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      genero: usuario.genero,
      telefono: usuario.telefono
    }).then(() => {
        this.snackBar.open('El usuario se ha actualizado', 'Cerrar', {
          duration: 4000,
        });
    });
  }

  blockUser(usuario: Usuario) {
    this.db.collection('usuarios').doc(usuario.empleado).update({
      baneado: true
    }).then(() => {
      const titulo = 'Usuario Bloqueado';
      const cuerpo = 'El usuario ' + usuario.nombre + ',' + usuario.apellidos + 'ha sido bloqueado del sistema.';
      // Envia notificación interna a todos los coordinadores
      this.getCoordinators().forEach(coordinadores => {
        coordinadores.forEach((coordinador: Usuario) => {
          this.notificacionService.sendNotification(coordinador.empleado, new Notificacion(cuerpo, titulo));
        });
      });
    });
  }

  unblockUser(empleado: string) {
    this.db.collection('usuarios').doc(empleado).update({
      baneado: false
    });
  }

  // NO SE USA
  deleteUsuario(id: string) {
    this.db.collection('usuarios').doc(id).delete().then(() => {
      this.snackBar.open('El usuario ¡se ha borrado correctamente!', 'Cerrar', {
        duration: 4000,
      });
    });
  }
}
