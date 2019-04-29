export class Zona {
    invernadero: string;
    sector: string;
    tabla: string;
    planta: number;
    constructor(invernadero, sector, tabla, numero_planta: number) {
        this.invernadero = invernadero;
        this.sector = sector;
        this.tabla = tabla;
        this.planta = numero_planta;
    }
}
