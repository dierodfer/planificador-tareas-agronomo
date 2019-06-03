import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import {environment} from '../../environments/environment';
import { MatSnackBarModule } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from './notification.service';
import { Notificacion } from '../models/notificacion';
import { Buzon } from '../models/buzon';

const usuarioTest = new Usuario();
usuarioTest.nombre = 'Test';
usuarioTest.apellidos = 'Test Test';
usuarioTest.rol = 'TRABAJADOR';
usuarioTest.genero = 'MUJER';
usuarioTest.baneado = false;
usuarioTest.empleado = '997419';
usuarioTest.telefono = '666666666';

const buzonId = 'testid';

describe('Servicio de Notificaciones internas', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule
      ],
      providers: [
        NotificationService,
        AngularFirestore,
        CookieService]
    });
  });

  it('Crear instancia', () => {
    const serviceNotificacion: NotificationService = TestBed.get(NotificationService);
    expect(serviceNotificacion).toBeTruthy();
  });

  it('Crear nuevo buzón', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    service.createBuzon(buzonId);
    service.getBuzonById(buzonId).subscribe((buzon) =>
      expect(buzon !== undefined).toBe(true)
    );
  });

  it('Enviar notificacion interna', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    // Comprobamos que buzon está vacio y enviamos
    service.getBuzonById(buzonId).forEach((buzon: Buzon) => {
      expect(buzon.notificaciones.length).toBe(0);
      service.sendNotification('testid', new Notificacion('DESCRIPCION TEST', 'TITLE TEST'));
    });
    // Comprobamos que ya no está vacio
    service.getBuzonById(buzonId).subscribe((buzon: Buzon) =>
      expect(buzon.notificaciones.length).toBe(1)
    );
  });

  it('Eliminar buzón', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    service.deleteBuzon('test');
    service.getBuzonById(buzonId).subscribe((buzon: Buzon) =>
      expect(buzon === undefined).toBe(true)
    );
  });

});
