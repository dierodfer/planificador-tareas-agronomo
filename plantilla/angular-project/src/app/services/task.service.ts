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

  getTasks() {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('orden')
    ).valueChanges();
  }

  getTaskByUser(userId: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('orden').where('usuario', '==', userId)
    ).valueChanges();
  }

  updateTarea(tarea: Tarea) {

  }

  addTarea(user: Usuario) {
  const ref = this.db.collection('tareas');
/*   firestore.FieldValue.arrayUnion(); */
  }
}
