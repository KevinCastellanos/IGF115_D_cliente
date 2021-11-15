import { RawData } from '../interfaces/rawdata';
export class DatosSinProcesar {
    data: RawData[] = [];
    constructor() {

    }

    registrarData(dat) {
        this.data.push(...dat);
    }

    obtenerData() {
        return this.data;
    }
}
