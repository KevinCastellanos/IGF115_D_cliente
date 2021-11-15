export interface CuartoReporte {
    total_paradas_domingo?: number;
    total_paradas_lunes?: number;
    total_paradas_martes?: number;
    total_paradas_miercoles?: number;
    total_paradas_jueves?: number;
    total_paradas_viernes?: number;
    total_paradas_sabado?: number;
    nombre_conductor?: string;
    nombre_vehiculo?: string;
    fecha_inicio?: string;
    fecha_final?: string;
    total_paradas_fuera_ruta_domingo?: number;
    total_paradas_fuera_ruta_lunes?: number;
    total_paradas_fuera_ruta_martes?: number;
    total_paradas_fuera_ruta_miercoles?: number;
    total_paradas_fuera_ruta_jueves?: number;
    total_paradas_fuera_ruta_viernes?: number;
    total_paradas_fuera_ruta_sabado?: number;
}
