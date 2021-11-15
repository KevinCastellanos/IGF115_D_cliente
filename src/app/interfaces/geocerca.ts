export interface Geocerca {
    id_geocerca: number;
    id_coleccion_geocerca: number;
    id_grupo_usuario: number;
    nombre: string;
    circular: string;
    fecha: Date
    visibilidad: number
    id: number
    sin_coleccion: number
    id_grupo: number;
    cantidad: number;
    coleccion: number;
    nombre_geocerca: string;
    coordenada_geocerca: any[];
    idLeaflet: number;
    nombre_grupo?: string;
}
