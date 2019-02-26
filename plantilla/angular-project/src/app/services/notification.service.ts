import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { Buzon } from '../models/buzon';
import { Notificacion } from '../models/notificacion';
import { CookieService } from 'ngx-cookie-service';
import { FieldPath } from '@angular/fire/firestore';
import { firestore } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  noti: Notificacion = new Notificacion('descripcion prueba', 'titulo prueba');

  constructor(
    private db: AngularFirestore,
    public snackBar: MatSnackBar,
    private cookie: CookieService) { }

  getMyBuzon() {
    return this.db.collection('buzones').doc(this.cookie.get('sesionId')).valueChanges();
  }

  toggleBuzon() {
    this.db.collection('buzones').doc(this.cookie.get('sesionId')).update({
      visto: true
    });
  }

  sendNotification(id, noti: Notificacion) {
    this.db.collection('buzones').doc(id).update({
      visto: false,
      notificaciones: firestore.FieldValue.arrayUnion({
        titulo: noti.titulo,
        descripcion: noti.descripcion ? noti.descripcion : '',
        leido: false,
        fecha: new Date()
      })
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
