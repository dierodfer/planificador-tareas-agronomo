import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { Tarea } from '../models/tarea';
import { NotificationService } from './notification.service';
import { Notificacion } from '../models/notificacion';
import { MessagingService } from './messaging.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar,
    private notificacionService: NotificationService,
    private messaging: MessagingService) { }

  getTasks() {
    return this.db.collection('tareas').valueChanges();
  }

  getTaskByUser(userId: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('fecha').where('responsable', '==', userId).where('grupal', '==', false)
    ).valueChanges();
  }

  getTaskByGroup(groupId: string) {
    return this.db.collection('tareas' , ref =>
    ref.where('responsable', '==' , groupId).where('grupal', '==', true)
    ).valueChanges();
  }

  getTaskByUserAndDate(userId: string, date: Date ) {
    return this.db.collection('tareas' , ref =>
    ref.where('responsable', '==', userId).where('grupal', '==', false).where('fecha', '==', date)
    ).valueChanges();
  }

  addTask(tarea: Tarea) {
    tarea.id = Math.random().toString().substring(2); // ARREGLAR
    const json =  JSON.parse(JSON.stringify(tarea));
    this.db.collection('tareas').doc(tarea.id).set(json).then(() => {
    // Comprueba que no es tarea grupal y la fecha de la tarea es hoy (eliminando el tiempo) 
    // y envia notificacion interna y push a los usuarios afectado
    if (!tarea.grupal && moment(tarea.fecha).startOf('day').diff(moment().startOf('day')) === 0) {
      const body = 'Se le ha asignado nueva tarea para realizar hoy: ' + tarea.tipo + (tarea.subtipo ? tarea.subtipo : '');
      this.notificacionService.sendNotification(tarea.responsable, new Notificacion(body, 'Nueva Tarea'));
      this.messaging.sendMessage('Nueva Tarea', body, tarea.responsable);
    }
    this.snackBar.open('La tarea se ha guardado correctamente', 'Cerrar', {
      duration: 4000,
      });
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
