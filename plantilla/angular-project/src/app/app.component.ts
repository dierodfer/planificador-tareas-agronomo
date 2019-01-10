import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from './models/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Plantilla Angular';
  version= "0.0.1"
  
  items: Observable<any[]>;
  usuario: Usuario = new Usuario();
  id: string;

  constructor(private db: AngularFirestore) { 
/*   this.items = db.collection('usuarios').valueChanges(); */
  }

  getUsuarios(){
    this.items = this.db.collection('usuarios').valueChanges(); 
  }

  addUsuario(){
    var data = {
      empleado: this.usuario.empleado,
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      rol: this.usuario.rol,
      usuario: this.usuario.usuario
    }
    console.log(data);
    this.db.collection('usuarios').doc(this.usuario.empleado.toString()).set(data);
  }

  setNombre(nombre:string){
    this.usuario.nombre = nombre;
  }

  setRol(rol:string){
    this.usuario.rol = rol;
  }

  setUsuario(usuario:string){
    this.usuario.usuario = usuario;
  }

  setApellidos(apellidos:string){
    this.usuario.apellidos = apellidos;
  }

  setEmpleado(empleado:string){
    this.usuario.empleado = parseInt(empleado); 
  }
}
