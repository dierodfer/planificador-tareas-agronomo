import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { Tarea } from '../models/tarea';
import { NotificationService } from './notification.service';
import { Notificacion } from '../models/notificacion';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar,
    private notificacionService: NotificationService) { }

  getTasks() {
    return this.db.collection('tareas').valueChanges();
  }

  getTaskByUser(userId: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('fecha').where('usuario', '==', userId)
    ).valueChanges();
  }

  getTaskByUserAndDate(userId: string, date: Date ) {
    return this.db.collection('tareas' , ref =>
    ref.where('usuario', '==', userId).where('fecha', '==', date)
    ).valueChanges();
  }

  /* updateTarea(tarea: Tarea) {
    this.db.collection('tareas').doc(tarea.id).set({
      id: tarea.id,
      nombre: tarea.nombre,
      descripcion: tarea.descripcion ? tarea.descripcion : '',
      tipo: tarea.tipo,
      subtipo: tarea.subtipo ? tarea.subtipo : '',
      usuario: tarea.usuario,
      fecha: tarea.fecha,
      cancelada: false
    }).then(() => {
    this.snackBar.open('La tarea se ha guardado correctamente', 'Cerrar', {
      duration: 4000,
      });
    });
  } */

  addTask(tarea: Tarea) {
    tarea.id = Math.random().toString().substring(2); // ARREGLAR
    this.db.collection('tareas').doc(tarea.id).set({
      id: tarea.id,
      descripcion: tarea.descripcion ? tarea.descripcion : '',
      tipo: tarea.tipo,
      subtipo: tarea.subtipo ? tarea.subtipo : '',
      usuario: tarea.usuario,
      fecha: tarea.fecha,
      cancelada: false
    }).then(() => {
    this.snackBar.open('La tarea se ha guardado correctamente', 'Cerrar', {
      duration: 4000,
      });
      // Comprueba que la fecha de la tarea es hoy (solo fechas) y envia notificacion a los usuarios afectados
      if (moment(tarea.fecha).startOf('day').diff(moment().startOf('day')) === 0) {
       this.notificacionService.sendNotification(tarea.usuario,
        new Notificacion(
        'Se le ha asignado nueva tarea para HOY: ' + tarea.tipo + tarea.subtipo ? tarea.subtipo : '',
        'Nueva Tarea'));
      }
    });
  }

  cancelTask(id: string) {
    this.db.collection('tareas').doc(id).update({
        cancelada: true
    }).then(() => {
        this.snackBar.open('La tarea se ha cancelado correctamente', 'Cerrar', {
          duration: 4000,
        });
    });
  }

  uncancelTask(id: string) {
    this.db.collection('tareas').doc(id).update({
      cancelada: false
    }).then(() => {
      this.snackBar.open('La tarea se ha vuelto a activar', 'Cerrar', {
        duration: 4000,
      });
  });
  }

  finishTask(id: string) {
    this.db.collection('tareas').doc(id).update({
      finalizada: true
    }).then(() => {
      this.snackBar.open('La tarea se ha marcado como finalizada', 'Cerrar', {
        duration: 4000,
      });
    });
  }

  unfinishedTask(id: string) {
    this.db.collection('tareas').doc(id).update({
      finalizada: false
    }).then(() => {
      this.snackBar.open('La tarea se ha marcado como NO finalizada', 'Cerrar', {
        duration: 4000,
      });
    });
  }

  deleteTask(id: string) {
    this.db.collection('tareas').doc(id).delete().then(() => {
      this.snackBar.open('La tarea se ha borrado correctamente', 'Cerrar', {
        duration: 4000,
      });
    });
  }
}
