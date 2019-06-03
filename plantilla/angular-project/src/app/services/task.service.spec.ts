import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import {environment} from '../../environments/environment';
import { MatSnackBarModule } from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from './notification.service';
import { TaskService } from './task.service';
import { MessagingService } from './messaging.service';
import { GroupService } from './group.service';
import { Tarea } from '../models/tarea';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import * as moment from 'moment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const tareaTest = new Tarea();
tareaTest.descripcion = 'Test';
tareaTest.fechaComienzo = new Date('2020-04-28T22:00:00.000Z');
tareaTest.fechaEstimacion = new Date('2020-05-06T22:00:00.000Z');
tareaTest.finalizada = false;
tareaTest.cancelada = false;
tareaTest.grupal = false;
tareaTest.grupo = '987654323456789765';
tareaTest.id = '112436432313213';
tareaTest.responsable = '11111';
tareaTest.subtipo1 = 'Test';
tareaTest.subtipo2 = 'Test';
tareaTest.tipo = 'Test';

describe('Servicio de Tareas', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        MatSnackBarModule,
        HttpClientModule,
        NoopAnimationsModule
      ],
      providers: [
        UserService,
        TaskService,
        NotificationService,
        MessagingService,
        GroupService,
        AngularFirestore,
        CookieService,
        AngularFireAuth,
        AngularFireMessaging]
    });
  });

  it('Crear instancia', () => {
    const service: TaskService = TestBed.get(TaskService);
    expect(service).toBeTruthy();
  });

  it('Crear tarea', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.addTask(tareaTest);
    service.getTaskById(tareaTest.id).subscribe((tarea) =>
      expect(tarea !== undefined).toBe(true)
    );
  });

/*   it('Modificar fecha estimación', () => {
    const service: TaskService = TestBed.get(TaskService);
    const fecha = tareaTest.fechaEstimacion;
    service.updateDateEstimated(tareaTest, new Date());
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.fechaEstimacion).not.toEqual(fecha)
    );
  });

  it('Modificar fecha comienzo', () => {
    const service: TaskService = TestBed.get(TaskService);
    const fecha = tareaTest.fechaComienzo;
    service.updateDateStart(tareaTest, new Date());
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.fechaComienzo).not.toEqual(fecha)
    );
  }); */

/*    it('Añadir comentario', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.comentarios.length).toBe(0)
    );
    service.addComment(tareaTest, new Comment('Comentario de prueba'));
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.comentarios.length).toBe(1)
    );
  });  */

  it('Interrumpir tarea', () => {
    const service: TaskService = TestBed.get(TaskService);
    tareaTest.cancelada = false;
    service.cancelTask(tareaTest);
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.cancelada).toBe(true)
    );
  });

  it('Finalizar tarea', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.finishTask(tareaTest.id);
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.finalizada).toBe(true)
    );
  });

  it('Reanudar tarea', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.uncancelTask(tareaTest.id);
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.cancelada).toBe(true)
    );
  });

  it('Activar tarea', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.unfinishedTask(tareaTest.id);
    service.getTaskById(tareaTest.id).subscribe((tarea: Tarea) =>
      expect(tarea.finalizada).toBe(false)
    );
  });

  it('Listar tareas activas', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.getPendingTask().subscribe((tareas) => {
      expect(tareas.length > 0).toBe(true);
      tareas.forEach((tarea: Tarea) => {
        expect(tarea.cancelada).toBe(false);
        expect(tarea.finalizada).toBe(false);
      });
      expect(tareas.filter((tarea: Tarea) => moment(tarea.fechaComienzo).diff(moment(), 'day') > 0).length === 0).toBeTruthy();
    });
  });

  it('Listar tareas finalizadas', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.getFinishTask().subscribe((tareas) => {
      expect(tareas.length > 0).toBe(true);
      tareas.forEach((tarea: Tarea) => expect(tarea.finalizada).toBe(true));
    });
  });

  it('Listar tareas interrumpidas', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.getCancelTask().subscribe((tareas) => {
      expect(tareas.length > 0).toBe(true);
      tareas.forEach((tarea: Tarea) => expect(tarea.cancelada).toBe(true));
    });
  });

  it('Listar tareas próximas', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.getFutureTaskByUser(tareaTest.responsable).subscribe((tareas) => {
      expect(tareas.length > 0).toBe(true);
      tareas.forEach((tarea: Tarea) => {
        expect(tarea.cancelada).toBe(false);
        expect(tarea.finalizada).toBe(false);
      });
      expect(tareas.filter((tarea: Tarea) => moment(tarea.fechaComienzo).diff(moment(), 'day') <= 0).length === 0).toBeTruthy();
    });
  });

  it('Eliminar tarea', () => {
    const service: TaskService = TestBed.get(TaskService);
    service.deleteTask(tareaTest.id);
    service.getTaskById(tareaTest.id).subscribe((tarea) =>
      expect(tarea === undefined).toBe(true)
    );
  });


});
