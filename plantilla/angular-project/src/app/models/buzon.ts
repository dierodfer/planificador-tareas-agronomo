import { Notificacion } from './notificacion';
import { DocumentReference } from '@angular/fire/firestore';

export class Buzon {
    id: string;
    usuario: string;
    visto: boolean;
    notificaciones: Notification[];
    constructor() {}
}
