import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,
  DocumentReference, Settings, CollectionReference, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class UserService {


  constructor(private db: AngularFirestore,
/*     private coll: CollectionReference, */
    public snackBar: MatSnackBar) { }

  getUsuarios(orderBy?: string) {
     return this.db.collection('usuarios' ,
     ref => ref.orderBy(orderBy ? orderBy : 'nombre')
/*   .startAt(2)
     .limit(8) */
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
