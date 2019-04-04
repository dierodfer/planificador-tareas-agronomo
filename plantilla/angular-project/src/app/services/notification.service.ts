import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Buzon } from '../models/buzon';
import { Notificacion } from '../models/notificacion';
import { CookieService } from 'ngx-cookie-service';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  noti: Notificacion = new Notificacion('descripcion prueba', 'titulo prueba');

  constructor(
    private db: AngularFirestore,
    private cookie: CookieService) { }

  getMyBuzon() {
    return this.db.collection('buzones').doc(this.cookie.get('sesionId')).valueChanges();
  }

  toggleMyNotifications() {
    this.getMyBuzon().pipe(first()).forEach((buzon: Buzon) => {
      buzon.notificaciones.forEach((notification: Notificacion) => {
        if (!notification.leido) {
          this.deleteNotification(notification);
          notification.leido = true;
          this.sendNotification(this.cookie.get('sesionId'), notification);
        }
      });
    }).then(() => {
      this.toggleBuzon();
    });
  }

  toggleBuzon() {
    this.db.collection('buzones').doc(this.cookie.get('sesionId')).update({
      visto: true
    });
  }

  sendNotification(idBuzon, noti: Notificacion) {
    this.db.collection('buzones').doc(idBuzon).update({
      visto: false,
      notificaciones: firebase.firestore.FieldValue.arrayUnion({
        titulo: noti.titulo,
        descripcion: noti.descripcion ? noti.descripcion : '',
        leido: noti.leido,
        fecha: noti.fecha
      })
    });
  }

  deleteNotification(noti: Notificacion) {
    this.db.collection('buzones').doc(this.cookie.get('sesionId')).update({
      visto: true,
      notificaciones: firebase.firestore.FieldValue.arrayRemove(noti)
    });
  }

  createBuzon(id) {
    this.db.collection('buzones').doc(id).set({
      visto: true,
      id: id,
      notificaciones: []
    });
  }
}
