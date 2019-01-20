import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import { Tarea } from '../models/tarea';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar) { }

  getTareas(orderBy?: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy(orderBy ? orderBy : 'orden')
    ).valueChanges();
 }

/*  addTarea(usuario: Tarea) {
  this.db.collection('tareas').doc(usuario.empleado).set({
    empleado: usuario.empleado,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    rol: usuario.rol,
    usuario: usuario.usuario
  }).then(() => {
      this.snackBar.open('El usuario se ha guardado correctamente', 'Cerrar', {
        duration: 4000,
      });
  }); */
}
