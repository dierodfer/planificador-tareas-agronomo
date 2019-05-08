import { Injectable } from '@angular/core';
import { Incidencia } from '../models/incidencia';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import {MessagingService} from './messaging.service';
import { NotificationService } from './notification.service';
import { Notificacion } from '../models/notificacion';
import { CookieService } from 'ngx-cookie-service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private messagingService: MessagingService,
    private noficacionService: NotificationService,
    private cookie: CookieService) { }

  getIncidents() {
    return this.db.collection('incidencias', ref => ref.orderBy('fechaCreacion', 'desc')).valueChanges();
  }

  getIncidentsByState(order: string, state: string) {
    return this.db.collection('incidencias', ref => ref.orderBy(order , 'desc').where('estado', '==', state)).valueChanges();
  }

  getIncidentsByStateAndDate(state: string, date) {
    return this.db.collection('incidencias', ref => ref.where('estado', '==', state)
    .where('fechaCreacion', '>=', date.toJSON())).valueChanges();
  }

  updateAtendida(id: string) {
    this.db.collection('incidencias').doc(id).update({
      estado: 'Atendida',
      responsable: this.cookie.get('sesionId'),
      fechaAtendida: new Date().toJSON()
    });
  }

  getIncidentsCritical() {
    return this.db.collection('incidencias',
    ref => ref.where('estado', '==', 'Pendiente')
    .where('fechaCreacion', '>=', moment().startOf('day').toJSON())
    .where('prioridad', '==', 'Alta')).valueChanges();
  }

  cancelAtendida(id: string) {
    this.db.collection('incidencias').doc(id).update({
      estado: 'Pendiente',
      responsable: firebase.firestore.FieldValue.delete(),
      fechaAtendida: firebase.firestore.FieldValue.delete()
    });
  }

  updateResuelta(id: string) {
    this.db.collection('incidencias').doc(id).update({
      estado: 'Resuelta',
      fechaResuelta: new Date().toJSON()
    });
  }

  addIncident(incidencia: Incidencia) {
    incidencia.id = Math.random().toString().substring(2);
    const copia = JSON.parse(JSON.stringify(incidencia));
    this.db.collection('incidencias').doc(incidencia.id).set(copia).then(() => {
      const titulo = 'Nueva Incidencia - ' + incidencia.tipo;
      let cuerpo = 'Autor: ' + incidencia.autor.nombre + ', ' + incidencia.autor.apellidos
      + (incidencia.ubicacion ? ', fuera de las instalaciones.' : '');
      if (incidencia.zona) {
        cuerpo = cuerpo + (incidencia.zona.invernadero ? ', en el invernadero ' + incidencia.zona.invernadero : '')
        + (incidencia.zona.sector ? ', en el sector: ' + incidencia.zona.sector : '')
        + (incidencia.zona.tabla ? ', en la tabla: ' + incidencia.zona.tabla : '')
        + (incidencia.zona.planta ? ', en la planta: ' + incidencia.zona.planta : '');
      }

      // Envia notiicacion Push e Interna
      this.messagingService.sendMessage(titulo, cuerpo, '0');
      this.noficacionService.sendNotification('0', new Notificacion(cuerpo, titulo));
      this.snackBar.open('La incidencia se ha enviado correctamente y el ADMIN a sido notificado', 'Cerrar', {
        duration: 10000,
      });
    });
  }
}
