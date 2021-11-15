import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { PeriodicElement, ElementVehicle } from '../pages/configurar-vehiculo/configurar-vehiculo.component';
import { RawData } from '../interfaces/rawdata';
import { Device } from '../interfaces/device';
import { Etiqueta } from '../interfaces/etiqueta';
import { ConfiguracionDispositivo, Configuracion, ConfiguracionScript, Script } from '../interfaces/configuracionDispositivo';
import { Modulo } from '../interfaces/modulo';
import { Vehiculo } from '../interfaces/vehiculo';
import { Conductor } from '../interfaces/conductor';
import { ReporteRuta } from '../interfaces/reporteSemanal';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Injectable({
  providedIn: 'root'
})

export class RestService {
    
    public url = environment.wsUrl;

    constructor(private http: HttpClient) {

    }

    addPushSubscriber(sub:any) {
        return this.http.post(this.url + 'notifications', sub);
    }

    send() {
        return this.http.post(this.url + 'newsletter', null);
    }

    login(user: string, pass: string) {
        // Rest API para iniciar sesión en la app
        return this.http.post(this.url + 'login', { user, pass });
    }
    loginToken(token: string) {
        // Rest API para iniciar sesión en la app
        return this.http.post(this.url + 'login-token', { token });
    }

    obtenerVehiculosSinregistrar() {
        return this.http.get<ElementVehicle[]>(this.url + 'vehiculos-sin-registrar');
    }

    registrarDispositivo(dispositivo: any) {
        return this.http.post(this.url + 'registrar-dispositivo', dispositivo);
    }

    obtenerImeis() {
        return this.http.get<any[]>(this.url + 'obtener-imeis');
    }

    registrarVehiculo(vehiculo: ElementVehicle) {
        return this.http.post(this.url + 'registrar-vehiculo', vehiculo);
    }

    obtenerVehiculosAsociados() {
        return this.http.get<ElementVehicle[]>(this.url + 'vehiculos-asignados');
    }

    reasignarImei(idVehiculo: number, imeiAntiguo: string, imeiNuevo: string) {

        const data = {
            idVehiculo,
            imeiAntiguo,
            imeiNuevo
        };
        console.log(data);
        return this.http.post(this.url + 'reasignar-imei', data);

    }

    obtenerDetalleViajes(imei: string, fechaInit: string, fechaFin: string) {
        const data = {
        imei,
        fechaInit,
        fechaFin
        };
        return this.http.post<any[]>(this.url + 'obtener-detalle-viajes', data);
    }

    obtenerImagen(imei: string, idFoto: string) {
        const data = {
        imei,
        idFoto
        };
        return this.http.post(this.url + 'obtener-imagen', data);
    }

    obtenerDatosVehiculo(imei: string) {
        const data = {
        imei
        };
        return this.http.post<Device>(this.url + 'obtener-datos-vehiculo', data);
    }

    obtenerMensajesConsola(imei: string) {
        const data = {
        imei
        };
        return this.http.post(this.url + 'obtener-mensajes-consola', data);
    }

    obtenerDataRaw(imei: string, fechaInit: string, fechaFin: string) {
        const data = {
        imei,
        fechaInit,
        fechaFin
        };
        return this.http.post<RawData[]>(this.url + 'obtener-data-raw', data);
    }

    registrarEtiqueta(data: Etiqueta) {
        return this.http.post(this.url + 'registrar-etiqueta', data);
    }

    editarEtiqueta(data: Etiqueta) {
        return this.http.post(this.url + 'editar-etiqueta', data);
    }

    obtenerEtiquetas() {
        return this.http.get<Etiqueta[]>(this.url + 'obtener-etiquetas');
    }

    verHistorialAsociaciones(disp) {
        return this.http.post(this.url + 'obtener-historial-asociaciones', disp);
    }

    verHistorialAsociacionesVehiculo(disp) {
        return this.http.post(this.url + 'obtener-historial-asociaciones-vehiculo', disp);
    }

    // tslint:disable-next-line: variable-name
    obtenerEtiquetasPorConfiguracion(cod_configuracion) {
        return this.http.post<any[]>(this.url + 'obtener-etiquetas-por-configuracion', {cod_configuracion});
    }

    eliminarEtiqueta(etiqueta: string) {
        return this.http.post(this.url + 'eliminar-etiqueta', {id_etiqueta: etiqueta});
    }

    eliminarEtiquetaConfiguracion(etiqueta: string) {
        return this.http.post(this.url + 'eliminar-etiqueta-configuracion', etiqueta);
    }

