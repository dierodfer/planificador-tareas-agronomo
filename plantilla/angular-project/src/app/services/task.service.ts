import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import { Tarea } from '../models/tarea';
/* import { firestore } from 'firebase'; */
import { Usuario } from '../models/usuario';


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

  updateTarea(tarea: Tarea) {

  }

  addTarea(user: Usuario) {
  const ref = this.db.collection('tareas');
/*   firestore.FieldValue.arrayUnion(); */
  }
}
