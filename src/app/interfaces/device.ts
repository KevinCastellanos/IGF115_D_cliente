import { Vehiculo } from './vehiculo';
export interface Device {
    id_dispositivo?: number;
    id_vehiculo?: number;
    id_conexion?: number;
    imei?: string;
    modelo?: string;
    fw?: string;
    configuracion?: string;
    disabled?: boolean;
    asociado?: boolean;
    confirmacion?: boolean;
    interface?: string;
    sim_id?: string;
    operator?: string;
    imsi?: string;
    fecha?: string;
    keep_alive?: string;
    ign?: string;
    platform?: string;
    usuario?: string;
    online?: string;
    timer?: number;
    timerMoving?: number;
    timerParking?: number;
    timerReport?: number;
    inactivityTime?: number;
    ult_evento?: string;
    ult_event_time?: string;
    ult_system_time?: string;
    ult_lat?: number;
    ult_lng?: number;
    ult_vel?: number;
    ult_direccion?: string;
    ult_modo_adqui?: string;
    ult_calidad_datos?: string;
    ult_SV?: string;
    ult_BL?: string;
    ult_DOP?: string;
    ult_CF?: string;
    ult_AL?: string;
    ult_AC?: string;
    ult_IX?: string;
    ult_SA?: string;
    ult_TI?: string;
    ult_CE?: string;
    ult_CL?: string;
    ult_CS?: string;
    ult_VO?: string;
    ult_SC?: string;
    ult_PS00?: string;
    ult_RE?: string;
    nombre?: string;
    nombre_conductor?: string;
    colorConexion?: string;
    address?: string;
    nombre_script?: string;
    cod_configuracion_eq?: string;
    fuente?: string;
    ult_ibutton?: string;
    fecha_fuente?: string;
    ult_icono?: number;
    ult_nombre_icono?: string;
    ult_descripcion_icono?: string;
    ult_posicion_valida?: number;
    nombre_grupo?: string;
    id_conductor?: number;
    id_grupo?: number;
    fecha_creacion?: string;
    tiempo_inactividad?: number;
    viajes?: any[];
    infoVehiculo?: Vehiculo;
    loaderDetalleVehiculo?: boolean;
    detalleEventos?: any[];
    comandos?: any[];
    despachado?: boolean;
    col_left?: string;
    col_right?: string;
    expandedDetails?: boolean;
    distancia_recorrida?: number;
    zona_horaria?: string;
    id_comando_equipo?: number;
}
