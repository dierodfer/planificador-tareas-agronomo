import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar) { }

  getUserById(id) {
    return this.db.collection('usuarios').doc(id).valueChanges();
  }

  getUsuarios(orderBy?: string) {
     return this.db.collection('usuarios' ,
     ref => ref.orderBy(orderBy ? orderBy : 'nombre')
     ).valueChanges();
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
    });
  }

  deleteUsuario(id: string) {
    this.db.collection('usuarios').doc(id).delete().then(() => {
      this.snackBar.open('El usuario ¡se ha borrado correctamente!', 'Cerrar', {
        duration: 4000,
      });
    });
  }
}
