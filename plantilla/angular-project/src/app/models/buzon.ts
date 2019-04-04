import { Notificacion } from './notificacion';

export class Buzon {
    id: string;
    usuario: string;
    visto: boolean;
    notificaciones: Notificacion[];
    constructor() {}
}
