export interface RawData {
    id?: number;
    imei?: string;
    nombre?: string;
    evento?: string;
    etiqueta?: string;
    address?: string;
    event_time?: string;
    system_time?: string;
    lat?: number;
    lng?: number;
    vel?: number;
    direccion?: string;
    modo_adqui?: string;
    calidad_datos?: string;
    SV?: string;
    BL?: string;
    DOP?: string;
    CF?: string;
    AL?: string;
    AC?: string;
    IX?: string;
    SA?: string;
    TI?: string;
    CE?: string;
    CL?: string;
    CS?: string;
    VO?: string;
    SC?: string;
    PS00?: string;
    RE?: string;
    movimiento?: boolean;
    desde?: string;
    hasta?: string;
    nombre_vehiculo?: string;
    hora_inicio?: string;
    hora_final?: string;
    viaje?: boolean;
    ign_on?: boolean;
    ign_off?: boolean;
    num_viaje?: number;
    color?: string;
    background?: string;
    colorText?: string;
    ibutton?: string;
    AD?: number;
    viaje_unico?: boolean;
    icono?: number;
    nombre_icono?: string;
    descripcion_icono?: string;
    posicion_valida?: number;
    color_icono?: string;
    PS01?: any;
}
