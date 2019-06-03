import { TestBed, async, inject } from '@angular/core/testing';
import { MessagingService } from './messaging.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { HttpClientModule } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import {environment} from '../../environments/environment';

const input: Usuario[][] = [[
  { nombre: 'Prueba1', apellidos: 'Prueba1 Prueba1', genero: 'HOMBRE',
   baneado: false,  rol: 'ADMIN', empleado: '52171', telefono: '612712132'},
  { nombre: 'Prueba2', apellidos: 'Prueba2 Prueba2', genero: 'MUJER',
  baneado: false, rol: 'TRABAJADOR', empleado: '14772', telefono: '612174122'},
  { nombre: 'Prueba3', apellidos: 'Prueba3 Prueba3', genero: 'MUJER',
  baneado: false, rol: 'COORDINADOR', empleado: '52741', telefono: '611548521'}
]];

/* const data = Observable.from(input);

const collectionStub = {
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data)
}

const angularFirestoreStub = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
} */



describe('Servicio de notificaciones push', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule
      ],
      providers: [
        MessagingService,
        AngularFirestore,
        AngularFireAuth,
        AngularFireMessaging]
    });
  });

  it('Crear instancia', () => {
    const service: MessagingService = TestBed.get(MessagingService);
    expect(service).toBeTruthy();
  });

/*   it ('Recibir y registrar token del dispositivo en Firebase', async(() => {
    const service: MessagingService = TestBed.get(MessagingService);
    service.requestPermission('test');
  }));

  it ('Envío de notificación push', async(() => {
    const service: MessagingService = TestBed.get(MessagingService);
    service.sendMessage('Test', 'Esto es un test', 'test');
  }));
 */
/*   it ('Recibir Notificación push', async(() => {
    const service: MessagingService = TestBed.get(MessagingService);
    service.receiveMessage();
  })); */
});
