import { TareaCiclo } from './tareaCiclo';

export class Fase {
    nombre: string;
    tareas: TareaCiclo[];
    id: string;
    constructor(nombre: string) {
        this.id = Math.random().toString().substring(2);
        this.nombre = nombre;
        this.tareas = [];
    }
}
