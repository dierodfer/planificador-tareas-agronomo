import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Fase } from '../models/fase';

@Injectable({
  providedIn: 'root'
})
export class CycleService {

  constructor(private db: AngularFirestore) { }

  getFases() {
    return this.db.collection('fases', ref => ref.orderBy('nombre')).valueChanges();
  }

  updateNombre(fase, nombre: string) {
    this.db.collection('fases').doc(fase.id).update({
      nombre: nombre
    });
  }

  addFase(fase: Fase) {
    const copia = JSON.parse(JSON.stringify(fase));
    this.db.collection('fases').doc(fase.id).set(copia);
  }

  deleteFase(fase: Fase) {
    this.db.collection('fases').doc(fase.id).delete();
  }
}
