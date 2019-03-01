export class TareaCiclo {
    nombre: string;
    tareas: TareaCiclo[];
    nivel: number;
    constructor(nombre: string) {
        this.nombre = nombre;
        this.tareas = [];
    }

}