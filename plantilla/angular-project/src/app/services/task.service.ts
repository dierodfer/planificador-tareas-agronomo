import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { Tarea } from '../models/tarea';
import { NotificationService } from './notification.service';
import { Notificacion } from '../models/notificacion';
import { MessagingService } from './messaging.service';
import { GroupService } from './group.service';
import { UserService } from './user.service';
import { Usuario } from '../models/usuario';
import { Grupo } from '../models/grupo';

import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db: AngularFirestore,
    public snackBar: MatSnackBar,
    private notificacionService: NotificationService,
    private messaging: MessagingService,
    private grupoService: GroupService,
    private usuarioService: UserService,
    private messagingService: MessagingService) { }

  getTasks() {
    return this.db.collection('tareas').valueChanges();
  }

  getTaskById(id: string) {
    return this.db.collection('tareas').doc(id).valueChanges();
  }

  getFinishTask() {
    return this.db.collection('tareas' , ref =>
    ref.where('finalizada', '==', true)
    ).valueChanges();
  }

  getCancelTask() {
    return this.db.collection('tareas' , ref =>
    ref.where('cancelada', '==', true)
    ).valueChanges();
  }

  getPendingTask() {
    return this.db.collection('tareas' , ref =>
    ref.where('fechaComienzo', '<=', new Date().toJSON())
    .where('cancelada', '==', false).where('finalizada', '==', false)
    ).valueChanges();
  }

  getFinishTaskByDate(date) {
    return this.db.collection('tareas' , ref =>
    ref.where('finalizada', '==', true).where('fechaComienzo', '>=', date.toJSON())
    .where('fechaComienzo', '<=', moment().toJSON())
    ).valueChanges();
  }

  getCancelTaskByDate(date) {
    return this.db.collection('tareas' , ref =>
    ref.where('cancelada', '==', true).where('fechaComienzo', '>=', date.toJSON())
    .where('fechaComienzo', '<=', moment().toJSON())
    ).valueChanges();
  }

  getPendingTaskByDate(date) {
    return this.db.collection('tareas' , ref =>
    ref.where('cancelada', '==', false).where('finalizada', '==', false)
    .where('fechaComienzo', '>=', date.toJSON()).where('fechaComienzo', '<=', moment().toJSON())
    ).valueChanges();
  }

  getFinishTaskByUser(userId: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('fechaFinalizacion', 'desc').where('responsable', '==', userId)
    .where('grupal', '==', false).where('finalizada', '==', true)
    ).valueChanges();
  }

  getFinishTaskByGroup(groupId: string) {
    return this.db.collection('tareas' , ref =>
    ref.where('grupo', '==', groupId)
    .where('grupal', '==', true).where('finalizada', '==', true)
    ).valueChanges();
  }

  getCancelTaskByUser(userId: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('fechaFinalizacion', 'desc').where('responsable', '==', userId)
    .where('grupal', '==', false).where('cancelada', '==', true)
    ).valueChanges();
  }

  getCancelTaskByGroup(groupId: string) {
    return this.db.collection('tareas' , ref =>
    ref.where('grupo', '==', groupId)
    .where('grupal', '==', true).where('cancelada', '==', true)
    ).valueChanges();
  }

  getPendingTaskByUser(userId: string) {
    return this.db.collection('tareas' , ref =>
    ref.orderBy('fechaComienzo').where('responsable', '==', userId)
    .where('grupal', '==', false).where('fechaComienzo', '<=', new Date().toJSON())
    .where('cancelada', '==', false).where('finalizada', '==', false)
    ).valueChanges();
  }

  getPendingTaskByGroup(groupId: string) {
    return this.db.collection('tareas' , ref =>
    ref.where('grupo', '==', groupId).where('grupal', '==', true)
    .where('cancelada', '==', false).where('finalizada', '==', false)
    ).valueChanges();
  }

  getTaskByUserAndDate(userId: string, date: Date ) {
    return this.db.collection('tareas' , ref =>
    ref.where('responsable', '==', userId).where('grupal', '==', false)
    .where('fechaComienzo', '==', date.toJSON())
    ).valueChanges();
  }

  updateDateEstimated(tareaId, fecha) {
    this.db.collection('tareas').doc(tareaId).update({
      fechaEstimacion: fecha.toJSON()
    });
  }

  updateDateStart(tareaId, fecha) {
    this.db.collection('tareas').doc(tareaId).update({
      fechaComienzo: fecha.toJSON()
    });
  }

  addComment(tarea: Tarea, comment) {
    console.log(tarea);
    this.db.collection('tareas').doc(tarea.id).update({
      comentarios:  firebase.firestore.FieldValue.arrayUnion({
          fecha: new Date().toJSON(),
          cuerpo: comment
        })
      }).then(() => {
        // Envia notificacion interna al coordinador del grupo responsable
        this.usuarioService.getUserById(tarea.responsable).forEach((usuario: Usuario) => {
          this.grupoService.getGroupById(tarea.grupo).forEach((grupo: Grupo) => {
            const titulo = 'Nuevo Comentario';
            const cuerpo = 'Responsable: ' + usuario.nombre + ', Grupo: ' + grupo.nombre + ', ' +
            tarea.tipo + ' ' + (tarea.subtipo1 ? tarea.subtipo1 : '')
            + ' ' + (tarea.subtipo2 ? tarea.subtipo2 : '') +
            + ' ' + (tarea.subtipo3 ? tarea.subtipo3 : '') +
            + ', Comentario: ' + comment;
            this.notificacionService.sendNotification(grupo.coordinador, new Notificacion(cuerpo, titulo));
          });
        });
      });
  }

  addTask(tarea: Tarea) {
    tarea.id = Math.random().toString().substring(2); // ARREGLAR
    const json =  JSON.parse(JSON.stringify(tarea));
    this.db.collection('tareas').doc(tarea.id).set(json).then(() => {
    // Comprueba que no es tarea grupal y la fecha de la tarea es hoy (eliminando el tiempo)
    // y envia notificacion interna y push a los usuarios afectado
    if (!tarea.grupal && moment(tarea.fechaComienzo).startOf('day').diff(moment().startOf('day')) === 0) {
      const body = 'Se le ha asignado nueva tarea para realizar hoy: '
      + tarea.tipo + ' ' + (tarea.subtipo1 ? tarea.subtipo1 : '')
      + ' ' + (tarea.subtipo2 ? tarea.subtipo2 : '')
      + ' ' + (tarea.subtipo3 ? tarea.subtipo3 : '');
      this.notificacionService.sendNotification(tarea.responsable, new Notificacion(body, 'Nueva Tarea'));
      this.messaging.sendMessage('Nueva Tarea', body, tarea.responsable);
    }
    this.snackBar.open('La tarea se ha guardado correctamente', 'Cerrar', {
      duration: 4000,
      });
    });
  }

  cancelTask(tarea: Tarea) {
    this.db.collection('tareas').doc(tarea.id).update({
        cancelada: true,
        fechaFinalizacion: new Date().toJSON()
    }).then(() => {
      // Envia notificación interna y push a coordinador
      this.usuarioService.getUserById(tarea.responsable).forEach((usuario: Usuario) => {
        this.grupoService.getGroupById(tarea.grupo).forEach((grupo: Grupo) => {
          const titulo = 'Tarea Interrumpida';
          const cuerpo = 'Responsable: ' + usuario.nombre + ', Grupo: ' + grupo.nombre + ', ' +
          tarea.tipo + ' ' + (tarea.subtipo1 ? tarea.subtipo1 : '')
          + ' ' + (tarea.subtipo2 ? tarea.subtipo2 : '') +
          + ' ' + (tarea.subtipo3 ? tarea.subtipo3 : '');
          this.notificacionService.sendNotification(grupo.coordinador, new Notificacion(cuerpo, titulo));
          this.messagingService.sendMessage(titulo, cuerpo, grupo.coordinador);
        });
      });
    });
  }

  uncancelTask(id: string) {
    this.db.collection('tareas').doc(id).update({
      cancelada: false,
      fechaFinalizacion: firebase.firestore.FieldValue.delete()
    }).then(() => {
      this.snackBar.open('La tarea se ha vuelto a activar', 'Cerrar', {
        duration: 4000,
      });
  });
  }

  finishTask(id: string) {
    this.db.collection('tareas').doc(id).update({
      finalizada: true,
      fechaFinalizacion: new Date().toJSON()
    }).then(() => {
      this.snackBar.open('La tarea se ha finalizado correctamente', 'Cerrar', {
        duration: 4000,
      });
    });
  }

  unfinishedTask(id: string) {
    this.db.collection('tareas').doc(id).update({
      finalizada: false,
      fechaFinalizacion: firebase.firestore.FieldValue.delete()
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

  getTaskDelayed() {
    return this.db.collection('tareas' , ref =>
    ref.where('fechaEstimacion', '<', moment().startOf('day').toJSON())
    .where('finalizada', '==', false).where('cancelada', '==', false)
    ).valueChanges();
  }
}
