export class Notificacion {
    descripcion: string;
    fecha: Date;
    leido: boolean;
    titulo: string;
    constructor(descripcion, titulo) {
        this.descripcion = descripcion;
        this.fecha = new Date();
        this.leido = false;
        this.titulo = titulo;
    }
}