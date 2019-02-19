export class Zona {
    invernadero: string;
    sector: string;
    tabla: string;
    numero_planta: number;
    constructor(invernadero, sector, tabla, numero_planta: number) {
        this.invernadero = invernadero;
        this.sector = sector;
        this.tabla = tabla;
        this.numero_planta = numero_planta;
    }
}
