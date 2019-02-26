import { Injectable } from '@angular/core';
import { Incidencia } from '../models/incidencia';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import {MessagingService} from './messaging.service';
import { NotificationService } from './notification.service';
import { Notificacion } from '../models/notificacion';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private messagingService: MessagingService,
    private noficacionService: NotificationService) { }

  getIncidents() {
    return this.db.collection('incidencias', ref => ref.orderBy('fecha')).valueChanges();
  }

  addIncident(incidencia: Incidencia) {
    incidencia.id = Math.random().toString().substring(2); // ARREGLAR
    this.db.collection('incidencias').doc(incidencia.id).set({
      id: incidencia.id,
      descripcion: incidencia.descripcion ? incidencia.descripcion : '',
      tipo: incidencia.tipo,
      autor: incidencia.autor,
      fecha: incidencia.fecha,
      zona: [incidencia.zona.invernadero, incidencia.zona.sector, incidencia.zona.tabla, incidencia.zona.numero_planta]
    }).then(() => {
      const titulo = 'Nueva Incidencia - ' + incidencia.tipo;
      const cuerpo = 'Autor: ' + incidencia.autor + ', en el invernadero ' + incidencia.zona.invernadero
      + (incidencia.zona.sector ? ', en el sector: ' + incidencia.zona.sector : '')
      + (incidencia.zona.tabla ? ', en la tabla: ' + incidencia.zona.tabla : '')
      + (incidencia.zona.numero_planta ? ', en el número: ' + incidencia.zona.numero_planta : '');

      this.messagingService.sendMessage(titulo, cuerpo, '326'); // OPTIMIZAR
      this.noficacionService.sendNotification('0', new Notificacion(cuerpo, titulo));
      this.snackBar.open('La incidencia se ha enviado correctamente y el ADMIN a sido notificado', 'Cerrar', {
        duration: 10000,
        panelClass: 'bg-warning'
      });
    });
  }
}
