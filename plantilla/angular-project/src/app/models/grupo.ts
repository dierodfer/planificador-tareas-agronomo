import { Usuario } from './usuario';
import { DocumentReference } from '@angular/fire/firestore';

export class Grupo {
    id: string;
    nombre: string;
    usuarios: DocumentReference[];
    coordinador: string;
    constructor() {}
}
