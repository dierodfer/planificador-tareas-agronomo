import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection , CollectionReference, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class UserService {


  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar) { }

  getUsuarios(orderBy: string) {
     return this.db.collection('usuarios' , ref =>
     ref.orderBy('nombre')
/*   .startAt(2)
     .limit(8) */
     ).valueChanges();
  }

  addUsuario(usuario: Usuario) {
    this.db.collection('usuarios').doc(usuario.empleado.toString()).set({
      empleado: usuario.empleado,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      usuario: usuario.usuario
    }).then(() => {
        this.snackBar.open('El usuario se ha guardado correctamente', 'Cerrar', {
          duration: 4000,
        });
    });
  }

  deleteUser(usuario: string) {
    this.db.collection('usuarios').doc(usuario).delete().then(function() {
      alert('¡Se ha borrado correctamente!');
    });
  }
}
