import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';


@Injectable()

export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  keyServer = 'AAAAVOGzy1s:APA91bGHqjZTkPUB3Vep7CW28oPzF34KgXwgARPPyf3ffzmf9WPDJw2HgZAh4dO9OHHgJOwFCNVpUU' 
  + '_nYV6LZz46E14NvkHjB3j4nUSIG4pPU0_AN1qNv9qCNvHt11UI22ZlzDoPcpJx';
  token;

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
        this.token = token;
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
        this.snackBar.open('Se ha recibido una nueva notificación!', 'Cerrar', {
          duration: 4000,
        });
        this.currentMessage.next(payload);
      });
  }

   sendMessage(titulo, cuerpo, id) {
    const body = {
      'notification': {
        'title': titulo,
        'body': cuerpo,
        'icon': 'https://angular-222712.firebaseapp.com/favicon.ico'
      },
      'to': id ? id : this.token
    };

/*     console.log(JSON.stringify(body)); */
    /* this.angularFireStore.collection('fcmTokens').doc(userId).ref;*/
     const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Authorization', 'key=' + this.keyServer);
    this.http.post('https://fcm.googleapis.com/fcm/send', body, {headers}).subscribe();
  }
}
