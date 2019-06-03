import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {environment} from '../../environments/environment';
import { MatSnackBarModule } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from './notification.service';

const usuarioTest = new Usuario();
usuarioTest.nombre = 'Test';
usuarioTest.apellidos = 'Test Test';
usuarioTest.rol = 'TRABAJADOR';
usuarioTest.genero = 'MUJER';
usuarioTest.baneado = false;
usuarioTest.empleado = '997419';
usuarioTest.telefono = '666666666';

describe('Servicio de Usuarios', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        UserService,
        NotificationService,
        AngularFirestore,
        CookieService]
    });
  });

  it('Crear instancia', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it ('Registrar un nuevo usuario', (() => {
    const service: UserService = TestBed.get(UserService);
    service.addUsuario(usuarioTest);
  }));

/*   it ('Buscar usuario', (() => {
    const service: UserService = TestBed.get(UserService);
    service.getUserById(usuarioTest.empleado).subscribe((user: Usuario) => {
      expect(user.empleado === usuarioTest.empleado).toBe(true);
    });
  })); */

  it ('Editar usuario', (() => {
    const service: UserService = TestBed.get(UserService);
    usuarioTest.nombre = 'Nombre modificado';
    usuarioTest.rol = 'ROL NO PERMITIDO';
    usuarioTest.genero = 'HOMBRE';
    usuarioTest.apellidos = 'Apellidos modificados';
    usuarioTest.baneado = true;
    usuarioTest.telefono = '000000000';
    service.updateUsuario(usuarioTest);
    service.getUserById(usuarioTest.empleado).subscribe((user: Usuario) => {
      expect(user.nombre).toBe('Nombre modificado');
      expect(user.rol).toBe('TRABAJADOR');
      expect(user.apellidos).toBe('Apellidos modificados');
      expect(user.baneado).toBe(false);
      expect(user.telefono).toBe('000000000');
      expect(user.genero).toBe('HOMBRE');
    });
  }));

  it ('Listar Trabajadores', (() => {
    const service: UserService = TestBed.get(UserService);
    service.getWorkers().subscribe((users) => {
        expect(users.length > 0).toBe(true);
        expect(users.filter((user: Usuario) => user.rol !== 'TRABAJADOR').length).toBe(0);
    });
  }));

  it ('Listar Coordinadores', (() => {
    const service: UserService = TestBed.get(UserService);
    service.getCoordinators().subscribe((users) => {
        expect(users.length > 0).toBe(true);
        expect(users.filter((user: Usuario) => user.rol !== 'TRABAJADOR').length).toBe(0);
    });
  }));

  it ('Listar Administradores', (() => {
    const service: UserService = TestBed.get(UserService);
    service.getAdmin().subscribe((user: Usuario) => {
        expect(user !== undefined).toBe(true);
        expect(user.rol === 'ADMIN').toBe(true);
    });
  }));

  it ('Bloquear usuario', (() => {
    const service: UserService = TestBed.get(UserService);
    service.blockUser(usuarioTest);
  }));

  it ('Listar bloqueados', (() => {
    const service: UserService = TestBed.get(UserService);
    service.getBannedUsers().subscribe((users: Usuario[]) => {
      console.log(users);
      expect(users.filter((user: Usuario) => user.baneado !== true).length).toBe(0);
    });
  }));

  it ('Desbloquear usuario', (() => {
    const service: UserService = TestBed.get(UserService);
    service.unblockUser(usuarioTest.empleado);
  }));

  it ('Listar no bloqueados', (() => {
    const service: UserService = TestBed.get(UserService);
    service.getNoBannedUsers().subscribe((users: Usuario[]) => {
      expect(users.filter((user: Usuario) => user.baneado !== false).length).toBe(0);
    });
  }));

  it ('Eliminar usuario', (() => {
    const service: UserService = TestBed.get(UserService);
    service.deleteUsuario(usuarioTest.empleado);
  }));

});
