import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    public usuario: any = null;
    public nombre: Usuario = null;
    public geocercas: any[] = [];
    public grupos: any[] = [];
    public grupoUsuario: any[] = [];
    public colecciones: any[] = [];
    public vehiculos: any[] = [];
    // vehiculos para filtros
    public vehiculosFiltros: any[] = [];
    public lenguaje: any;
    public lenguajeEs: any;
    public ordenVehiculos = {
        orden: 'Orden alfabético'
    };
    public detalleIgn = {
        ign: false
    };

    public vistaViaje = {
        op: 'pre'
    };

    public monitoreo = {
        tituloMarcador: false
    };

    public monitoreo2 = {
        agrupacion: true
    };

    public monitoreo3 = {
        popupZoom: false
    };



    public gruposSeleccionados: any[] = [];

    public cambioUsuario = [{
        id_usuario: 0,
        usuario: ''
    },{
        id_usuario: 0,
        usuario: ''
    }];

    public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    constructor(private router: Router,
                private restService: RestService,
                public wsService: WebsocketService) {
        this.cargarLenguaje();
        this.cargarLenguajeEs();
        this.cargarStorage();
        this.cargarGeocercas();
        this.cargarGrupos();
        this.cargarColeccion();
        this.cargarGruposUsuario();
        this.cargarVehiculos();
        // this.guardarVehiculos(this.ordenVehiculos);
        this.cargarOrdenVehiculos();
        this.cargarDetalleIgn();
        this.cargarVistaViaje();
        this.cargarTituloMarcador();
        this.cargarAgrupacionMarcador();
        this.cargarPopupZoom();
        this.cargarGruposSeleccionado();
        this.cargarCambioUsuario();
        
        if (this.usuario) {
            this.wsService.checkStatus(this.usuario.usuario.grupos);

            // actualizar el usuario en el item 0
            this.cambioUsuario[0].id_usuario = this.usuario.usuario.id_usuario;
            this.cambioUsuario[0].usuario = this.usuario.usuario.usuario;

        }

        

        // console.log('cantidad de veces que se ejecutar localStorageService');
    }

    loginWS(nombre: string, usuario: any) {

        this.nombre = new Usuario(nombre);
        this.usuario = usuario;
        this.guardarStorage(usuario);

        
        if (this.usuario) {

            // console.log('nombre1: ', this.cambioUsuario[0].usuario);
            // console.log('nombre2: ', usuario.usuario.usuario);
            if (this.cambioUsuario[0].usuario !== usuario.usuario.usuario) {
                console.log('es un usuario diferente');
                localStorage.removeItem('vehiculos');
                localStorage.removeItem('vehiculos');
                localStorage.removeItem('grupos-seleccionados');

                this.vehiculos = [];
                this.cambioUsuario = [{
                    id_usuario: 0,
                    usuario: ''
                },{
                    id_usuario: 0,
                    usuario: ''
                }]
            } else {
                console.log('es el mismo usuario logueado');
            }
        }
    }

    logoutWS() {

        this.guardarCambioUsuario('');

        this.usuario = null;

        // limpiamos el storage
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        /*localStorage.removeItem('vehiculos');
        localStorage.removeItem('vehiculos');
        localStorage.removeItem('grupos-seleccionados');*/
        localStorage.removeItem('geocercas');
        localStorage.removeItem('lenguaje');
        localStorage.removeItem('lenguaje-es');
        localStorage.removeItem('grupos-usuario');

        localStorage.removeItem('url-socket-default');
        localStorage.removeItem('url-api-default');
        localStorage.removeItem('popup-zoom');

        this.router.navigateByUrl('');
        
    }

    logoutWS2() {

        // this.guardarCambioUsuario('');

        this.usuario = null;

        // limpiamos el storage
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        /*localStorage.removeItem('vehiculos');
        localStorage.removeItem('vehiculos');
        localStorage.removeItem('grupos-seleccionados');*/
        localStorage.removeItem('geocercas');
        localStorage.removeItem('lenguaje');
        localStorage.removeItem('lenguaje-es');
        localStorage.removeItem('grupos-usuario');

        localStorage.removeItem('url-socket-default');
        localStorage.removeItem('url-api-default');
        localStorage.removeItem('popup-zoom');

        //this.router.navigateByUrl('');
    }

    logoutWSNoNavigate() {

        this.guardarCambioUsuario('');

        this.usuario = null;

        // limpiamos el storage
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        /*localStorage.removeItem('vehiculos');
        localStorage.removeItem('vehiculos');
        localStorage.removeItem('grupos-seleccionados');*/
        localStorage.removeItem('geocercas');
        localStorage.removeItem('lenguaje');
        localStorage.removeItem('lenguaje-es');
        localStorage.removeItem('grupos-usuario');

        localStorage.removeItem('url-socket-default');
        localStorage.removeItem('url-api-default');
        localStorage.removeItem('popup-zoom');


        const socket = {
            url: 'https://aps.tkontrol.com',
            path: 'srv1'
        };

        this.wsService.changeToAdminSocket(socket);
        // this.router.navigateByUrl('');
        
    }

    getUsuario() {
        return this.usuario;
    }

    // ----------------------------------------- guardar data en el storage ----------------------------------
    guardarLenguaje(lan: any) {
        this.lenguaje = lan;
        localStorage.setItem('lenguaje', JSON.stringify(lan));
    }

    guardarLenguajeEs(lan: any) {
        this.lenguajeEs = lan;
        localStorage.setItem('lenguaje-es', JSON.stringify(lan));
    }

    guardarStorage(usuario: any) {
        localStorage.setItem('nombre', JSON.stringify(this.usuario));
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }

    guardarGrupos(grupos: any) {
        this.grupos = grupos;
        localStorage.setItem('grupos', JSON.stringify(grupos));
    }

    guardarGruposUsuario(grupos: any) {
        this.grupoUsuario = grupos;
        localStorage.setItem('grupos-usuario', JSON.stringify(grupos));
    }

    guardarColeccion(colecciones: any) {
        this.colecciones = colecciones;
        localStorage.setItem('colecciones', JSON.stringify(colecciones));
    }

    guardarGeocercas(geocercas: any) {

        let geoActualizado: any[] = [];

        // verificamos que no haya cambios en las geocercas
        for (let i in geocercas) {
            // buscamos coincidencia en las geocercas que tenemos almacenada en el localStorage
            const resultGeocerca = this.geocercas.find( geocerca => {
                return  geocerca.id_geocerca === geocercas[i].id_geocerca &&
                        geocerca.id_coleccion_geocerca === geocercas[i].id_coleccion_geocerca &&
                        geocerca.id_grupo === geocercas[i].id_grupo;
            });

            // Evaluamos que exista la geocerca en el localStorage
            // con el fin de mantener la configuracíon del cliente intacta
            if (resultGeocerca === undefined) {
                // sino existe significa que hay que agregar una nueva geocerca al localStorage
                // con las configuraciones por default
                geoActualizado.push(geocercas[i]);
            } else {
                // si existe una geocerca entonces la agregamos con las configuraciones
                // ya establecida por el mismo usuario
                geoActualizado.push(resultGeocerca);
            }
        }
        this.geocercas = [];
        // actualizamos la data de geocerca en las variables
        this.geocercas.push(...geoActualizado);
        // actualizamos la data de la geocerca en el localStorage
        localStorage.setItem('geocercas', JSON.stringify(geoActualizado));
    }

    guardarGeocercas2(geocercas: any) {

        localStorage.setItem('geocercas', JSON.stringify(geocercas));
    }

    actualizarGeocerca(geocercas: any) {
        localStorage.setItem('geocercas', JSON.stringify(geocercas));
    }

    guardarVehiculos(vehiculos: any) {

        // console.log('VEHICULOS QUE ESTAN EN EL LOCAL STORAGE: ', this.vehiculos);
        // verificamos si hay actualización de datos
        let vehiculosNuevos: any[] = [];

        for (let obj of vehiculos) {

            // console.log('imeis a evaluar: ', veh[i].imei);
            const imei = obj.imei;
            // buscamos coincidencia en el localstorages
            // console.log('vehiculo 1: ', this.vehiculos[0].imei);
            const result = this.vehiculos.find( veh => veh.imei === imei);

            // evaluamos si hay coincidencia
            if (result === undefined) {
                // console.log('vehiculo local no existe: ');
                // sino existe hay agregar el que esta en el storage
                obj.visibilidad2 = 1;
                vehiculosNuevos.push(obj);

            } else {
                // console.log('hay vehiculo local existe');
                // si existe hay que agregar el vehiculo a localstorage
                // agregamos un nuevo atributo a vehiculo
                // visibilidad2
                obj.visibilidad2 = result.visibilidad2;
                vehiculosNuevos.push(obj);
            }
        }

        // limpiamos los vehiculos que tenia localstorage antes
        this.vehiculos = [];

        // actualizamos los vehiculos con el nuevo arreglo
        this.vehiculos.push(...vehiculosNuevos);

        // actualizamos los datos en el localStorage
        localStorage.setItem('vehiculos', JSON.stringify(this.vehiculos));

    }

    actualizarVehiculo(vehiculos: any) {
        this.vehiculos = vehiculos;
        localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    }

    guardarOrdenVehiculos(orden) {
        const o = {
            orden
        };
        this.ordenVehiculos.orden = orden;
        localStorage.setItem('orden-vehiculos', JSON.stringify(o));
    }

    guardarDetalleIgn(ign: boolean) {
        const valor = {
            ign
        };
        this.detalleIgn.ign = ign;
        localStorage.setItem('detalle-ign', JSON.stringify(valor));
    }

    guardarVistaViaje(opcion) {
        const valor = {
            op: opcion
        };
        this.vistaViaje.op = opcion;
        localStorage.setItem('vista-viaje', JSON.stringify(valor));
    }

    guardarTituloMarcador(opcion: boolean) {
        const valor = {
            tituloMarcador: opcion
        };
        this.monitoreo.tituloMarcador = opcion;
        localStorage.setItem('titulo-marcador', JSON.stringify(valor));
    }

    guardarAgrupacionMarcador(opcion: boolean) {
        const valor = {
            agrupacion: opcion
        };
        this.monitoreo2.agrupacion = opcion;
        localStorage.setItem('agrupacion-marcador', JSON.stringify(valor));
    }

    guardarPopupZoom(opcion: boolean) {
        const valor = {
            popupZoom: opcion
        };
        this.monitoreo3.popupZoom = opcion;
        localStorage.setItem('popup-zoom', JSON.stringify(valor));
    }


    guardarGruposSeleccionado(gruposSeleccionados: any) {
        this.gruposSeleccionados = gruposSeleccionados;
        localStorage.setItem('grupos-seleccionados', JSON.stringify(gruposSeleccionados));
    }

    guardarCambioUsuario(usuario: any) {
        this.cambioUsuario[0].usuario = this.usuario.usuario.usuario;
        localStorage.setItem('cambio-usuario', JSON.stringify(this.cambioUsuario));
    }

    // ----------------------------------------- cargar data del storage ------------------------------------
    cargarGrupos() {
        if (localStorage.getItem('grupos')) {
            this.grupos = JSON.parse(localStorage.getItem('grupos'));
        } else {

        }
    }

    cargarGruposUsuario() {
        if (localStorage.getItem('grupos-usuario')) {
            this.grupoUsuario = JSON.parse(localStorage.getItem('grupos-usuario'));
        } else {

        }
    }

    cargarStorage() {

        if (localStorage.getItem('usuario')) {
            this.nombre = JSON.parse(localStorage.getItem('nombre'));
            // console.log('usuario que ha iniciado sesion: ', JSON.parse(localStorage.getItem('usuario')));
            // this.loginWS( this.usuario.nombre, '' );
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
        } else {

        }
    }

    cargarGeocercas() {
        if (localStorage.getItem('geocercas')) {
            this.geocercas = JSON.parse(localStorage.getItem('geocercas'));
        } else {

        }
    }

    cargarColeccion() {
        if (localStorage.getItem('colecciones')) {
            this.colecciones = JSON.parse(localStorage.getItem('colecciones'));
        } else {

        }
    }

    cargarLenguaje() {
        if (localStorage.getItem('lenguaje')) {
            this.lenguaje = JSON.parse(localStorage.getItem('lenguaje'));
        } else {

        }
    }

    cargarLenguajeEs() {
        if (localStorage.getItem('lenguaje-es')) {
            this.lenguajeEs = JSON.parse(localStorage.getItem('lenguaje-es'));
        } else {

        }
    }

    cargarVehiculos() {
 
        if (localStorage.getItem('vehiculos')) {
            this.vehiculos = JSON.parse(localStorage.getItem('vehiculos'));
            // console.log('se cargo vehiculos locales', this. vehiculos);
        } else {

        }
    }

    cargarOrdenVehiculos() {
        if (localStorage.getItem('orden-vehiculos')) {
            this.ordenVehiculos = JSON.parse(localStorage.getItem('orden-vehiculos'));
            // console.log('se cargo vehiculos locales', this. vehiculos);
        } else {

        }
    }

    cargarDetalleIgn() {
        if (localStorage.getItem('detalle-ign')) {
            this.detalleIgn = JSON.parse(localStorage.getItem('detalle-ign'));
            // console.log('se cargo vehiculos locales', this. vehiculos);
        } else {

        }
    }

    cargarVistaViaje() {
        if (localStorage.getItem('vista-viaje')) {
            this.vistaViaje = JSON.parse(localStorage.getItem('vista-viaje'));
            // console.log('se cargo vehiculos locales', this. vehiculos);
        } else {

        }
    }

    cargarTituloMarcador() {
        if (localStorage.getItem('titulo-marcador')) {
            this.monitoreo = JSON.parse(localStorage.getItem('titulo-marcador'));
            // console.log('se cargo vehiculos locales', this. vehiculos);
        } else {

        }
    }

    cargarAgrupacionMarcador() {
        if (localStorage.getItem('agrupacion-marcador')) {
            this.monitoreo2 = JSON.parse(localStorage.getItem('agrupacion-marcador'));
            // console.log('se cargo vehiculos locales', this. vehiculos);
        } else {

        }
    }

    cargarPopupZoom() {
        if (localStorage.getItem('popup-zoom')) {
            this.monitoreo3 = JSON.parse(localStorage.getItem('popup-zoom'));
        } else {

        }
    }

    cargarGruposSeleccionado() {
        if (localStorage.getItem('grupos-seleccionados')) {
            this.gruposSeleccionados = JSON.parse(localStorage.getItem('grupos-seleccionados'));
        } else {

        }
    }

    cargarCambioUsuario() {
        if (localStorage.getItem('cambio-usuario')) {
            this.cambioUsuario = JSON.parse(localStorage.getItem('cambio-usuario'));
        } else {

        }
    }

    // ----------------------------------------- limplar datos ------------------------------------

    limpiarGeocercas() {
        this.geocercas = null;
    }

    /**********************************************************************************************
     *
     * método de traducción de idioma, lenguajes disponibles: de Español a Ingles
     * se pasa como parametro el string o cadena de texto para hacer la respectiva traducción
     * dependiendo si la configuración del usuario es idioma ingles (en), si es español (es),
     * no surgirá efecto en la traducción
     *
    */
    traductorLocal(candena: string): string {
        let usuario;
        if (localStorage.getItem('lenguaje')) {

            if (localStorage.getItem('usuario')) {

                usuario = JSON.parse(localStorage.getItem('usuario'));

                // evaluamos cual es el idioma predeterminado del usuario
                if (usuario.usuario.idioma === 'es') {
                    // console.log('lenguaje español');
                    return candena;
                } else {
                    let lenguajeEn;
                    let lenguajeEs;
                    lenguajeEs = JSON.parse(localStorage.getItem('lenguaje-es'));
                    lenguajeEn = JSON.parse(localStorage.getItem('lenguaje'));
                    // console.log('lenguaje ingles, palabra', value);
                    // console.log('texto econtrado en idioma español', this.getKeyByValue(lenguajeEs, value));
                    // console.log('traduccion a ingles: ', lenguajeEn[this.getKeyByValue(lenguajeEs, value)]);
                    if (lenguajeEn[this.getKeyByValue(lenguajeEs, candena)] !== undefined) {
                        return lenguajeEn[this.getKeyByValue(lenguajeEs, candena)];
                    } else {
                        return 'sin traducción';
                    }
                }
            } else {
                return 'sin traducción';
            }

        } else {
            return 'sin traducción';
        }
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    /**
     *
     * Algoritmos de buscador de punto dentro de una geocerca version 2
     * retorna distancia en metros (m)
     *
     */
    haversineDistance = ([lat1, lon1]: number[], [lat2, lon2]: number[], isMiles: boolean = false) => {

        const toRadian = (angle: number) => (Math.PI / 180) * angle;
        const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);
        const RADIUS_OF_EARTH_IN_KM = 6371;

        const dLat = distance(lat2, lat1);
        const dLon = distance(lon2, lon1);

        lat1 = toRadian(lat1);
        lat2 = toRadian(lat2);

        // Haversine Formula
        const a =
          Math.pow(Math.sin(dLat / 2), 2) +
          Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.asin(Math.sqrt(a));

        let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

        if (isMiles) {
          finalDistance /= 1.60934;
        }

        return finalDistance * 1000;
    }

    isMarkerInsideCircleV2([lat1, lon1]: number[], [lat2, lon2, radio]: number[]) {
        var d = this.haversineDistance([lat1, lon1], [lat2, lon2]);
        if(d < radio) {
            return true;
        } else {
            return false;
        }
    }

    isMarkerInsidePolygonPointV2(lat: any, lng: any, poly: any) {
        let inside = false;
        const x = lat;
        const y = lng;
        // console.log('poly: ', poly);
        const polyPoints = poly;
        for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            const xi = polyPoints[i].lat;
            const yi = polyPoints[i].lng;
            const xj = polyPoints[j].lat;
            const yj = polyPoints[j].lng;

            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    /**
     * 
     * fin de marcadores version 2
     */
}
