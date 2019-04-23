import { Comentario } from './comentario';

export class Tarea {
    id: string;
    descripcion: string;
    fechaComienzo: Date;
    fechaEstimacion: Date;
    fechaFinalizacion: Date;
    responsable: string;
    grupal: boolean;
    grupo: string;
    tipo: string;
    subtipo: string;
    cancelada: boolean;
    finalizada: boolean;
    comentarios: Comentario[];
    constructor() {}
}