    obtenerConfiguraciones() {
        // retorna un arreglo de configuraciones de dispositivos del tipo de dato: ConfiguracionDispositivo.
        return this.http.get<ConfiguracionDispositivo[]>(this.url + 'obtener-configuracion-dispositivos');
    }

    obtenerVehiculo(imei: string) {
        return this.http.post(this.url + 'obtener-vehiculo', {imei});
    }

    // tslint:disable-next-line: variable-name
    getConfig(cod_configuracion: string) {
        return this.http.post<Configuracion[]>(this.url + 'obtener-configuracion', {cod_configuracion});
    }

    registrarConfiguracion(data: ConfiguracionDispositivo) {
        return this.http.post(this.url + 'registrar-configuracion', data);
    }

    eliminarConfiguracion(id: string) {
        return this.http.post(this.url + 'eliminar-configuracion', {id});
    }

    // tslint:disable-next-line: variable-name
    actualizarEtiquetaConfiguracion(cod_configuracion, cod_evento, id_etiqueta, etiqueta, fotografia, icono, nombre_icono, descripcion_icono, color_icono) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'actualizar-etiqueta-configuracion', {cod_configuracion, cod_evento, id_etiqueta, etiqueta, fotografia, icono, nombre_icono, descripcion_icono, color_icono});
    }

    // tslint:disable-next-line: variable-name
    agregarEventoConfiguracion(cod_configuracion, cod_evento, id_etiqueta, etiqueta, fotografia, fecha, icono, nombre_icono, descripcion_icono, color_icono) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'agregar-evento-configuracion', {cod_configuracion, cod_evento, id_etiqueta, etiqueta, fotografia, fecha, icono, nombre_icono, descripcion_icono, color_icono});
    }

    // tslint:disable-next-line: variable-name
    actualizarConfiguracionDispositivo(imei: string, cod_configuracion: string, nombre_configuracion: string) {
        return this.http.post(this.url + 'actualizar-configuracion-dispositivo', {imei, cod_configuracion, nombre_configuracion});
    }

    // tslint:disable-next-line: variable-name
    actualizarZonaHorariaDispositivo(imei: string, zona_horaria: string) {
        return this.http.post(this.url + 'actualizar-zona-horaria-dispositivo', {imei, zona_horaria});
    }

    leerArchivoTxt() {
        return '';
    }

    // tslint:disable-next-line: variable-name
    agregarNuevaConfiguracionEq(cod_configuracion_eq: string, nombre: string, fecha: string, comandos: any[]) {
        return this.http.post(this.url + 'agregar-nueva-configuracion-equipo', { cod_configuracion_eq, nombre, fecha, comandos});
    }

    obtenerConfiguracionScript() {
        return this.http.get<ConfiguracionScript[]>(this.url + 'obtener-configuracion-script');
    }

    // tslint:disable-next-line: variable-name
    obtenerScript(cod_configuracion_eq: string ) {
        return this.http.post<Script[]>(this.url + 'obtener-script', {cod_configuracion_eq});
    }

    // tslint:disable-next-line: max-line-length
    registrarGeocercaCircular(radio: number, latLng: any[], nombre: string, grupos: any, colecciones: any, fecha: string, circular: string) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'registrar-geocerca-circular', {radio, latLng, nombre, grupos, colecciones, fecha, circular});
    }

    // tslint:disable-next-line: max-line-length
    registrarGeocercaCircularMultipleGrupo(radio: number, latLng: any[], nombre: string, grupos: any, colecciones: any, fecha: string, circular: string) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'registrar-geocerca-circular-multiple-grupos', {radio, latLng, nombre, grupos, colecciones, fecha, circular});
    }

    // tslint:disable-next-line: max-line-length
    registrarGeocercaCircularColecciones(radio: number, latLng: any, nombre: string, grupos: any, colecciones: any, fecha: string, circular: string) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'registrar-geocerca-circular-colecciones', {radio, latLng, nombre, grupos, colecciones, fecha, circular});
    }

    obtenerGeocercas() {
        return this.http.get<any[]>(this.url + 'obtener-geocercas');
    }

    obtenerGeocercas2(grupos: any[]) {
        return this.http.post<any[]>(this.url + 'obtener-geocercas2', {grupos});
    }

    obtenerGeocercas3(grupos: any[]) {
        return this.http.post<any[]>(this.url + 'obtener-geocercas3', {grupos});
    }

    obtenerGeocercasPorColecciones(colecciones, id_grupo) {
        return this.http.post<any[]>(this.url + 'obtener-geocercas-por-colecciones', {colecciones, id_grupo});
    }

    // tslint:disable-next-line: max-line-length
    registrarGeocercaPoligonal(radio: number, latLngs: any[], nombre: string, grupos: any, colecciones: any, fecha: string, circular: string) {
        // console.log('rest service: ', latLngs);
        return this.http.post(this.url + 'registrar-geocerca-poligonal', {radio, latLngs, nombre, grupos, colecciones, fecha, circular});
    }

    // tslint:disable-next-line: max-line-length
    registrarGeocercaPoligonalMultipleGrupo(radio: number, latLngs: any[], nombre: string, grupos: any, colecciones: any, fecha: string, circular: string) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'registrar-geocerca-poligonal-multiple-grupos', {radio, latLngs, nombre, grupos, colecciones, fecha, circular});
    }

    // tslint:disable-next-line: max-line-length
    registrarGeocercaPoligonalColecciones(radio: number, latLngs: any[], nombre: string, grupos: any, colecciones: any, fecha: string, circular: string) {
        // tslint:disable-next-line: max-line-length
        return this.http.post(this.url + 'registrar-geocerca-poligonal-colecciones', {radio, latLngs, nombre, grupos, colecciones, fecha, circular});
    }

    registrarColeccion(nombre: string, cantidad: number, fecha: string, geocercas: any[]) {
        const data = {
        nombre,
        cantidad,
        fecha,
        geocercas
        };
        return this.http.post(this.url + 'registrar-coleccion', data);
    }

    obtenerColecciones() {
        return this.http.get<any[]>(this.url + 'obtener-colecciones');
    }

    // tslint:disable-next-line: variable-name
    obtenerDetalleGeocercarColecciones(id_coleccion_geocerca: number) {
        return this.http.post<any[]>(this.url + 'obtener-geocercas-colecciones', {id_coleccion_geocerca});
    }

    // tslint:disable-next-line: variable-name
    actualizarGeocercaCircular(id_coordenada_geocerca: any, radio: any, latLng: any, nombre: string, id_geocerca) {
        return this.http.post(this.url + 'actualizar-geocerca-circular', {id_coordenada_geocerca, radio, latLng, nombre, id_geocerca});
    }

    // tslint:disable-next-line: variable-name
    actualizarGeocercaPoligonal(id_geocerca: any, radio: any, latLngs: any, fecha: string, nombre: string) {
        return this.http.post(this.url + 'actualizar-geocerca-poligonal', {id_geocerca, radio, latLngs, fecha, nombre});
    }

    crearGrupo(nombreGrupo: string, nombreCompania: string, direccion: string) {
        const data = {
            nombre_grupo: nombreGrupo,
            nombre_compania: nombreCompania,
            direccion_1: direccion
        };
        return this.http.post(this.url + 'crear-grupo', data);
    }

    editarGrupo(nombreGrupo: string, nombreCompania: string, direccion: string, id_grupo) {
        const data = {
            nombre_grupo: nombreGrupo,
            nombre_compania: nombreCompania,
            direccion_1: direccion,
            id_grupo
        };
        return this.http.post(this.url + 'editar-grupo', data);
    }

    /*editarGrupo(grupo: any) {
        return this.http.post(this.url + 'editar-grupo', grupo);
    }*/

    obtenerGrupos() {
        return this.http.get<any[]>(this.url + 'getgrupo');
    }

    crearUsuario(usuario: any) {

        const data = {
            cantidad_vehiculo: usuario.cantidad_vehiculo,
            status: 1,
            id_grupo: usuario.id_grupo,
            usuario: usuario.usuario,
            password: usuario.password,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefonos: usuario.telefonos,
            root: 0
        };

        return this.http.post(this.url + 'crear-usuario', data);
    }

    editarUsuario(usuario: any) {
        return this.http.post(this.url + 'editar-usuario', usuario);
    }
    

    eliminarUsuario(usuario) {
        return this.http.post(this.url + 'eliminar-usuario', usuario);
    }

    obtenerUsuarios() {
        return this.http.get<any[]>(this.url + 'getusuario');
    }

    crearVehiculo(idGrupo, idUsuario, codVehiculo) {
        const data = {
        idMaster: 1,
        idGrupo,
        idUsuario,
        codVehiculo
        };
        return this.http.post(this.url + 'asignarvehiculo', data);
    }

    obtenerVehiculos() {
        return this.http.get(this.url + 'getvehiculo');
    }

    // tslint:disable-next-line: variable-name
    obtenerModulos(id_usuario: number) {
        return this.http.post<Modulo[]>(this.url + 'obtener-modulos', {id_usuario});
    }

    // tslint:disable-next-line: variable-name
    obtenerCantidadNotificacionesAsignadas(id_usuario: number) {
        return this.http.post<any[]>(this.url + 'obtener-cantidad-notificaciones', {id_usuario});
    }

    // tslint:disable-next-line: variable-name
    obtenerNotificacionesSinAtender(id_usuario: number) {
        return this.http.post<any[]>(this.url + 'obtener-detalle-notificaciones-sin-atender', {id_usuario});
    }

    obtenerNotificacionesAtendidas(id_usuario: number, imeis, fecha_inicio, fecha_final) {
        return this.http.post<any[]>(this.url + 'obtener-detalle-notificaciones-atendidas', {id_usuario, imeis, fecha_inicio, fecha_final});
    }

    obtenerNotificacionesIgnoradas(id_usuario: number, imeis, fecha_inicio, fecha_final) {
        return this.http.post<any[]>(this.url + 'obtener-detalle-notificaciones-ignoradas', {id_usuario, imeis, fecha_inicio, fecha_final});
    }

    obtenerLogCorreos(id_usuario: number, imeis, fecha_inicio, fecha_final) {
        return this.http.post<any[]>(this.url + 'obtener-log-correos', {id_usuario, imeis, fecha_inicio, fecha_final});
    }

    obtenerLogDisparadores(id_usuario: number, ids_dispositivos, fecha_inicio, fecha_final) {
        return this.http.post<any[]>(this.url + 'obtener-log-disparador', {id_usuario , ids_dispositivos, fecha_inicio, fecha_final});
    }

    cambiarStatusNotificacionUsuario(id_usuario: number, sound_notificacion) {
        return this.http.post<any[]>(this.url + 'actualizar-status-notificacion-usuario', {id_usuario, sound_notificacion});
    }

    actualizarNotificacionANoAtendida(id_notificacion_endpoint_evento) {
        return this.http.post(this.url + 'actualizar-status-notificacion-no-atendida', {id_notificacion_endpoint_evento});
    }

    actualizarNotificacionAtendida(id_notificacion_endpoint_evento, comentario: string) {
        return this.http.post(this.url + 'actualizar-status-notificacion-atendida', {id_notificacion_endpoint_evento, comentario});
    }

    actualizarNotificacionPorAplicacion(semana) {
        return this.http.post(this.url + 'actualizar-notificacion-por-aplicacion', semana);
    }

    // tslint:disable-next-line: variable-name
    obtenerVehiculosPorUsuarios(grupos: any[]) {
        if (grupos.length === 0) {
            grupos.push(0);
            return this.http.post<any[]>(this.url + 'obtener-vehiculos-por-usuarios', {grupos});
        } else {
            return this.http.post<any[]>(this.url + 'obtener-vehiculos-por-usuarios', {grupos});
        }
    }

    // tslint:disable-next-line: variable-name
    obtenerVehiculosPorUsuariosV(grupos: any[]) {
        if (grupos.length === 0) {
            grupos.push(0);
            return this.http.post(this.url + 'obtener-vehiculos-por-usuarios-v', {grupos});
        } else {
            return this.http.post(this.url + 'obtener-vehiculos-por-usuarios-v', {grupos});
        }
    }

    actualizarVisibilidadVehiculos(dispositivos) {
        console.log('DATOS A ENVIAR:', dispositivos);
        return this.http.post(this.url + 'actualizar-visibilidad-vehiculos', {dispositivos});
    }

    recibirNotificaciones(sub: PushSubscription) {
        return this.http.post(this.url + 'subscribe', sub);
    }

    // tslint:disable-next-line: variable-name
    obtenerModuloUsuarioAsignado(id_usuario: number) {
        return this.http.post<any[]>(this.url + 'obtener-modulos-usuario-asignado', {id_usuario});
    }

    // tslint:disable-next-line: variable-name
    agregarVehiculoUsuario(id_grupo, id_dispositivo) {
        return this.http.post(this.url + 'agregar-vehiculo-usuario', {id_grupo, id_dispositivo});
    }

    // tslint:disable-next-line: variable-name
    quitarVehiculoUsuario(id_grupo, id_dispositivo) {
        return this.http.post(this.url + 'quitar-vehiculo-usuario', {id_grupo, id_dispositivo});
    }

    // tslint:disable-next-line: variable-name
    agregarGrupoUsuario(id_grupo, id_usuario) {
        return this.http.post(this.url + 'agregar-grupo-usuario', {id_grupo, id_usuario});
    }

    // tslint:disable-next-line: variable-name
    quitarGrupoUsuario(id_grupo, id_usuario) {
        return this.http.post(this.url + 'quitar-grupo-usuario', {id_grupo, id_usuario});
    }

    // tslint:disable-next-line: variable-name
    agregarModuloUsuario(id_usuario, id_modulo) {
        return this.http.post(this.url + 'agregar-modulo-usuario', {id_usuario, id_modulo});
    }

    // tslint:disable-next-line: variable-name
    quitarModuloUsuario(id_usuario, id_modulo) {
        return this.http.post(this.url + 'quitar-modulo-usuario', {id_usuario, id_modulo});
    }

    // tslint:disable-next-line: variable-name
    agregarColeccionGrupo(id_grupo, id_coleccion) {
        return this.http.post(this.url + 'agregar-coleccion-grupo', {id_grupo, id_coleccion});
    }

    // tslint:disable-next-line: variable-name
    quitarColeccionGrupo(id_grupo, id_coleccion) {
        return this.http.post(this.url + 'quitar-coleccion-grupo', {id_grupo, id_coleccion});
    }

    // tslint:disable-next-line: variable-name
    agregarSubUsuario(id_usuario_master, id_usuario_sub) {
        return this.http.post(this.url + 'agregar-usuario-sub', {id_usuario_master, id_usuario_sub});
    }

    // tslint:disable-next-line: variable-name
    quitarSubUsuario(id_usuario_master, id_usuario_sub) {
        return this.http.post(this.url + 'quitar-usuario-sub', {id_usuario_master, id_usuario_sub});
    }

    // tslint:disable-next-line: variable-name
    obtenerDispositivosUsuario(id_grupo: number) {
        return this.http.post<any[]>(this.url + 'obtener-dispositivo-usuario', {id_grupo});
    }

    obtenerGrupoUsuario(id_usuario: number) {
        return this.http.post<any[]>(this.url + 'obtener-grupo-usuario', {id_usuario});
    }

    obtenerSubUsuario(id_usuario: number) {
        return this.http.post<any[]>(this.url + 'obtener-subusuarios', {id_usuario});
    }

    // tslint:disable-next-line: variable-name
    obtenerColeccionGrupo(id_grupo: number) {
        return this.http.post<any[]>(this.url + 'obtener-coleccion-grupo', {id_grupo});
    }

    dataConToken() {
        // tslint:disable-next-line: max-line-length
        return this.http.get('https://aps.tkontrol.com/api/rawdata?vehiculos=637,63,640,621&campos=re_type,type&tz=America/El_Salvador&desde=2020-01-22 09:21:44&hasta=2020-01-23 09:31:42&orden=event_time');
    }

    editarVehiculo(vehiculo: Vehiculo) {
        // console.log('datos editado: ', vehiculo);
        return this.http.post(this.url + 'editar-vehiculo', vehiculo);
    }

    obtenerIdGrupos(id_usuario) {
        return this.http.post(this.url + 'obtener-id-grupos', {id_usuario});
    }

    eliminarVehiculo(vehiculo: Vehiculo) {
        // console.log('datos editado: ', vehiculo);
        return this.http.post(this.url + 'eliminar-vehiculo', vehiculo);
    }

    eliminarDispositivo(dispositivo: Vehiculo) {
        // console.log('datos editado: ', vehiculo);
        return this.http.post(this.url + 'eliminar-dispositivo', dispositivo);
    }

    // tslint:disable-next-line: variable-name
    eliminarGeocercaCircular(id_geocerca, id_coleccion_geocerca) {
        return this.http.post(this.url + 'eliminar-geocerca-circular', {id_geocerca, id_coleccion_geocerca});
    }

    obtenerColeccionesPorGrupo(id_grupo) {
        return this.http.post<any[]>(this.url + 'obtener-colecciones-por-grupo', {id_grupo});
    }

    obtenerColeccionesPorGrupo2(grupos: any[]) {
        return this.http.post<any[]>(this.url + 'obtener-colecciones-por-grupo2', {grupos});
    }

    crearNotificacionPorCorreo(notificacion) {
        return this.http.post(this.url + 'crear-notificacion-por-correo', notificacion);
    }

    crearNotificacionPorTelegram(notificacion) {
        return this.http.post(this.url + 'crear-notificacion-por-telegram', notificacion);
    }

    evaluarDuplicidadNotificacionPorCorreo(notificacion) {
        return this.http.post(this.url + 'evaluar-duplicidad-notificaciones-por-correo', notificacion);
    }

    evaluarDuplicidadNotificacionPorTelegram(notificacion) {
        return this.http.post(this.url + 'evaluar-duplicidad-notificaciones-por-telegram', notificacion);
    }

    crearNotificacionPorNotificacion(notificacion) {
        return this.http.post(this.url + 'crear-notificacion-por-aplicacion', notificacion);
    }

    listaNotificacion(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-notificacion-por-correo',{id_usuario});
    }
    listaNotificacionTelegram(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-notificacion-por-telegram',{id_usuario});
    }

    listaNotificacionPorAplicacion(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-notificacion-por-aplicacion',{id_usuario});
    }

    activarNotificacionCorreo(notificacion) {
        return this.http.post(this.url + 'activar-notificacion-por-correo', notificacion);
    }

    desactivarNotificacionCoreo(notificacion) {
        return this.http.post(this.url + 'desactivar-notificacion-por-correo', notificacion);
    }

    eliminarNotificacionPorCorreo(notificacion) {
        return this.http.post(this.url + 'eliminar-notificacion-por-correo', notificacion);
    }

    eliminarNotificacionPorTelegram(notificacion) {
        return this.http.post(this.url + 'eliminar-notificacion-por-telegram', notificacion);
    }

    eliminarDisparador(disparador) {
        return this.http.post(this.url + 'eliminar-disparador', disparador);
    }

    eliminarDisparadorTelegram(disparador) {
        return this.http.post(this.url + 'eliminar-disparador-telegram', disparador);
    }

    editaNotificacion(correos) {
        return this.http.post(this.url + 'editar-notificacion-por-correo', correos);
    }

    editaNotificacionMultiple(correos) {
        return this.http.post(this.url + 'editar-notificacion-por-correo-multiple', correos);
    }

    crearDisparador(data) {
        return this.http.post(this.url + 'crear-disparador', data);
    }

    crearDisparadorTelegram(data) {
        return this.http.post(this.url + 'crear-disparador-telegram', data);
    }

    actualizarIdConfiguracionScript(id_dispositivo, id_comando_equipo) {
        return this.http.post(this.url + 'actualizar-id-configuracion-script', {id_dispositivo, id_comando_equipo});
    }

    actualizarNombreConfiguracionEtiqueta(cod_configuracion, nombre) {
        return this.http.post(this.url + 'actualizar-nombre-configuracion-etiqueta', {cod_configuracion, nombre});
    }

    eliminarConfiguracionScript(cod_configuracion_eq) {
        return this.http.post(this.url + 'eliminar-configuracion-script', {cod_configuracion_eq});
    }

    eliminarNotificacionPorAplicacion(noti) {
        return this.http.post(this.url + 'eliminar-notificacion-por-aplicacion', noti);
    }

    eliminarColeccion(coleccion) {
        return this.http.post(this.url + 'eliminar-coleccion', coleccion);
    }

    editarColeccion(coleccion) {
        return this.http.post(this.url + 'editar-coleccion', coleccion);
    }

    obtenerNotificacionesPorTrigger(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-disparadores-por-usuario', {id_usuario});
    }
    obtenerNotificacionesPorTriggerTelegram(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-disparadores-por-usuario-telegram', {id_usuario});
    }

    /* ---- CRUD Rutas ---- */
    crearRuta(ruta) {
        return this.http.post(this.url + 'crear-ruta', ruta);
    }

    // tslint:disable-next-line: variable-name
    obtenerRutas(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-rutas', {id_usuario});
    }

    // tslint:disable-next-line: variable-name
    obtenerRutaGeocerca(id_ruta) {
        return this.http.post<any[]>(this.url + 'obtener-ruta-geocerca', {id_ruta});
    }

    eliminarRuta(id_ruta) {
        return this.http.post<any[]>(this.url + 'eliminar-ruta', {id_ruta});
    }
    /* ---- /CRUD Rutas ---- */

    agregarGeocercaARuta(id_ruta: number, id_geocercas: number[]) {
        return this.http.post(this.url + 'agregar-geocerca-ruta', {id_ruta, id_geocercas});
    }

    eliminarGeocercaARuta(id_ruta: number, id_geocerca: number) {
        return this.http.post(this.url + 'eliminar-geocerca-ruta', {id_ruta, id_geocerca});
    }

    /* ---- /CRUD Conductor ---- */
    obtenerConductores(id_usuario) {
        return this.http.post<any[]>(this.url + 'obtener-conductores', {id_usuario});
    }

    actualizarConductor(conductor: any) {
        return this.http.post<boolean>(this.url + 'actualizar-conductor', conductor);
    }

    eliminarConductor(id_conductor: number) {
        return this.http.post<boolean>(this.url + 'eliminar-conductor', {id_conductor});
    }

    crearConductor(conductor: any) {
        return this.http.post<boolean>(this.url + 'crear-conductor', conductor);
    }
    /* ---- /CRUD Conductor ---- */

    crearMeta(meta) {
        return this.http.post(this.url + 'crear-meta', meta);
    }

    obtenerMetaDeConductor(id_conductor: number) {
        return this.http.post(this.url + 'obtener-meta-conductor', {id_conductor});
    }

    obtenerMetaDeConductorPorRutas(rutas) {
        return this.http.post(this.url + 'obtener-meta-conductor-por-rutas', {rutas});
    }

    obtenerIdGeocercaRuta(rutas) {
        return this.http.post(this.url + 'obtener-id-geocerca-rutas', {rutas});
    }

    obtenerCoordenadasVehiculoPorFechas(id_conductor, fechaInicio, fechaFinal) {
        return this.http.post<any[]>(this.url + 'obtener-coordenadas-vehiculos-por-fechas', {id_conductor, fechaInicio, fechaFinal});
    }

    crearMetaPorDia(metaPorDia) {
        return this.http.post(this.url + 'crear-meta-por-dia', metaPorDia);
    }

    crearMetaPorRutas(metaPorRutas) {
        return this.http.post(this.url + 'crear-meta-por-rutas', metaPorRutas);
    }

    actualizarCambiosMetaPorRutas(metaAntes, metaDespues) {
        const data = {
            meta_antes : metaAntes,
            meta_despues: metaDespues
        }

        console.log('valores a enviar en http: ', data);
        return this.http.post(this.url + 'actualizar-cambios-meta-por-rutas', data);
    }

    obtenerTextoIdioma(lan) {
        if (lan === 'es') {
            return this.http.get('assets/language/es.json');
        } else {
            return this.http.get('assets/language/en.json');
        }
    }

    // bloqueo motor
    obtenerActivaciones(imei: string) {
        return this.http.post<any[]>(this.url + 'obtener-activaciones', {imei});
    }

    obtenerActivacionesMotor(imei: string) {
        return this.http.post<any[]>(this.url + 'obtener-activacion-motor', {imei});
    }

    obtenerRespuestaActivacionMotor(imei: string) {
        return this.http.post<any[]>(this.url + 'obtener-respuesta-activacion-motor', {imei});
    }

    // bloqueo salida 2
    obtenerActivacionesSalida2(imei: string) {
        return this.http.post<any[]>(this.url + 'obtener-activaciones-salida2', {imei});
    }

    obtenerActivacionSalida2(imei: string) {
        return this.http.post<any[]>(this.url + 'obtener-activacion-salida2', {imei});
    }

    obtenerRespuestaActivacionSalida2(imei: string) {
        return this.http.post<any[]>(this.url + 'obtener-respuesta-activacion-salida2', {imei});
    }

    // tslint:disable-next-line: variable-name
    obtenerReportesSemanalesRuta(fecha_inicio: string, fecha_final, ids_conductores: number[]) {
        return this.http.post<ReporteRuta[]>(this.url + 'obtener-reportes-semanal-rutas', {fecha_inicio, fecha_final, ids_conductores});
    }

    obtenerReporteDesvioRutaSemanal(imeis: number[], fecha_inicio: string, fecha_final) {
        return this.http.post<any[]>(this.url + 'obtener-reporte-desvio-rutas-semanal', {fecha_inicio, fecha_final, imeis});
    }

    obtenerDetalleDesvioRutaSemanal(eq: any) {
        return this.http.post<any[]>(this.url + 'obtener-reporte-desvio-rutas-semanal-detalle', eq);
    }

    // tslint:disable-next-line: variable-name
    obtenerMetasPorIdsConductores(ids_conductores: number[]) {
        return this.http.post<ReporteRuta[]>(this.url + 'obtener-meta-rutas-por-ids-conductores', {ids_conductores});
    }

    // tslint:disable-next-line: variable-name
    obtenerRutasMultiple(ids_rutas: number[]) {
        return this.http.post<ReporteRuta[]>(this.url + 'obtener-rutas-multiples-ids', {ids_rutas});
    }

    cambiarIdioma(id_usuario: number, lenguaje: string) {
        return this.http.post<ReporteRuta[]>(this.url + 'cambiar-idioma', {id_usuario, lenguaje});
    }

    guardarVistaViaje(id_usuario: number, op: string) {
        return this.http.post<ReporteRuta[]>(this.url + 'guardar-vista-viaje', {id_usuario, op});
    }

    agregarVehiculoAnotificacionTrigger(ob: any) {
        console.log(ob);
        return this.http.post<any[]>(this.url + 'agregar-vehiculo-notificacion-trigger', ob);
    }

    eliminarVehiculoAnotificacionTrigger(ob: any) {
        console.log(ob);
        return this.http.post<any[]>(this.url + 'eliminar-vehiculo-notificacion-trigger', ob);
    }

    agregarGeocercanotificacionTrigger(ob: any) {
        console.log(ob);
        return this.http.post<any[]>(this.url + 'agregar-geocerca-notificacion-trigger', ob);
    }

    eliminarGeocercaAnotificacionTrigger(ob: any) {
        console.log(ob);
        return this.http.post<any[]>(this.url + 'eliminar-geocerca-notificacion-trigger', ob);
    }

    cambiarStatusUsuario(status, id_usuario) {
        const data = {
            status,
            id_usuario
        };
        return this.http.post<any[]>(this.url + 'cambiar-status-usuario', data);
    }

    nominatimLocal(lat: number, lng: number) {
        return this.http.get(`https://nominatim.tkontrol.com/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    }

    // tslint:disable-next-line: variable-name
    desasociarVehiculoDelConductor(id_dispositivo, id_conductor) {
        return this.http.post<any[]>(this.url + 'desasociar-vehiculo-conductor', {id_dispositivo, id_conductor});
    }

    // tslint:disable-next-line: variable-name
    asociarVehiculoDelConductor(id_dispositivo, id_conductor) {
        return this.http.post<any[]>(this.url + 'asociar-vehiculo-conductor', {id_dispositivo, id_conductor});
    }

    obtenerDatosAuditorEventos(imeis, fInicial, fFinal) {
        return this.http.post<any[]>(this.url + 'auditor-eventos', {imeis, fInicial, fFinal});
    }

    obtenerVelocidadesMaxima(ids: number[], fInicial, fFinal) {
        return this.http.post<any[]>(this.url + 'obtener-velocidades-maximas', {ids, fInicial, fFinal});
    }

    obtenerVelocidades(imei, fInicial, fFinal) {
        return this.http.post<any[]>(this.url + 'obtener-velocidades', {imei, fInicial, fFinal});
    }

    actualizarLimiteVelocidad(id_usuario, velocidad_maxima) {
        return this.http.post<any[]>(this.url + 'actualizar-limite-velocidad', {id_usuario, velocidad_maxima});
    }

    actualizarExcesoPermitido(id_usuario, exceso_permitido) {
        return this.http.post<any[]>(this.url + 'actualizar-exceso-permitido', {id_usuario, exceso_permitido});
    }

    obtenerRegistroCambiosRuta() {
        return this.http.post<any[]>(this.url + 'obtener-registro-cambios-rura', {});
    }

    obtenerSesionesSubUsuario(id_usuario_master) {
        return this.http.post<any[]>(this.url + 'obtener-sesiones-subusuario', { id_usuario_master });
    }

    obtenerEstadoComandoEnCola(imei) {
        return this.http.post<any>(this.url + 'obtener-estado-comandos-cola', { imei });
    }

    actualizarCorreoTrigger(alerta) {
        return this.http.post<any>(this.url + 'actualizar-correos-trigger', alerta);
    }

    validarAdministrador(url, pdw: string) {
        return this.http.post<any>(url + 'validar-administrador', {pdw});
    }

    sistemRestartServerNodejs( url, pdw: string) {
        return this.http.post<any>(url + 'system-restart-server-nodejs', {pdw});
    }

    actualizarTelefono(tel: any) {
        return this.http.post(this.url + 'actualizar-telefono', tel);
    }

    agregarTelefono(tel: any) {
        return this.http.post(this.url + 'agregar-telefono', tel);
    }

    eliminarTelefono(tel: any) {
        return this.http.post(this.url + 'eliminar-telefono', tel);
    }

    opsLogin1(user: string, pass: string) {
        const data = new FormData();
        data.append('user', user);
        data.append('pass', pass);

        return fetch('https://ops.tkontrol.com/token.php',{
            mode: 'cors',
            method: 'POST',
            body: data
        }).then(response => {
            if (response.status !== 200) {
                // console.log('Looks like there was a problem. Status Code: ' +
                //response.status);
                return;
              }
              console.log(response);
        
              // Examine the text in the response
              return response.json();
        }).catch(e => {
            return e;
        });
    }

    opsLogin2(token: string) {
        return this.http.get(this.url + 'https://ops.tkontrol.com/login2.php?token=' + token);
    }
}
