import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private db: AngularFirestore) { }

  getGroups() {
    return this.db.collection('grupos').valueChanges();
  }

  getGroupsByCoordinator(id: string) {
    return this.db.collection('grupos', ref => ref.where('coodinador', '==' , id)).valueChanges();
  }

}
