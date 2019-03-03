
export class Grupo {
    id: string;
    nombre: string;
    usuarios: string[];
    coordinador: string;
    constructor(nombre, coordinador) {
        this.coordinador = coordinador;
        this.nombre = nombre;
        this.usuarios = [];
    }
}
