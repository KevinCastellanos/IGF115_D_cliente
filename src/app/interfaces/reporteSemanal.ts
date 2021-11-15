export interface ReporteRuta {
  id?: number;
  id_conductor?: number;
  cantidad?: number;
  c_domingo?: number;
  c_lunes?: number;
  c_martes?: number;
  c_miercoles?: number;
  c_jueves?: number;
  c_viernes?: number;
  c_sabado?: number;
  id_ruta_domingo?: number;
  id_ruta_lunes?: number;
  id_ruta_martes?: number;
  id_ruta_miercoles?: number;
  id_ruta_jueves?: number;
  id_ruta_viernes?: number;
  id_ruta_sabado?: number;
  tipo_meta?: number;
  id_meta_conductor?: number;
  fecha_inicio?: string;
  fecha_final?: string;
  total_domingo?: number;
  total_lunes?: number;
  total_martes?: number;
  total_miercoles?: number;
  total_jueves?: number;
  total_viernes?: number;
  total_sabado?: number;
  paradas_dentro_ruta?: Paradasdentroruta[];
  paradas_fuera_ruta_ref?: Paradasfuerarutaref[];
  paradas_fuera_ruta_noref?: Paradasfuerarutanoref[];
  nombre_vehiculo?: string;
  nombre_conductor?: string;
}

interface Paradasfuerarutanoref {
  id?: number;
  lat?: number;
  lng?: number;
  evento?: string;
  event_time?: string;
  id_conductor?: number;
  id_meta_conductor?: number;
}

interface Paradasfuerarutaref {
  id?: number;
  dia?: number;
  fecha?: string;
  id_geocerca?: number;
  id_paradas_totales_ruta?: number;
}

interface Paradasdentroruta {
  id: number;
  dia: number;
  fecha: string;
  id_ruta: number;
  id_geocerca: number;
  id_paradas_totales_ruta: number;
}
