import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario'

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private db:AngularFirestore){ }

  getUsuarios(){
    return this.db.collection('usuarios').valueChanges(); 
  }

  addUsuario(usuario:Usuario){
    var data = {
      empleado: usuario.empleado,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      usuario: usuario.usuario
    }
    this.db.collection('usuarios').doc(usuario.empleado.toString()).set(data);
  }

}