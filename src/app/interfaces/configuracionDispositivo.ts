export interface ConfiguracionDispositivo {
    id?: number;
    cod_configuracion?: string;
    nombre?: string;
    fecha?: string;
    configuracion?: Configuracion[];
    zona_horaria?: string;
}

export interface Configuracion {
    id?: number;
    cod_configuracion?: string;
    cod_evento?: string;
    id_etiqueta?: number;
    etiqueta?: string;
    fotografia?: boolean;
    fecha?: string;
    notificacion?: number;
    icono?: number;
    nombre_icono?: string;
    descripcion_icono?: string;
    color_icono?: string;
}

export interface ConfiguracionScript {
    id: number;
    cod_configuracion_eq: string;
    nombre: string;
    fecha: string;
}

export interface Script {
    id: number;
    cod_configuracion_eq: string;
    comando: string;
    fecha: string;
}
