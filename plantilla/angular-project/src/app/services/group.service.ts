import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Grupo } from '../models/grupo';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private db: AngularFirestore) { }

  getGroupById(id: string) {
    return this.db.collection('grupos').doc(id).valueChanges();
  }

  getGroups() {
    return this.db.collection('grupos', ref => ref.orderBy('nombre')).valueChanges();
  }

  getGroupsByCoordinator(id: string) {
    return this.db.collection('grupos', ref => ref.orderBy('nombre').where('coordinador', '==' , id)).valueChanges();
  }

  deleteUserToGroup(idGroup, idUser) {
    this.db.collection('grupos').doc(idGroup).update({
      usuarios: firebase.firestore.FieldValue.arrayRemove(idUser)
    });
  }

  addUserToGroup(idGroup, idUser) {
    this.db.collection('grupos').doc(idGroup).update({
      usuarios: firebase.firestore.FieldValue.arrayUnion(idUser)
    });
  }

  deleteGroup(id) {
    this.db.collection('grupos').doc(id).delete();
  }

  updateNameGroup(idGroup, nombre) {
    this.db.collection('grupos').doc(idGroup).update({
      nombre: nombre
    });
  }

  addGroup(group: Grupo) {
    group.id = Math.random().toString().substring(2);
    const copia = JSON.parse(JSON.stringify(group));
    this.db.collection('grupos').doc(group.id).set(copia);
  }


}
