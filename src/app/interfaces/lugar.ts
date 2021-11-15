export interface Lugar {
    id?: string;
    nombre: string;
    lat: number;
    lng: number;
    time?: number;
    ultEvent?: string;
    direccion?: string;
    onOff?: string;
    vel?: number;
    online?: boolean;
    timeParking?: number;
    dop?: string;
    sc?: string;
}
