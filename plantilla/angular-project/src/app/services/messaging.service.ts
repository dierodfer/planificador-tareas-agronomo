import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';

export class Token {
  token: string;
  constructor() {
  }
}



@Injectable()

export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  private keyServer = environment.keyServer;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private angularFireStore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
      this.angularFireMessaging.messaging.subscribe(
        (_messaging) => {
          _messaging.onMessage = _messaging.onMessage.bind(_messaging);
          _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        }
      );
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
   updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        this.angularFireStore.collection('fcmTokens').doc(userId).set({
          token : token
        });
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
   requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
/*         console.log('new message received. ', payload); */
        this.snackBar.open('¡Se ha recibido una nueva notificación!', 'Cerrar', {
          duration: 4000,
        });
         this.currentMessage.next(payload);
      });
  }

  sendMessage(titulo, cuerpo, userId) {
    this.angularFireStore.collection('fcmTokens').doc(userId).valueChanges().forEach(
      data => {
        const body = this.getBody(titulo, cuerpo, (data as Token).token);
        const headers = this.getHeaders();
        this.http.post('https://fcm.googleapis.com/fcm/send', body, {headers}).subscribe();
      }
    );
  }

  private getBody(titulo, cuerpo, token) {
    return {
      'notification': {
        'title': titulo,
        'body': cuerpo,
        'icon': 'https://angular-222712.firebaseapp.com/favicon.ico'
      },
      'to': token
    };
  }

  private getHeaders() {
    return new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'key=' + this.keyServer);
  }
}
