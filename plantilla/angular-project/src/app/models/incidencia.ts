import {Zona} from './zona';
import { Usuario } from './usuario';

export class Incidencia {
    id: string;
    descripcion: string;
    autor: Usuario;
    responsable: string;
    fechaCreacion: Date;
    fechaAtendida: Date;
    fechaResuelta: Date;
    tipo: string;
    zona: Zona;
    estado: string;
    prioridad: string;
    ubicacion;
    constructor() {}
}
