import {Zona} from './zona';
import { Usuario } from './usuario';

export class Incidencia {
    id: string;
    descripcion: string;
    autor: Usuario;
    fecha: Date;
    tipo: string;
    zona: Zona;
    constructor() {}
}
