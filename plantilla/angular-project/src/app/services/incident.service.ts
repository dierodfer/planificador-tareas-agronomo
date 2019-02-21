import { Injectable } from '@angular/core';
import { Incidencia } from '../models/incidencia';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import {MessagingService} from './messaging.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private messagingService: MessagingService) { }

  getIncidents() {
    this.db.collection('incidencias', ref => ref.orderBy('fecha')).valueChanges();
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
      this.messagingService.sendMessage('Incidencia-' + incidencia.tipo,
      'Autor: ' + incidencia.autor + ', en la zona de ' + incidencia.zona, '329');
      this.snackBar.open('La incidencia se ha enviado correctamente', 'Cerrar', {
        duration: 4000,
      });
    });
  }
}
