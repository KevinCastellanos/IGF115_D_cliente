import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef, OnDestroy, ChangeDetectionStrategy, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import * as moment from 'moment';
import { Device } from '../../interfaces/device';
import { RestService } from '../../services/rest.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogImageComponent } from '../../components/dialog-image/dialog-image.component';
import { LocalStorageService } from '../../services/local-storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ChatService } from 'src/app/services/chat.service';
import { VisibilidadVehiculosComponent } from '../../components/visibilidad-vehiculos/visibilidad-vehiculos.component';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MapService } from '../../services/map.service';
import { ArrayMarkers } from '../../interfaces/arrayMarkers';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { DialogBuscarCoordenadaComponent } from '../../components/dialog-buscar-coordenada/dialog-buscar-coordenada.component';
import { DialogVerGeocercasComponent } from '../../components/dialog-ver-geocercas/dialog-ver-geocercas.component';
import { DialogGeocercaComponent } from '../../components/dialog-geocerca/dialog-geocerca.component';
import { DialogGeocercaPoligonalComponent } from '../../components/dialog-geocerca-poligonal/dialog-geocerca-poligonal.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';
import { DialogAtenderNotificacionComponent } from 'src/app/components/dialog-atender-notificacion/dialog-atender-notificacion.component';
import { DialogBuscarGeocercaComponent } from 'src/app/components/dialog-buscar-geocerca/dialog-buscar-geocerca.component';
import { DialogImageDobleCamaraComponent } from 'src/app/components/dialog-image-doble-camara/dialog-image-doble-camara.component';
import { DetallesViajesComponent } from 'src/app/components/detalles-viajes/detalles-viajes.component';
import { DialogDetalleVehiculoComponent } from '../../components/dialog-detalle-vehiculo/dialog-detalle-vehiculo.component';
import { DialogGalleryComponent } from 'src/app/components/dialog-gallery/dialog-gallery.component';

declare let L;
//import * as L from 'leaflet';


export interface EventLive {
    id?: any;
    evento?: string;
    event_time?: string;
    address?: string;
    vel?: number;
    lat?: number;
    lng?: number;
    PS00?: string;
    PS01?: string;
    PS02?: string;
    PS03?: string;
    etiqueta?: string;
    colorText?: string;
    background?: string;
    icono?: number;
    nombre_icono?: string;
    descripcion_icono?: string;
    color_icono?: string;
    posicion_valida?: number;
    imei?: any;
}


@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit, OnDestroy {

    // items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);

    showFiller = false;
    @ViewChild('map', { static: true}) mapaElement: ElementRef;

    marcadores: any;
    infoWindows: any;

    // lugares: Lugar[] = [];
    segundos = 0;
    vehiculoASeguir = '';
    ultDireccionSeleccionada = 'Resolviendo dirección ...';
    ultGeocercaSeleccionada = 'No geocerca';

    timeTacoma = '';
    timeFocus = '';
    realTimeMoment = '';

    viewVehiculos = true;
    viewLive = false;
    @ViewChild('liveEventContainer', { static: true, read: ViewContainerRef }) liveEventContainer;
    loadText = true;
    imeiSeleccionado = '';
    imeiSeleccionadoEnviaje = '';
    public detalleViaje: any[] = [];
    public innerWidth: any;
    public icon = 'keyboard_arrow_left';
    public modulos: any;
    // public vehiculos: any;
    public searchText = '';
    public loaderVehiculos = true;
    readonly VAPID_KEY = 'BG0qfnRx8-42jJmExhY6e36_G0v6pE5RlcPGxRDvJutxHfNvq9OxUiEt66Fx8fnlTNwbDZKd7bxIo7jTioaAmA8';
    public nombreVehiculoSeleccionado = '';
    public streetView = false;
    public boolEventoNoGenerado = false;
    public cantidadNotificaciones = 0;
    public notificacionesSinAtender: any[] = [];

    // variable de suscripcion
    public subVehiculo: Subscription;
    public subObtenerModulos: Subscription;

    public subWsMarcadorMover: Subscription;
    public subWsMarcadorSinReporte: Subscription;
    public subWsPrueba: Subscription;

    public subObtenerRawData: Subscription;
    public subObtenerImagen: Subscription;
    public subObtenerCantidadNotificacionesAsignadas: Subscription;
    public subObtenerDetalleNotificacionesSinAtender: Subscription;
    public subWsUltimaNotificacion: Subscription;

    public colecciones: any[] = [];
    public polygonDrawer: any;

    public viewSaveGeocerca = false;
    private idLeafletSeleccionado = -1;
    private fecha = '';

    public opciones = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
    };

    public coorsUser = {
        lat: 13.701170,
        lng: -89.224402
    };

    public loaderNotificaciones = false;
    public cantidadVehiculos = 0;

    public botonCamaraDesabilidato = false;

    // este arreglo mantendra los datos actualizados de los vehiculos, para no estar haciendo muchos procesos 
    // dentro del mapa y cambiar vista
    // cuando se seleccione un vehiculo, se le mandara la data de este array para verlo en el popup
    public vehiculosTemporales: any[] = [];

    public filteredCount = { count: 0 };

    public vehiculos: any[] = [];

    public popupLista;

    public visibilidadViajeEscritorio = true;

    @ViewChild('detallesViajesContainer', { static: true, read: ViewContainerRef}) detalleViajeContainer;

    public badgeVehiculo = false;

    public detalleVehiculo = false;

    private imeiAntesSeleccionado = '';
    private direccionAntesSeleccionado = 0;
    private entroADetalleEvento = false;
    public arrayLatLng = [];

    public geocercasCargadas = false;

    private vehiculoSeleccionado = null;

    private markerTaxi = null;

    constructor(public wsService: WebsocketService,
                private restService: RestService,
                private dialog: MatDialog,
                public localStorageService: LocalStorageService,
                private _snackBar: MatSnackBar,
                public chatService: ChatService,
                public swUpdate: SwUpdate,
                public swPush: SwPush,
                public mapService: MapService,
                private snackBar: MatSnackBar,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {
        // console.log('IDIOMA DEL USUARIO: ', this.localStorageService.usuario.usuario.idioma);
        this.obtenerTextoIdioma(this.localStorageService.usuario.usuario.idioma);

    }

    ngOnInit() {       

        /*if (this.route2.snapshot.params['ref'] !== undefined) {
            this.router.navigateByUrl('/monitoreo');
            //location.reload();
        }*/ 

        // conectar con el websocket manualmente
        this.wsService.conectarWs();

        // configuramos los grupos asignados a la conexion socket
        this.wsService.emit('configurar-usuario', {grupos: this.localStorageService.usuario.usuario.grupos});

        // Limpiamos los valores que tenga el service map
        this.mapService.arrayMarkers = [];
        this.mapService.arrayLatLng = [];
        this.mapService.viajeSeleccionado = [];
        this.mapService.vehiculos = [];
        this.mapService.rootMap = null;
        this.mapService.googleLayer = null;
        this.mapService.controlZoom = null;
        this.mapService.markersGeocercas = [];
        // this.mapService.ciLayer = null;
        // this.mapService.markerInit = null;
        // this.mapService.markerEnd = null;
        this.mapService.markerClusterGroup = null;
        // this.mapService.polyline = null;

        this.cargarMapaLeaflet();
        // this.lugares = [];
        this.marcadores = [];
        this.infoWindows = [];

        this.obtenerVehiculosAsignados();

        this.obtenerModulosAsignados();

        this.escucharSockets();

        this.tamanioVentana();

        this.obtenerColeccionesPorGrupo();

        this.fecha = moment().format('YYYY-MM-DD HH:mm:ss');

        

        // moment diferencia de hora / duracion
        // tslint:disable-next-line: max-line-length
        const ho = moment.duration(moment('2020-5-4T15:00:00', 'YYYY-MM-DD HH:mm:ss').diff(moment('2019-5-4T14:00:00', 'YYYY-MM-DD HH:mm:ss')));

        const horaActual = moment().format('YYYY-MM-DD HH:mm:ss');
        // console.log('hora actual', horaActual);

        // this.loginTemporal();
    }

    loginTemporal() {
        this.restService.login(this.localStorageService.usuario.usuario.usuario, this.localStorageService.usuario.usuario.password).subscribe((response) => {
            // console.log(response);
            // tslint:disable-next-line: no-string-literal
            if (response['token'] !== undefined) {
               
                // console.log('entro a sesion');

                // guardamos la sesion en el localStorage
                this.localStorageService.loginWS(this.localStorageService.usuario.usuario.usuario, response);
                

            } else {
                // console.log('Error en el login');
               
            }
        }, (err) => {
        
        });
    }

    clearSearchField() {
        this.searchText = '';
    }

    trackByFn(index, item) {
        return index; // or item.id
    }

    configuraciones() {
        this.router.navigateByUrl('/configuracion-perfil');
    }

    obtenerTextoIdioma(language) {
        this.restService.obtenerTextoIdioma(language).subscribe((data) => {
            this.localStorageService.guardarLenguaje(data);
            this.obtenerTextoIdiomaEs();
        }, (err) => {
            console.log(err);
        });
    }

    obtenerTextoIdiomaEs() {
        this.restService.obtenerTextoIdioma('es').subscribe((data) => {
            this.localStorageService.guardarLenguajeEs(data);
        }, (err) => {
            console.log(err);
        });
    }

    mostrarErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                // alert('Permiso denegado por el usuario');
                break;
            case error.POSITION_UNAVAILABLE:
                // alert('Posición no disponible');
                break; 
            case error.TIMEOUT:
                // alert('Tiempo de espera agotado');
                break;
            default:
                // alert('Error de Geolocalización desconocido :' + error.code);
        }
    }

    reload() {
        window.location.reload();
    }

    destruirMapaLeaflet() {
        this.mapService.rootMap = null;

        var container = L.DomUtil.get('map');
        
        if (container != null) {
            // console.log('Destruir mapa monitoreo');
            container._leaflet_id = null;
            container = null;
        }

        var elem = document.getElementById('map');
        elem.parentNode.removeChild(elem);
    }

    ngOnDestroy() {

        this.destruirMapaLeaflet();

        // desconectar con el websocket manualmente
        this.wsService.desconectarWs();
    }

    tamanioVentana() {
        if (window.innerWidth > 575) {
            this.streetView = false;
            this.visibilidadViajeEscritorio = true;
        } else {
            this.streetView = true;
            this.visibilidadViajeEscritorio = false;
        }
    }

    isDesktop(): boolean {
        if (window.innerWidth > 575) {
            return true;
        } else {
            return false;
        }
    }

    obtenerVehiculosAsignados() {
        this.loaderVehiculos = true;
        this.cantidadVehiculos = 0;
        this.filteredCount.count = 0;
        // tslint:disable-next-line: max-line-length
        this.subVehiculo =  this.restService.obtenerVehiculosPorUsuarios(this.localStorageService.usuario.usuario.grupos).subscribe((data) => {
            
            // ordernar vehiculos por orden de conexion
            if (this.localStorageService.ordenVehiculos.orden === 'Orden de conexión') {
                data.sort(function(a, b) { return a.inactivityTime - b.inactivityTime; });
            }
            // a partir de este punto se van a utilizar la variable almacenada en el localStorage
            this.localStorageService.guardarVehiculos(data);
            this.vehiculos = this.localStorageService.vehiculos.filter(v => v.visibilidad2 === 1);

            let banderaBadge = false;

            for (const vehiculo of this.localStorageService.vehiculos) {

                // nuevo atributo que solo contendra segundos
                vehiculo.tiempo_inactividad = vehiculo.inactivityTime;

                // console.log('--', vehiculo);
                if (vehiculo.visibilidad2 === 1) {
                    this.agregarMarcadorLeaflet(vehiculo);
                    this.cantidadVehiculos += 1;
                    this.filteredCount.count += 1;
                } else {
                    // console.log('no tiene visibilidad el vehiculo');
                    banderaBadge = true;
                }
                
            }

            this.badgeVehiculo = banderaBadge;

            this.loaderVehiculos = false;

            // agregamos los cluster al mapa
            if (this.localStorageService.monitoreo2.agrupacion === true) {

                this.mapService.markerClusterGroup.on('clustermouseover', (event) => {

                    let html = "<ul style='height: 150px;overflow:auto;padding-left: 26px; font-size: 11px !important'>";
                    for (const v of event.layer.getAllChildMarkers()) {
                        // console.log('v: ', v.options.title);
                        html += `<li>${v.options.title}</li>`;
                    }
                    html += '</ul>';

                    this.popupLista = L.popup()
                                    .setLatLng([event.latlng.lat, event.latlng.lng])
                                    .setContent(html)
                                    .openOn(this.mapService.rootMap);
                });

                this.mapService.markerClusterGroup.on('clustermouseout', (event) => {
                    
                });

                this.mapService.rootMap.addLayer(this.mapService.markerClusterGroup);
                
            }
            // console.log('vehiculo: ', this.vehiculos);

            // Obtiene la información almacenada desde sessionStorage
            var dataV = JSON.parse(sessionStorage.getItem('vehiculo-seleccionado'));
            
            if (dataV) {
                console.log('sesion storage: ',  dataV);
                this.seguirA(dataV);
                this.live(dataV.imei, dataV);
            } else {
                // console.log('no esta definido la variable', data);
            }
        }, (err) => {
            console.log(err);
        });
    }

    cargarVehiculosLocalStorage() {

        this.loaderVehiculos = true;
        this.cantidadVehiculos = 0;
        this.filteredCount.count = 0;

        // a partir de este punto se van a utilizar la variable almacenada en el localStorage
        this.localStorageService.guardarVehiculos(this.localStorageService.vehiculos);
        this.vehiculos = this.localStorageService.vehiculos.filter(v => v.visibilidad2 === 1);

        let banderaBadge = false;

        for (const vehiculo of this.localStorageService.vehiculos) {

            // console.log('--', vehiculo);
            if (vehiculo.visibilidad2 === 1) {
                this.agregarMarcadorLeaflet(vehiculo);
                this.cantidadVehiculos += 1;
                this.filteredCount.count += 1;
            } else {
                // console.log('no tiene visibilidad el vehiculo');
                banderaBadge = true;
            }
            
        }

        this.badgeVehiculo = banderaBadge;

        this.loaderVehiculos = false;
        
        // agregamos los cluster al mapa
        if (this.localStorageService.monitoreo2.agrupacion === true) {

            this.mapService.markerClusterGroup.on('clustermouseover', (event) => {

                let html = "<ul style='height: 150px;overflow:auto;padding-left: 26px;'>";
                for (const v of event.layer.getAllChildMarkers()) {
                    // console.log('v: ', v.options.title);
                    html += `<li>${v.options.title}</li>`;
                }
                html += '</ul>';

                this.popupLista = L.popup()
                                .setLatLng([event.latlng.lat, event.latlng.lng])
                                .setContent(html)
                                .openOn(this.mapService.rootMap);
            });

            this.mapService.markerClusterGroup.on('clustermouseout', (event) => {
                
            });

            this.mapService.rootMap.addLayer(this.mapService.markerClusterGroup); 
        }

    }

    obtenerModulosAsignados() {
        this.subObtenerModulos = this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            this.modulos = data;

        }, (err) => {
            console.log(err);
        });
    }


    cargarMapaLeaflet() {

        // agregamos mapa al componente *******************************************************************************************
        // cargamos mapa de leaflet con capa de google map
        // Note the difference in the "lyrs" parameter in the URL:
        // Hybrid: s,h;
        // Satellite: s;
        // Streets: m;
        // Terrain: p;
        this.mapService.rootMap =  L.map('map', {
            zoomControl: false,
            center: new L.LatLng(13.701170, -89.224402),
            zoom: 14,
            editable: true,
            updateWhenIdle: false,
            keepBuffer: 10,
            updateWhenZooming: true,
            opacity: 1,
            updateInterval: 0,
            errorTileUrl: 'No se pudo cargar la vista',
            preferCanvas: true, // 
            renderer: L.canvas()
        });

        // Cargamos el layer de google maps ***************************************************************************************
        this.mapService.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.mapService.rootMap);

        // agregamos el tooltip al mapa ***************************************************************************************
        this.mapService.tooltip = L.tooltip({
            position: 'left',
            noWrap: true
        }).addTo(this.mapService.rootMap).setLatLng(new L.LatLng(0, 0));

        // Agregamos los controles de zoom al mapa *********************************************************************************
        this.mapService.controlZoom = L.control.zoom({
            position: 'bottomright'
        }).addTo(this.mapService.rootMap);

        // Agregamos eventos al mapa para poder gestionar la Creación, edición, lectura y eliminación de geocercas ****************
        // EVENTO CREACION DE GEOCERCA (se ejecuta cuando se crea la forma)
        this.mapService.rootMap.on(L.Draw.Event.CREATED, (event) => {
            // tipo de layer creado
            switch (event.layerType) {
            case 'circle':

                // tslint:disable-next-line: max-line-length
                let circle = new L.circle([event.layer._latlng.lat, event.layer._latlng.lng], event.layer._mRadius)
                
                circle.type = 'G';
                circle.addTo(this.mapService.rootMap);
                // insertamos el marcador circular al array de markers Circles
                this.mapService.markersGeocercas.push({id: circle._leaflet_id, marker: circle});

                // Llamamos al metodo crear geocerca circular
                this.agregarNuevaGeoCercaCiruclar(event.layer._mRadius, event.layer._latlng);
                break;
            case 'polygon':

                let polygon = L.polygon(event.layer._latlngs[0]);
                polygon.type = 'G';
                polygon.addTo(this.mapService.rootMap);

                this.mapService.markersGeocercas.push({id: polygon._leaflet_id, marker: polygon});
                this.mapService.rootMap.addLayer(polygon);

                // Llamamo al metodo crear geocerca poligonal
                this.agregarNuevaGeoCercaPoligonal(event.layer._latlngs[0]);
            }
        });

        // EVENTO SE EJECUTA CUANDO SE HABILITA UN LAYER PARA EDITAR (EDITABLE)
        this.mapService.rootMap.on('editable:enable', (e) => {
            // habiltamos botones de eliminacion y guardado de datos
            // console.log('editar poligonal o circularv : ', e);
            // this.viewDeleteGeocerca = true;
            this.viewSaveGeocerca = true;
            this.idLeafletSeleccionado = e.layer._leaflet_id;
            // console.log('inicio la edicion, idLeaflet: ', e.layer._leaflet_id);
            if (e.layer._latlngs === undefined ) {
                // console.log('edicion geiocerca circular');
                const radio = parseFloat(String(e.layer._mRadius)).toFixed(1);
                const lat =  parseFloat(String(e.layer._latlng.lat)).toFixed(7);
                const lng =  parseFloat(String(e.layer._latlng.lng)).toFixed(7);
                const text = `  <p style="color:white; margin-bottom:0px">
                                    Radio: ${radio} m
                                </p>
                                <p style="color:white; margin-bottom:0px">
                                    Coordenadas: ${lat} , ${lng}
                                </p>`;
                this.mapService.tooltip.setContent('text').setLatLng(new L.LatLng(e.layer._latlng.lat, e.layer._latlng.lng));
                this.mapService.tooltip.show();
                this.openSnackBar1();
            } else {
                /*console.log('edicion geocerca poligonal');
                console.log('edicion geiocerca circular');
                const lat =  parseFloat(String(e.layer._bounds._southWest.lat)).toFixed(7);
                const lng =  parseFloat(String(e.layer._bounds._southWest.lng)).toFixed(7);
                const text = `  <p style="color:white; margin-bottom:0px">
                                    Coordenadas: ${lat} , ${lng}
                                </p>`;
                // tslint:disable-next-line: max-line-length
                this.mapService.tooltip.setContent(text).setLatLng(new L.LatLng(e.layer._bounds._southWest.lat, e.layer._bounds._southWest.lng));
                this.mapService.tooltip.show();*/
                this.openSnackBar1();
            }

        });

        // EVENTO SE EJECUTA CUANDO SE DESABILITA UN LAYER PARA EDITAR (EDITABLE)
        this.mapService.rootMap.on('editable:disable', (e) => {

            // console.log('actualizar geocerca', e);
            if (e.layer._latlngs === undefined ) {
                const radio = parseFloat(String(e.layer._mRadius)).toFixed(1);
                const lat =  parseFloat(String(e.layer._latlng.lat)).toFixed(7);
                const lng =  parseFloat(String(e.layer._latlng.lng)).toFixed(7);
                const text = `  <p style="color:white; margin-bottom:0px">
                                    Radio: ${radio} m
                                </p>
                                <p style="color:white; margin-bottom:0px">
                                    Coordenadas: ${lat} , ${lng}
                                </p>`;
                this.mapService.tooltip.setContent(text).setLatLng(new L.LatLng(e.layer._latlng.lat, e.layer._latlng.lng));
                this.mapService.tooltip.hide();
                this.closeSnackBar();
                this.editarGeocercaCircular(e.layer);
            } else {
                this.editarGeocercaCircular(e.layer);
            }
        });

        // EVENTO SE EJECUTA CUANDO SE TERMINA DE MOVER UNA GEOCERCA (EDITABLE)
        this.mapService.rootMap.on('editable:dragend', (e) => {
            if (e.layer._latlngs === undefined ) {
                const radio = parseFloat(String(e.layer._mRadius)).toFixed(1);
                const lat =  parseFloat(String(e.layer._latlng.lat)).toFixed(7);
                const lng =  parseFloat(String(e.layer._latlng.lng)).toFixed(7);
                const text = `  <p style="color:white; margin-bottom:0px">
                                    Radio: ${radio} m
                                </p>
                                <p style="color:white; margin-bottom:0px">
                                    Coordenadas: ${lat} , ${lng}
                                </p>`;
                this.mapService.tooltip.setContent(text).setLatLng(new L.LatLng(e.layer._latlng.lat, e.layer._latlng.lng));
                this.mapService.tooltip.show();
            } else {
                console.log(e);
            }

        });

        // EVENTO SE EJECUTA CUANDO COMIENZA UN EDITADO DE GEOCERCA (EDITABLE)
        this.mapService.rootMap.on('editable:editing', (e) => {
            // console.log('modificacion de puntos');
            if (e.layer._latlngs === undefined ) {
                const radio = parseFloat(String(e.layer._mRadius)).toFixed(1);
                const lat =  parseFloat(String(e.layer._latlng.lat)).toFixed(7);
                const lng =  parseFloat(String(e.layer._latlng.lng)).toFixed(7);
                const text = `  <p style="color:white; margin-bottom:0px">
                                    Radio: ${radio} m
                                </p>
                                <p style="color:white; margin-bottom:0px">
                                    Coordenadas: ${lat} , ${lng}
                                </p>`;
                this.mapService.tooltip.setContent(text).setLatLng(new L.LatLng(e.layer._latlng.lat, e.layer._latlng.lng));
                this.mapService.tooltip.show();
            } else {
                console.log(e);
            }

        });

        // evaluamos que tenga la agrupacion de marker activado 
        if (this.localStorageService.monitoreo2.agrupacion === true) {
            // cargamos los marker cluster group
            this.mapService.markerClusterGroup = L.markerClusterGroup({
                /*spiderfyOnMaxZoom: false,
                removeOutsideVisibleBounds: true,
                showCoverageOnHover: false,
                animateAddingMarkers: true,*/
                spiderfyOnMaxZoom: true,
                animate: true,
                chunkedLoading: true,
                disableClusteringAtZoom: 19,
                removeOutsideVisibleBounds: true
            });
        }

        // virtualizacion de marcadores
        // this.mapService.ciLayer = L.canvasIconLayer({}).addTo(this.mapService.rootMap);

        // ------------------------------------------------------------------
        // evento para cambiar tamaño de circle segun zoom
        this.mapService.rootMap.on('zoomend', (e) => {

            this.mapService.rootMap.eachLayer((layer) => {

                // evaluamos instancias de ExtraMarkers
                if(layer instanceof L.CircleMarker ) {

                    // console.log(layer.type);
                    if (layer.type == undefined) {
                        this.mapService.zoomCircleMarker(layer);
                    }
                }

                if(layer instanceof L.Marker ) {
                    if (layer.name !== 'A' && layer.name !== 'B' && layer.name !== 'M' && layer.name !== undefined) {
                        const iconDiv = L.divIcon({
                            className: this.mapService.getSizeIconPhotoCamera(),
                            html: `<i class='material-icons' style="color: ${layer.color_icon}">${layer.name_icon}</i>`,
                            text: 'texto'
                        });
                        layer.setIcon(iconDiv);
                    }
                    
                }
            });
        });
        // ------------------------------------------------------------------

        // evento click para utilizarlo con socket
        /*this.mapService.rootMap.on('click', (e) => {     
            var popLocation= e.latlng;
            /*var popup = L.popup()
            .setLatLng(popLocation)
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
            .openOn(this.mapService.rootMap);*
            
            this.markerTaxi.setLatLng(popLocation);
            
            const payload = {
                lat: popLocation.lat,
                lng: popLocation.lng,
                id: 0,
            };
            
            console.log('emitir; ', popLocation.lat);
            this.wsService.emit('mover-taxi', payload);
  
            //this.markerTaxi = L.marker([latitud, longitud], {icon: redMarker}).addTo(this.mapService.rootMap);
        });*/

        // var myRenderer = L.canvas({ padding: 0.5 });
        /*var circleMarker = L.circle([13.701170, -89.224402], {
            color: '#3388ff',
            radius: 90,
            stroke: true,
            opacity: 1,
            weight: 1,
            fill: true,
            fillColor: '#1A31E2',
            fillOpacity: 1
        }).addTo(this.mapService.rootMap);*/

        /*var redMarker = L.ExtraMarkers.icon({
            shape: 'circle',
            markerColor: 'cyan',
            prefix: 'icon',
            icon: 'add sign',
            iconColor: 'red',
            iconRotate: 0,
            extraClasses: '',
            number: '',
            svg: true
        });

        // agregamos un marcador
        const marker = L.marker([13.701170, -89.224402], {icon: redMarker}).addTo(this.mapService.rootMap);*/

          // Creates a red marker with the coffee icon
        /*var redMarker = L.ExtraMarkers.icon({
            icon: 'fa-taxi',
            markerColor: 'yellow',
            shape: 'circle',
            prefix: 'fa',
            iconColor: 'black'
        });*/

        // this.markerTaxi = L.marker([13.699495, -89.204920], {icon: redMarker}).addTo(this.mapService.rootMap);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((posicion) => {

                // console.log('POSICION USUARIO: ', posicion);
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;
                const precision = posicion.coords.accuracy;
                const fecha = new Date(posicion.timestamp);
                this.mapService.rootMap.setView([latitud, longitud]);

                //


            }, this.mostrarErrores, this.opciones);
        } else {
            // alert("Tu navegador no soporta la geolocalización, actualiza tu navegador.");
        }
    }

    agregarMarcadorLeaflet(marcador: any) {

        var iconMarker = L.ExtraMarkers.icon({
            icon: 'fa-taxi',
            markerColor: 'yellow',
            shape: 'circle',
            prefix: 'fa',
            iconColor: 'black'
        });

        // PASO 1: CREAMOS UN MARCADOS NUEVO *************************************************************************************
        // creamos una variable que contendra la referencia del marcador
        // let marker;
        
        // Asignamos la direccion en grados para el marcador
        const deg = Number(marcador.ult_direccion);

        const iconDiv = L.divIcon({
            className: 'custom-div-icon',
            html: `<i class='material-icons' style="transform: rotate(${deg}deg) !important;">navigation</i>`,
        });

        

        // evaluamos que tenga la agrupacion de marker activado
        if (this.localStorageService.monitoreo2.agrupacion === true) {
            this.markerTaxi = L.marker(L.latLng(marcador.ult_lat, marcador.ult_lng), {
                icon: iconMarker,
                title: `${marcador.nombre}`,
            });
            // simbolo de M de monitoreo para que no afecte el zoom del mapa
            this.markerTaxi.name = 'M';
            this.markerTaxi.type = 'v';
        } else {

            // Creamos el marcador y agregando el icono personalizado que tendra el marker.
            this.markerTaxi = L.marker([marcador.ult_lat, marcador.ult_lng], {
                icon: iconMarker,
                title: `${marcador.nombre}`,
            });

            // simbolo de M de monitoreo para que no afecte el zoom del mapa
            this.markerTaxi.name = 'M';
            this.markerTaxi.type = 'v';
            this.markerTaxi.addTo(this.mapService.rootMap);
        }
        
        // evaluamos si tiene habilitado el titulo visible siempre
        if (this.localStorageService.monitoreo.tituloMarcador) {

            // si es verdadero, añadimos el titulo en el marker de una forma personalizado
            this.markerTaxi.bindTooltip(`${marcador.nombre}`, {
                permanent: true,
                direction : 'bottom',
                className: 'class-tooltip',
                offset: [0, 10],
                height: '5'
            });
        }

        // PASO 2: CONVERTIMOS EL TIEMPO SIN REPORTAR *****************************************************************************
        // buscamos el vehiculo al cual vamos actualizarle los datos
        const vehiculo = this.localStorageService.vehiculos.find( evento => evento.imei === marcador.imei );
        // console.log('vehiculo en marcador: ', vehiculo);
        vehiculo.inactivityTime = this.mapService.tiempoSinConexion(vehiculo.tiempo_inactividad, this.localStorageService.lenguaje.lan274, this.localStorageService.lenguaje.lan266);

        // PASO 3: EVALUAMOS SI ESTA APAGADO O ENCENDIDO EL VEHICULO **************************************************************
        let onOff = '';
        let apagadoEncendido = '';
        let labelParkingMoving = '';
        let iconParkingMoving = '';

        if (marcador.ign === 'on') {
            onOff = 'green';
            apagadoEncendido = this.localStorageService.lenguaje.lan101;
            // veh.colorConexion = 'green';
            // tslint:disable-next-line: max-line-length
            labelParkingMoving = this.mapService.tiempoMovimiento(marcador.ign, marcador.timerMoving, this.localStorageService.lenguaje.lan273, this.localStorageService.lenguaje.lan272);
            iconParkingMoving = 'fas fa-location-arrow';
        } else {
            if (marcador.ign === 'off') {
                onOff = 'red';
                apagadoEncendido = this.localStorageService.lenguaje.lan102;
                // veh.colorConexion = 'red';
                // tslint:disable-next-line: max-line-length
                labelParkingMoving = this.mapService.tiempoParqueo(marcador.ign, marcador.timerParking, this.localStorageService.lenguaje.lan274, this.localStorageService.lenguaje.lan104, this.localStorageService.lenguaje.lan275);
                iconParkingMoving = 'fas fa-parking';
            }
        }

        // PASO 4: EVALUAMOS EL TIEMPO DE PARQUEO SI ESTA APAGADO *****************************************************************
        // const labelParking = this.mapService.tiempoParqueo(marcador.ign, marcador.timerParking);

        // PASO 5: VERIFICACION DE STATUS, ONLINE - OFFLINE ***********************************************************************
        // online /offline
        let textOnline = '';
        let colorOnline = '';
        if (String(marcador.online) === 'true') {
            textOnline = 'ONLINE';
            colorOnline = 'green';
            vehiculo.colorConexion = 'green';
        } else {
            textOnline = 'OFFLINE';
            colorOnline = 'red';
            vehiculo.colorConexion = 'red';
        }

        // PASO 6: CONVERTIMOS LA HORA *********************************************************************************************
        // tslint:disable-next-line: max-line-length
        const horaConvertida = this.mapService.converterUTCToLocalDate(marcador.ult_event_time) + ' ' + this.mapService.convertAmPm(this.mapService.converterUTCToLocalTime(marcador.ult_event_time));

        // texto marcado temporal de direccion:
        marcador.address = 'Resolviendo dirección ...';
        // convertimos la velocidad de millas/h a km/h
        const velocidadKMporHora = parseFloat(String(Number(marcador.ult_vel) * 1.609)).toFixed(1);

        // PASO 7: Crear POPUP para el marcador *************************************************************************************
        
        // insertamos el texto de traducion ingles o español
        const textoTraductor = {
            conexion: this.localStorageService.lenguaje.lan096,
            hace: this.localStorageService.lenguaje.lan266,
            viajandoPor: this.localStorageService.lenguaje.lan272
        };
        // tslint:disable-next-line: max-line-length
        const contenido = this.mapService.contenidoPopupMarker(textoTraductor, marcador.nombre, colorOnline, textOnline, vehiculo.inactivityTime, marcador.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, marcador.address, 'No geocerca', iconParkingMoving, marcador.ult_BL, marcador.fuente, marcador.imei, marcador.nombre_conductor, marcador.fecha_fuente);

        // Agregamos el contenido al popup marker recien creado
        // este popup sera modificado mas adelante por el socket.io
        this.markerTaxi.bindPopup(contenido);
        
        this.markerTaxi.on('click', (e) => {
            this.seguirA(marcador);
            this.ultDireccionSeleccionada = 'Resolviendo dirección ...';
            this.ultGeocercaSeleccionada = 'No geocerca';
        });

        // PASO 8: Agregamos el marcador recien creado a un array de marker donde posteriormente vamos a estar actualizando
        // creamos un objeto de arrayMarker
        const arrMarker: ArrayMarkers = {
            id: Number(marcador.imei),
            marker: this.markerTaxi
        };

        // console.log('array markers: ', arrMarker);

        // insertamos el marker en el array
        this.mapService.arrayMarkers.push(arrMarker);

        if (this.localStorageService.monitoreo2.agrupacion === true) {
            // añadimos el marcador en el mapa
            // agregamos el marker en el markerGroups
            this.mapService.markerClusterGroup.addLayer(this.markerTaxi);
        }

        // Adding marker to layer
        // this.mapService.ciLayer.addMarker(marker);

        if (this.entroADetalleEvento) {
            this.markerTaxi.addTo(this.mapService.rootMap);  
            this.seguirA(vehiculo);
        }
    }

    cambiarLayer(layer: string) {
        switch (layer) {
            case 'roadmap':
                this.mapService.rootMap.removeLayer(this.mapService.googleLayer);
                this.mapService.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    reuseTiles: true,
                    updateWhenIdle: true,
                    keepBuffer: 2
                }).addTo(this.mapService.rootMap);
                break;
            case 'traffic':
                this.mapService.rootMap.removeLayer(this.mapService.googleLayer);
                this.mapService.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    reuseTiles: true,
                    updateWhenIdle: true,
                    keepBuffer: 2
                }).addTo(this.mapService.rootMap);
                break;
            case 'terrain':
                this.mapService.rootMap.removeLayer(this.mapService.googleLayer);
                this.mapService.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    reuseTiles: true,
                   updateWhenIdle: true,
                    keepBuffer: 2
                }).addTo(this.mapService.rootMap);
                break;
            case 'hybrid':
                this.mapService.rootMap.removeLayer(this.mapService.googleLayer);
                this.mapService.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    reuseTiles: true,
                    updateWhenIdle: true,
                    keepBuffer: 2
                }).addTo(this.mapService.rootMap);
                break;
            case 'leaflet':
                this.mapService.rootMap.removeLayer(this.mapService.googleLayer);
                this.mapService.googleLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    reuseTiles: true,
                    updateWhenIdle: true,
                    keepBuffer: 2
                }).addTo(this.mapService.rootMap);
                break;
        }
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    ngAfterViewInit() {
        // Recién en este punto tendrás acceso al valor
        // console.log('ancho de la pantalla', this.main.nativeElement.offsetWidth);
    }


    escucharSockets() {

        /*this.subWsPrueba = this.wsService.listen('mensaje-privado').subscribe((data: any) => {
            console.log('Data pausado socket io (mensaje privado):', data);
        });*/

        // marcador mover (cambia posicion)
        this.subWsMarcadorMover = this.wsService.listen('marcador-mover').subscribe((device: any) => {

            var iconMarker = L.ExtraMarkers.icon({
                icon: 'fa-taxi',
                markerColor: device.color,
                shape: 'circle',
                prefix: 'fa',
                iconColor: 'black'
            });
    

            console.log('reciviendo posicion: ', device);
            // buscamos coincidencia en arrayMarkers para actualizar el popup y posicion en el mapa
            const marker = this.mapService.arrayMarkers.find(mark => mark.id === Number(device.imei));

            // evaluamos si existe el vehiculo
            if (marker !== undefined) {
                // PASO 0: HACEMOS REFERECIA AL VEHICULO ******************************************************************
                const vehiculo = this.localStorageService.vehiculos.find( evento => evento.imei === device.imei );

                if (vehiculo !== undefined) {

                    // PASO 1: MOVEMOS EL MAPA A UN MARKER SELECCIONADO (solo para uno) **************************************
                    if (Number(this.vehiculoASeguir) === Number(device.imei)) {
                        // mover el mapa a un marker
                        // this.mapService.rootMap.panTo([device.ult_lat, device.ult_lng]);
                        // this.mapService.rootMap.setView([device.ult_lat + 0.000255, device.ult_lng]);
                        if (this.localStorageService.monitoreo3.popupZoom) {
                            this.mapService.rootMap.setView([device.ult_lat, device.ult_lng]);
                        } else {
                            this.mapService.rootMap.setView([device.ult_lat, device.ult_lng]);
                        }
                    }

                    // PASO 2: RESOLVEMOS EL TIEMPO SIN CONEXION *************************************************************
                    // a la vez actualizamos la data en el dispositivo
                    // nuevo atributo que solo contendra segundos
                    vehiculo.tiempo_inactividad = device.inactivityTime;
                    vehiculo.inactivityTime = this.mapService.tiempoSinConexion(vehiculo.tiempo_inactividad,this.localStorageService.lenguaje.lan274, this.localStorageService.lenguaje.lan266);

                    // PASO 3: ACTUALIZAMOS DATA VEHICULO *********************************************************************
                    vehiculo.id_conexion =  device.id_conexion;
                    vehiculo.ult_lat = device.ult_lat;
                    vehiculo.ult_lng =  device.ult_lng;
                    vehiculo.timerParking = device.timerParking;
                    vehiculo.timerMoving = device.timerMoving;
                    vehiculo.ign = device.ign;
                    vehiculo.ult_vel = device.ult_vel;
                    vehiculo.online = device.online;
                    vehiculo.ult_evento = device.ult_evento;
                    vehiculo.ult_BL = device.ult_BL;
                    vehiculo.fuente = device.fuente;
                    vehiculo.distancia_recorrida = device.distancia_recorrida;

                    // PASO 4: EVALUAMOS LA IGNICION ENCENDIDA O APAGADA ******************************************************
                    let onOff = '';
                    let apagadoEncendido = '';
                    let labelParkingMoving = '';
                    let iconParkingMoving = '';

                    if (device.ign === 'on') {
                        onOff = 'green';
                        apagadoEncendido = this.localStorageService.lenguaje.lan101;
                        // veh.colorConexion = 'green';
                        // tslint:disable-next-line: max-line-length
                        labelParkingMoving = this.mapService.tiempoMovimiento(device.ign, device.timerMoving, this.localStorageService.lenguaje.lan273, this.localStorageService.lenguaje.lan272);
                        iconParkingMoving = 'fas fa-location-arrow';
                    } else {
                        if (device.ign === 'off') {
                            onOff = 'red';
                            apagadoEncendido = this.localStorageService.lenguaje.lan101;
                            // veh.colorConexion = 'red';
                            labelParkingMoving = this.mapService.tiempoParqueo(device.ign, device.timerParking, this.localStorageService.lenguaje.lan274, this.localStorageService.lenguaje.lan104, this.localStorageService.lenguaje.lan275);
                            iconParkingMoving = 'fas fa-parking';
                        }
                    }

                    // PASO 5: CALCULAMOS EL TIEMPO DE PARQUEO ****************************************************************
                    // const labelParking = this.mapService.tiempoParqueo(device.ign, device.timerParking);

                    // PASO 6: EVALUAMOS SI ESTA OFFLINE - ONLINE *************************************************************
                    let textOnline = '';
                    let colorOnline = '';

                    if (String(device.online) === 'true') {
                        textOnline = 'ONLINE';
                        colorOnline = 'green';
                        vehiculo.colorConexion = 'green';
                    } else {
                        textOnline = 'OFFLINE';
                        colorOnline = 'red';
                        vehiculo.colorConexion = 'red';
                    }

                    // PASO 7: ACTUALIZAMOS LA POSICION DEL MARKER EN EL MAPA ************************************************
                    // este paso actualizara la posicion del marker mas no moverá el mapa hacia él
                    marker.marker.setLatLng([device.ult_lat, device.ult_lng]);
                    // PASO 12:  Actualizamos la direccion del marker
                    const deg = Number(device.ult_direccion);

                    // creamos un marker personalizados con html
                    const iconDiv = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<i class='material-icons blob red' style="transform: rotate(${deg}deg) !important;">navigation</i>`,
                    });
                    marker.marker.setIcon(iconMarker);
                    
                    // convertimos la velocidad de millas/h a km/h
                    const velocidadKMporHora = parseFloat(String(Number(device.ult_vel) * 1.609)).toFixed(1);

                    

                    // PASO 9: CONVERTIMOS LA HORA UTC A LOCAL ***************************************************************
                    // tslint:disable-next-line: max-line-length
                    const horaConvertida = this.mapService.converterUTCToLocalDate(device.ult_event_time) + ' ' + this.mapService.convertAmPm(this.mapService.converterUTCToLocalTime(device.ult_event_time));

                    // PASO 1: CONVERTIMOS COORDENADAS EN DIRECCION FISICA *******************************************************
                    // tener en cuenta que retorna una promesa y hay que resolverla como tal
                    if (Number(this.vehiculoASeguir) === Number(device.imei)) {
                        if (this.eventoDentroGeocerca(device.ult_lat, device.ult_lng) !== '') {
                            const nomGeo = this.eventoDentroGeocerca(device.ult_lat, device.ult_lng);

                           
                            // evaluamos si el usuario tiene asignado direcciones mas exacta con la api de google maps
                            // especificamente la api de reverse geocoding
                            // esta caracteristica lo tiene configurado el cliente osea el usuario 
                            // la propiedad para habilitar la api de google es 
                            // API: reverse geocoding
                            // propiedad usuario: api_google
                            if (this.localStorageService.usuario.usuario.api_google === 1) {
                                this.mapService.geocodeLatLng(device.ult_lat, device.ult_lng).then((direccion => {

                                    this.ultDireccionSeleccionada = direccion;
                                    this.ultGeocercaSeleccionada = nomGeo;
                                    // PASO 10: ACTUALIZAMOS DATA DE POPUP
                                    // insertamos el texto de traducion ingles o español
                                    const textoTraductor = {
                                        conexion: this.localStorageService.lenguaje.lan096,
                                        hace: this.localStorageService.lenguaje.lan266,
                                        viajandoPor: this.localStorageService.lenguaje.lan272
                                    };
                                    // tslint:disable-next-line: max-line-length
                                    const contenido = this.mapService.contenidoPopupMarker(textoTraductor,device.nombre, colorOnline, textOnline, vehiculo.inactivityTime, device.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, direccion, nomGeo, iconParkingMoving, device.ult_BL, device.fuente, device.imei, device.nombre_conductor, device.fecha_fuente);

                                    // tslint:disable-next-line: max-line-length
                                    // PASO 11: INSERTAMOS EL CONTENIDO ACTUALIZADO EN EL POPUP DEL MARKER SELECCIONADO *********************
                                    marker.marker.getPopup().setContent(contenido);
                                })).catch((err) => {
                                    console.log(err);
                                });
                            } else {
                                this.mapService.geocodeLatLngNominatimLocal(device.ult_lat, device.ult_lng).then((direccion => {

                                    this.ultDireccionSeleccionada = direccion;
                                    this.ultGeocercaSeleccionada = nomGeo;
                                    // PASO 10: ACTUALIZAMOS DATA DE POPUP
                                    // insertamos el texto de traducion ingles o español
                                    const textoTraductor = {
                                        conexion: this.localStorageService.lenguaje.lan096,
                                        hace: this.localStorageService.lenguaje.lan266,
                                        viajandoPor: this.localStorageService.lenguaje.lan272
                                    };
                                    // tslint:disable-next-line: max-line-length
                                    const contenido = this.mapService.contenidoPopupMarker(textoTraductor, device.nombre, colorOnline, textOnline, vehiculo.inactivityTime, device.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, direccion, nomGeo, iconParkingMoving, device.ult_BL, device.fuente, device.imei, device.nombre_conductor, device.fecha_fuente);

                                    // tslint:disable-next-line: max-line-length
                                    // PASO 11: INSERTAMOS EL CONTENIDO ACTUALIZADO EN EL POPUP DEL MARKER SELECCIONADO *********************
                                    marker.marker.getPopup().setContent(contenido);
                                })).catch((err) => {
                                    console.log(err);
                                });
                            } 
                        } else {
                            // evaluamos si el usuario tiene asignado direcciones mas exacta con la api de google maps
                            // especificamente la api de reverse geocoding
                            // esta caracteristica lo tiene configurado el cliente osea el usuario 
                            // la propiedad para habilitar la api de google es 
                            // API: reverse geocoding 
                            // propiedad usuario: api_google
                            if (this.localStorageService.usuario.usuario.api_google === 1) {
                                this.mapService.geocodeLatLng(device.ult_lat, device.ult_lng).then((direccion => {

                                    this.ultDireccionSeleccionada = direccion;
                                    this.ultGeocercaSeleccionada = 'No geocerca';
                                    // PASO 10: ACTUALIZAMOS DATA DE POPUP
                                    // insertamos el texto de traducion ingles o español
                                    const textoTraductor = {
                                        conexion: this.localStorageService.lenguaje.lan096,
                                        hace: this.localStorageService.lenguaje.lan266,
                                        viajandoPor: this.localStorageService.lenguaje.lan272
                                    };
                                    // tslint:disable-next-line: max-line-length
                                    const contenido = this.mapService.contenidoPopupMarker(textoTraductor, device.nombre, colorOnline, textOnline, vehiculo.inactivityTime, device.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, direccion, 'No geocerca', iconParkingMoving, device.ult_BL, device.fuente, device.imei, device.nombre_conductor, device.fecha_fuente);

                                    // tslint:disable-next-line: max-line-length
                                    // PASO 11: INSERTAMOS EL CONTENIDO ACTUALIZADO EN EL POPUP DEL MARKER SELECCIONADO *********************
                                    marker.marker.getPopup().setContent(contenido);
                                })).catch((err) => {
                                    console.log(err);
                                });
                            } else {
                                this.mapService.geocodeLatLngNominatimLocal(device.ult_lat, device.ult_lng).then((direccion => {

                                    this.ultDireccionSeleccionada = direccion;
                                    this.ultGeocercaSeleccionada = 'No geocerca';
                                    // PASO 10: ACTUALIZAMOS DATA DE POPUP
                                    // insertamos el texto de traducion ingles o español
                                    const textoTraductor = {
                                        conexion: this.localStorageService.lenguaje.lan096,
                                        hace: this.localStorageService.lenguaje.lan266,
                                        viajandoPor: this.localStorageService.lenguaje.lan272
                                    };
                                    // tslint:disable-next-line: max-line-length
                                    const contenido = this.mapService.contenidoPopupMarker(textoTraductor, device.nombre, colorOnline, textOnline, vehiculo.inactivityTime, device.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, direccion, 'No geocerca', iconParkingMoving, device.ult_BL, device.fuente, device.imei, device.nombre_conductor, device.fecha_fuente);

                                    // tslint:disable-next-line: max-line-length
                                    // PASO 11: INSERTAMOS EL CONTENIDO ACTUALIZADO EN EL POPUP DEL MARKER SELECCIONADO *********************
                                    marker.marker.getPopup().setContent(contenido);
                                })).catch((err) => {
                                    console.log(err);
                                });
                            }
                            
                        }

                    }

                }
            }
        });

        this.wsService.listen('mover-taxi').subscribe((taxi) => {
            console.log('se movio taxi: ', taxi);
            this.markerTaxi.setLatLng([taxi['lat'], taxi['lng']]);
        });

    }

    // recibe como parametro el imei del vehiculo
    seguirA(event) {

        this.vehiculoSeleccionado = event;

        // evaluamos si habia un imei antes seleccionado para quitar el estilo  de pulso
        if (this.imeiAntesSeleccionado !== '') {
            
            const markerConPulso = this.mapService.arrayMarkers.find(mark => mark.id === Number(this.imeiAntesSeleccionado));
            
            if (markerConPulso !== undefined) {
                
                const deg = Number(this.direccionAntesSeleccionado);
                
                var iconMarker = L.ExtraMarkers.icon({
                    icon: 'fa-taxi',
                    markerColor: 'yellow',
                    shape: 'circle',
                    prefix: 'fa',
                    iconColor: 'black'
                });

                const iconDiv = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<i class='material-icons' style="transform: rotate(${deg}deg) !important;">navigation</i>`,
                });
                
                markerConPulso.marker.setIcon(iconMarker);
            }
        }

        // console.log(Object.keys(this.mapService.rootMap._layers).length);
        // habilitamos el contenedor de detalle
        this.detalleVehiculo = true;

        // const nuevoLatMap = event.ult_lat + 0.000955;
        if (this.localStorageService.monitoreo3.popupZoom) {
            this.mapService.rootMap.setView([event.ult_lat + 0.008655, event.ult_lng]);
        } else {
            this.mapService.rootMap.setView([event.ult_lat + 0.000255, event.ult_lng]);
        }

        // si es un evento 75 activamos el boton de camara de nuevo
        this.imeiSeleccionado = event.imei;
        this.imeiAntesSeleccionado = event.imei;
        this.direccionAntesSeleccionado = event.ult_direccion;

        this.botonCamaraDesabilidato = false;

        // asignar el imei que vehiculo seguir en el mapa
        this.vehiculoASeguir = event.imei;

        // PASO 0: HACEMOS REFERECIA AL VEHICULO ******************************************************************
        const marker = this.mapService.arrayMarkers.find(mark => mark.id === Number(event.imei));

        // evaluamos que el vehículo buscado exista
        if (marker !== undefined) {

            const contenidoEspera = this.mapService.contenidoPopupEspera();

            marker.marker.bindPopup(contenidoEspera).openPopup();

            const deg = Number(event.ult_direccion);

            // actualizamos el marcador icono con pulso
            const iconDiv = L.divIcon({
                className: 'custom-div-icon',
                html: `<i class='material-icons blob red' style="transform: rotate(${deg}deg) !important;">navigation</i>`,
            });

            var iconMarker = L.ExtraMarkers.icon({
                icon: 'fa-taxi',
                markerColor: 'yellow',
                shape: 'circle',
                prefix: 'fa',
                iconColor: 'black'
            });
            
            marker.marker.setIcon(iconMarker);

            // PASO 1: BUSCAMOS MARKER PARA ABRIR POPUP
            // buscamos coincidencia en arrayMarkers para actualizar el popup y posicion en el mapa

            const vehiculo = this.localStorageService.vehiculos.find( evento => evento.imei === event.imei );
            // console.log('vehiculo a seguir: ', vehiculo);
            if (vehiculo !== undefined) {
                
                // evaluamos si el usuario tiene asignado direcciones mas exacta con la api de google maps
                // especificamente la api de reverse geocoding
                // esta caracteristica lo tiene configurado el cliente osea el usuario 
                // la propiedad para habilitar la api de google es 
                // API: reverse geocoding
                // propiedad usuario: api_google
                if (this.localStorageService.usuario.usuario.api_google === 1) {
                    this.mapService.geocodeLatLng(vehiculo.ult_lat, vehiculo.ult_lng).then((direccion => {

                        if (this.eventoDentroGeocerca(vehiculo.ult_lat, vehiculo.ult_lng) !== '') {
                            // console.log('geo');
                            this.ultDireccionSeleccionada = direccion;
                            this.ultGeocercaSeleccionada = this.eventoDentroGeocerca(vehiculo.ult_lat, vehiculo.ult_lng);
                        } else {
                            // console.log('no geo');
                            this.ultDireccionSeleccionada = direccion;
                            this.ultGeocercaSeleccionada = 'No geocerca';
                        }
    
                        // PASO 2: RESOLVEMOS EL TIEMPO SIN CONEXION *************************************************************
    
                        // PASO 3: ACTUALIZAMOS DATA VEHICULO *********************************************************************
    
                        // PASO 4: EVALUAMOS LA IGNICION ENCENDIDA O APAGADA ******************************************************
                        let onOff = '';
                        let apagadoEncendido = '';
                        let labelParkingMoving = '';
                        let iconParkingMoving = '';
    
                        if (vehiculo.ign === 'on') {
                            onOff = 'green';
                            apagadoEncendido = this.localStorageService.lenguaje.lan101;
                            // veh.colorConexion = 'green';
                            labelParkingMoving = this.mapService.tiempoMovimiento(vehiculo.ign, vehiculo.timerMoving, this.localStorageService.lenguaje.lan273, this.localStorageService.lenguaje.lan272);
                            iconParkingMoving = 'fas fa-location-arrow';
                        } else {
                            if (vehiculo.ign === 'off') {
                                onOff = 'red';
                                apagadoEncendido = this.localStorageService.lenguaje.lan102;
                                // veh.colorConexion = 'red';
                                labelParkingMoving = this.mapService.tiempoParqueo(vehiculo.ign, vehiculo.timerParking,this.localStorageService.lenguaje.lan274, this.localStorageService.lenguaje.lan104, this.localStorageService.lenguaje.lan275);
                                iconParkingMoving = 'fas fa-parking';
                            }
                        }
    
                        // PASO 5: CALCULAMOS EL TIEMPO DE PARQUEO ****************************************************************
                        // const labelParking = this.mapService.tiempoParqueo(vehiculo.ign, vehiculo.timerParking);
    
                        // PASO 6: EVALUAMOS SI ESTA OFFLINE - ONLINE *************************************************************
                        let textOnline = '';
                        let colorOnline = '';
    
                        if (String(vehiculo.online) === 'true') {
                            textOnline = 'ONLINE';
                            colorOnline = 'green';
                            vehiculo.colorConexion = 'green';
                        } else {
                            textOnline = 'OFFLINE';
                            colorOnline = 'red';
                            vehiculo.colorConexion = 'red';
                        }
    
                        // PASO 7: ACTUALIZAMOS LA POSICION DEL MARKER EN EL MAPA ************************************************
                        // este paso actualizara la posicion del marker mas no moverá el mapa hacia él
                        marker.marker.setLatLng([vehiculo.ult_lat, vehiculo.ult_lng]);
                        const velocidadKMporHora = parseFloat(String(Number(vehiculo.ult_vel) * 1.609)).toFixed(1);
                        // PASO 8: MOVEMOS EL MAPA A UN MARKER SELECCIONADO (solo para uno) **************************************
    
                        // PASO 9: CONVERTIMOS LA HORA UTC A LOCAL ***************************************************************
                        // tslint:disable-next-line: max-line-length
                        const horaConvertida = this.mapService.converterUTCToLocalDate(vehiculo.ult_event_time) + ' ' + this.mapService.convertAmPm(this.mapService.converterUTCToLocalTime(vehiculo.ult_event_time));
    
                        // PASO 10: ACTUALIZAMOS DATA DE POPUP
                        // insertamos el texto de traducion ingles o español
                        const textoTraductor = {
                            conexion: this.localStorageService.lenguaje.lan096,
                            hace: this.localStorageService.lenguaje.lan266,
                            viajandoPor: this.localStorageService.lenguaje.lan272
                        };
                        // tslint:disable-next-line: max-line-length
                        const contenido = this.mapService.contenidoPopupMarker(textoTraductor, vehiculo.nombre, colorOnline, textOnline, vehiculo.inactivityTime, vehiculo.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, this.ultDireccionSeleccionada, this.ultGeocercaSeleccionada, iconParkingMoving, vehiculo.ult_BL, vehiculo.fuente, vehiculo.imei, vehiculo.nombre_conductor, vehiculo.fecha_fuente);
    
                        // PASO 11: INSERTAMOS EL CONTENIDO ACTUALIZADO EN EL POPUP DEL MARKER SELECCIONADO *********************
                        // marker.marker.getPopup().setContent(contenido);
                        marker.marker.bindPopup(contenido).openPopup();

                        // this.mapService.rootMap.setView([event.ult_lat, event.ult_lng], 20);
    
                    })).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.mapService.geocodeLatLngNominatimLocal(vehiculo.ult_lat, vehiculo.ult_lng).then((direccion => {

                        if (this.eventoDentroGeocerca(vehiculo.ult_lat, vehiculo.ult_lng) !== '') {
                            // console.log('geo');
                            this.ultDireccionSeleccionada = direccion;
                            this.ultGeocercaSeleccionada = this.eventoDentroGeocerca(vehiculo.ult_lat, vehiculo.ult_lng);
                        } else {
                            // console.log('no geo');
                            this.ultDireccionSeleccionada = direccion;
                            this.ultGeocercaSeleccionada = 'No geocerca';
                        }
    
                        // PASO 2: RESOLVEMOS EL TIEMPO SIN CONEXION *************************************************************
    
                        // PASO 3: ACTUALIZAMOS DATA VEHICULO *********************************************************************
    
                        // PASO 4: EVALUAMOS LA IGNICION ENCENDIDA O APAGADA ******************************************************
                        let onOff = '';
                        let apagadoEncendido = '';
                        let labelParkingMoving = '';
                        let iconParkingMoving = '';
    
                        if (vehiculo.ign === 'on') {
                            onOff = 'green';
                            apagadoEncendido = this.localStorageService.lenguaje.lan101;
                            // veh.colorConexion = 'green';
                            labelParkingMoving = this.mapService.tiempoMovimiento(vehiculo.ign, vehiculo.timerMoving, this.localStorageService.lenguaje.lan273, this.localStorageService.lenguaje.lan272);
                            iconParkingMoving = 'fas fa-location-arrow';
                        } else {
                            if (vehiculo.ign === 'off') {
                                onOff = 'red';
                                apagadoEncendido = this.localStorageService.lenguaje.lan102;
                                // veh.colorConexion = 'red';
                                labelParkingMoving = this.mapService.tiempoParqueo(vehiculo.ign, vehiculo.timerParking, this.localStorageService.lenguaje.lan274, this.localStorageService.lenguaje.lan104, this.localStorageService.lenguaje.lan275);
                                iconParkingMoving = 'fas fa-parking';
                            }
                        }
    
                        // PASO 5: CALCULAMOS EL TIEMPO DE PARQUEO ****************************************************************
                        // const labelParking = this.mapService.tiempoParqueo(vehiculo.ign, vehiculo.timerParking);
    
                        // PASO 6: EVALUAMOS SI ESTA OFFLINE - ONLINE *************************************************************
                        let textOnline = '';
                        let colorOnline = '';
    
                        if (String(vehiculo.online) === 'true') {
                            textOnline = 'ONLINE';
                            colorOnline = 'green';
                            vehiculo.colorConexion = 'green';
                        } else {
                            textOnline = 'OFFLINE';
                            colorOnline = 'red';
                            vehiculo.colorConexion = 'red';
                        }
    
                        // PASO 7: ACTUALIZAMOS LA POSICION DEL MARKER EN EL MAPA ************************************************
                        // este paso actualizara la posicion del marker mas no moverá el mapa hacia él
                        marker.marker.setLatLng([vehiculo.ult_lat, vehiculo.ult_lng]);
                        const velocidadKMporHora = parseFloat(String(Number(vehiculo.ult_vel) * 1.609)).toFixed(1);
                        // PASO 8: MOVEMOS EL MAPA A UN MARKER SELECCIONADO (solo para uno) **************************************
    
                        // PASO 9: CONVERTIMOS LA HORA UTC A LOCAL ***************************************************************
                        // tslint:disable-next-line: max-line-length
                        const horaConvertida = this.mapService.converterUTCToLocalDate(vehiculo.ult_event_time) + ' ' + this.mapService.convertAmPm(this.mapService.converterUTCToLocalTime(vehiculo.ult_event_time));
    
                        // PASO 10: ACTUALIZAMOS DATA DE POPUP
                        // insertamos el texto de traducion ingles o español
                        const textoTraductor = {
                            conexion: this.localStorageService.lenguaje.lan096,
                            hace: this.localStorageService.lenguaje.lan266,
                            viajandoPor: this.localStorageService.lenguaje.lan272
                        };
                        // tslint:disable-next-line: max-line-length
                        const contenido = this.mapService.contenidoPopupMarker(textoTraductor, vehiculo.nombre, colorOnline, textOnline, vehiculo.inactivityTime, vehiculo.ult_evento, horaConvertida, onOff, apagadoEncendido, String(velocidadKMporHora), labelParkingMoving, this.ultDireccionSeleccionada, this.ultGeocercaSeleccionada, iconParkingMoving, vehiculo.ult_BL, vehiculo.fuente, vehiculo.imei, vehiculo.nombre_conductor, vehiculo.fecha_fuente);
    
                        // PASO 11: INSERTAMOS EL CONTENIDO ACTUALIZADO EN EL POPUP DEL MARKER SELECCIONADO *********************
                        // marker.marker.getPopup().setContent(contenido);
                        marker.marker.bindPopup(contenido).openPopup();

                        // this.mapService.rootMap.setView([vehiculo.ult_lat, vehiculo.ult_lng]);
    
                    })).catch((err) => {
                        console.log(err);
                    });
                }
            }

        }
    }

    async live(imei, veh: any) {
        // console.log('live # 2');
        // Almacena la información en sessionStorage
        sessionStorage.setItem('vehiculo-seleccionado', JSON.stringify(veh));

        this.viewVehiculos = false;
        this.viewLive = true;
        this.imeiSeleccionado = imei;
        this.detalleViaje = [];

        const vehiculo = this.localStorageService.vehiculos.find( evento => evento.imei === imei );

        if (vehiculo !== undefined) {
            this.nombreVehiculoSeleccionado = vehiculo.nombre;

            // activamos el indicador que cuando se esta en detalle hasta que haya creado el marcado que lom muestre en el mapa
            this.entroADetalleEvento = true;
            // dejar unicamente el marcador seleccionado
            await this.mapService.clearMap();
            // limpiar marker agrupados
            this.mapService.markerClusterGroup.clearLayers();
            // limpiamos los marcadores creados
            this.mapService.arrayMarkers = [];
            // agregamos unicamente el marcador seleccionado
            this.agregarMarcadorLeaflet(vehiculo);
        }

        const fechaHorasAntes = moment().subtract(3, 'hours');
        fechaHorasAntes.format('YYYY-MM-DD HH:mm:ss');

        // convertir fecha y hora local a hora UTC
        const utcStart = moment(fechaHorasAntes.format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss').utc();
        // hora final
        const utcEnd = moment(moment().format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss').utc();

        this.subObtenerRawData = this.restService.obtenerDataRaw(this.imeiSeleccionado, String(utcStart.format()), String(utcEnd.format())).subscribe((response) => {

            let ultimosEventos: any[] = [];

            try {
                // Nos aseguramos que no se presenten eventos duplicados en la app
                let sa = -1;
                // nos aseguramos que no presente evento repetidos por tiempo y evento
                let event = '-1';
                let tiempo = '-1';
                // primero evaluamos si trae .SA 
                if (response[0].SA !== '') {
                    // si es diferente de vacío indica que este vehiculo tiene secuencia analogica
                    // configurado, por lo tanto evaluamos por SA
                    for (let info of response) {
                        if (Number(info.SA) !== Number(sa)) {
                            sa = Number(info.SA);
                            // this.dataSource.data.push(info);

                            if (info.etiqueta === 'Stopped (Idle)') {
                                // idle
                                info.background = '#b1eeff';
                                info.colorText = 'black';
                            }

                            if (info.etiqueta === 'Velocidad excesiva') {
                                info.background = '#ffa50066';
                                info.colorText = 'black';
                            }

                            if (info.evento === '03') {
                                // encendido
                                info.background = '#a5fba5';
                                info.colorText = 'black';
                            }

                            if (info.evento === '02') {
                                // apagado
                                info.background = '#5a5a5ac2';
                                info.colorText = 'white';
                            }
                            // info.evento = '100';
                            // console.log(info);
                            ultimosEventos.push(info);
                        } else {
                            // console.log('Hay SA duplicado: ', Number(info.SA));
                        }
                    }
                } else {
                    // si el SA es vacío indica que este vehículo no tiene secuencia analogica
                    // configurado, por lo tanto evaluamos por evento y tiempo
                    for (const info of response) {
                        // console.log(info.event_time);
                        if (info.event_time !== tiempo && info.evento !== event) {
                            // actualizamos los datos de evaluación
                            tiempo = info.event_time;
                            event = info.evento;
                            ultimosEventos.push(info);
                        } else {
                            // console.log('Hay SA duplicado: ', Number(info.SA));
                        }
                    }
                }


            } catch (e) {
                console.log(e);
            }

            this.eventoLive(ultimosEventos);

            if (response.length > 0) {
                this.dibujarRecorrido();
                this.boolEventoNoGenerado = false;
            } else {
                // no ha generado eventos en la ultimas hora
                this.boolEventoNoGenerado = true;
            }

            }, (error) => {
            console.log(error);
        });
    }

    limpiarVehiculoSeleccionado() {
        // Almacena la información en sessionStorage
        sessionStorage.setItem('vehiculo-seleccionado', JSON.stringify(null));
    }

    async atrasVerVehiculos() {

        // Almacena la información en sessionStorage
        sessionStorage.setItem('vehiculo-seleccionado', JSON.stringify(null));
        
        this.viewVehiculos = true;
        this.viewLive = false;
        this.loadText = true;
        this.imeiSeleccionado = '';
        this.detalleVehiculo = false;
        // this.mapService.clearMap();
        this.mapService.clearPolyLineMonitoreo();
        this.mapService.deleteCircleMarket();
        this.boolEventoNoGenerado = false;
        this.imeiSeleccionado = '';
        this.imeiAntesSeleccionado = '';

        // desactivamos el indicador que cuando se esta en detalle hasta que haya creado el marcado que lom muestre en el mapa
        this.entroADetalleEvento = false;

        // console.log('imei en viaje', this.imeiSeleccionadoEnviaje);
        if (this.imeiSeleccionadoEnviaje !== '') {
            this.loaderVehiculos = true;
            this.imeiSeleccionadoEnviaje = '';
            // volvemos a cargar los carcadores porqie se eliminan del mapa
            // Limpiamos los valores que tenga el service map
            this.mapService.arrayMarkers = [];
            this.mapService.arrayLatLng = [];
            this.mapService.viajeSeleccionado = [];
            // this.mapService.vehiculos = [];
            this.mapService.clearMap();
            this.mapService.markersGeocercas = [];
            // limpiar marker agrupados
            this.mapService.markerClusterGroup.clearLayers();
            this.obtenerVehiculosAsignados();
            this.dibujarGeocercas();
        } else {
            console.log('atras lista vehiculos');
            
            // dejar unicamente el marcador seleccionado
            await this.mapService.clearMap();
            // limpiar marker agrupados
            this.mapService.markerClusterGroup.clearLayers();
            // limpiamos los marcadores creados
            this.mapService.arrayMarkers = [];
            this.cargarVehiculosLocalStorage();
        }

       

    }

    eventoLive(evento: any) {
        this.loadText = false;
        this.boolEventoNoGenerado = false;
        // console.log(evento);
        // console.log('evento en vivo: ', evento);
        // console.log('evento ultima hora:', evento[0].evento);

        if (evento.ult_evento !== undefined) {
            // significa que es un evento en vivo
            let ev: EventLive = {};
            ev.evento = evento.ult_evento;
            ev.event_time = evento.ult_event_time;
            ev.address = 'Espere ...';
            ev.lat =  evento.ult_lat;
            ev.lng = evento.ult_lng;
            ev.PS00 = evento.ult_PS00;
            ev.PS01 = evento.ult_PS01;
            ev.PS02 = evento.ult_PS02;
            ev.PS03 = evento.ult_PS03;
            ev.vel = evento.ult_vel;
            ev.etiqueta = evento.ult_etiqueta;
            ev.icono = evento.ult_icono;
            ev.nombre_icono = evento.ult_nombre_icono;
            ev.descripcion_icono = evento.ult_descripcion_icono;
            ev.color_icono = evento.ult_color_icono;
            ev.posicion_valida = evento.ult_posicion_valida;
            ev.imei = evento.imei;
            ev.id = evento.id;

            // añadimos el nuevo punto en el polyLine
            this.mapService.addPointPolyLineMonitoreo(ev.lat, ev.lng);

            // si es un evento 75 activamos el boton de camara de nuevo
            if (ev.evento === '75') {
                this.botonCamaraDesabilidato = false;
            }


            // evaluamos si el usuario tiene asignado direcciones mas exacta con la api de google maps
            // especificamente la api de reverse geocoding
            // esta caracteristica lo tiene configurado el cliente osea el usuario 
            // la propiedad para habilitar la api de google es 
            // API: reverse geocoding
            // propiedad usuario: api_google
            if (this.localStorageService.usuario.usuario.api_google === 1) {
                this.mapService.geocodeLatLng(evento.ult_lat, evento.ult_lng).then((data) => {
                    ev.address = data;
                    for (const j in this.localStorageService.geocercas) {
                        // tslint:disable-next-line: max-line-length
                        if (Boolean(JSON.parse(this.localStorageService.geocercas[j]['circular'])) === true) {
                            const lat = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lat;
                            // tslint:disable-next-line: no-string-literal
                            const lng = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lng;
                            // tslint:disable-next-line: no-string-literal
                            const radio = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].radio;
                            const dentroGeocerca = this.mapService.isMarkerInsideCirclePiont(this.mapService.rootMap,
                                                                                            evento.ult_lat,
                                                                                            evento.ult_lng,
                                                                                            lat, lng, radio);
                            if (dentroGeocerca) {
                                ev.address = this.localStorageService.geocercas[j]['nombre_geocerca'];
                            }
                        } else {

                            const dentroGeocerca = this.mapService.isMarkerInsidePolygonPoint(evento.ult_lat, evento.ult_lng,
                                                                                            this.localStorageService.geocercas[j]['coordenada_geocerca']);
                            if (dentroGeocerca) {
                                ev.address = this.localStorageService.geocercas[j]['nombre_geocerca'];
                            }
                        }
                    }
                    this.detalleViaje.unshift(ev);
                    this.detalleViaje = [...this.detalleViaje];
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                this.mapService.geocodeLatLngNominatimLocal(evento.ult_lat, evento.ult_lng).then((data) => {
                    ev.address = data;
                    for (const j in this.localStorageService.geocercas) {
                        // tslint:disable-next-line: max-line-length
                        if (Boolean(JSON.parse(this.localStorageService.geocercas[j]['circular'])) === true) {
                            const lat = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lat;
                            // tslint:disable-next-line: no-string-literal
                            const lng = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lng;
                            // tslint:disable-next-line: no-string-literal
                            const radio = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].radio;
                            const dentroGeocerca = this.mapService.isMarkerInsideCirclePiont(this.mapService.rootMap,
                                                                                            evento.ult_lat,
                                                                                            evento.ult_lng,
                                                                                            lat, lng, radio);
                            if (dentroGeocerca) {
                                ev.address = this.localStorageService.geocercas[j]['nombre_geocerca'];
                            }
    
                        } else {
    
                            const dentroGeocerca = this.mapService.isMarkerInsidePolygonPoint(evento.ult_lat, evento.ult_lng,
                                                                                            this.localStorageService.geocercas[j]['coordenada_geocerca']);
                            if (dentroGeocerca) {
                                ev.address = this.localStorageService.geocercas[j]['nombre_geocerca'];
                            }
                        }
                    }
                    this.detalleViaje.unshift(ev);
                    this.detalleViaje = [...this.detalleViaje];
                }).catch((err) => {
                    console.log(err);
                });
            }

            // añadir
        } else {
            // console.log('eventos de la ultima hora: ', evento);
            // significa que son los eventos emitido en la ultima hora
            for (const i in evento) {

                // tslint:disable-next-line: prefer-const
                let ev: EventLive = {};

                ev.evento = evento[i].evento;
                ev.event_time = evento[i].event_time;
                ev.address = 'Espere ...';
                ev.lat =  evento[i].lat;
                ev.lng = evento[i].lng;
                ev.PS00 = evento[i].PS00;
                ev.PS01 = evento[i].PS01;
                ev.PS02 = evento[i].PS02;
                ev.PS03 = evento[i].PS03;
                ev.vel = evento[i].vel;
                ev.etiqueta = evento[i].etiqueta;
                ev.colorText = evento[i].colorText;
                ev.background = evento[i].background;
                ev.icono = evento[i].icono;
                ev.nombre_icono = evento[i].nombre_icono;
                ev.descripcion_icono = evento[i].descripcion_icono
                ev.color_icono = evento[i].color_icono;
                ev.posicion_valida = evento[i].posicion_valida;
                ev.imei = evento[i].imei;
                ev.id = evento[i].id;

                this.detalleViaje.unshift(ev);
            }

            // actualizamos los detalles viajes
            this.detalleViaje = [...this.detalleViaje];
        }  
        const inter = setInterval(() => {
            this.convertirDireciones();
            clearInterval(inter);
        }, 3000);
    }

    async convertirDireciones() {
        // console.log(this.viajes);

        // tslint:disable-next-line: forin
        for (const viaje of this.detalleViaje) {
            // evaluamos si el usuario tiene asignado direcciones mas exacta con la api de google maps
            // especificamente la api de reverse geocoding
            // esta caracteristica lo tiene configurado el cliente osea el usuario 
            // la propiedad para habilitar la api de google es 
            // API: reverse geocoding
            // propiedad usuario: api_google
            if (this.localStorageService.usuario.usuario.api_google === 1) {
                this.mapService.geocodeLatLng(viaje.lat, viaje.lng).then((direccion => {

                    viaje.address = direccion;
                    
                })).catch((err) => {
                    console.log(err);
                });
            } else {
                viaje.address = await this.mapService.geocodeLatLngNominatimLocal(viaje.lat, viaje.lng);
            }
            

            for (const j in this.localStorageService.geocercas) {
                // tslint:disable-next-line: max-line-length
                if (Boolean(JSON.parse(this.localStorageService.geocercas[j]['circular'])) === true) {
                    const lat = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lat;
                    // tslint:disable-next-line: no-string-literal
                    const lng = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lng;
                    // tslint:disable-next-line: no-string-literal
                    const radio = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].radio;
                    const dentroGeocerca = this.mapService.isMarkerInsideCirclePiont(this.mapService.rootMap,
                                                                                    viaje.lat,
                                                                                    viaje.lng,
                                                                                    lat, lng, radio);
                    if (dentroGeocerca) {
                        viaje.address = this.localStorageService.geocercas[j]['nombre_geocerca'];
                        // return;
                    }
                } else {

                    const dentroGeocerca = this.mapService.isMarkerInsidePolygonPoint(viaje.lat, viaje.lng,
                                                                                    this.localStorageService.geocercas[j]['coordenada_geocerca']);
                    if (dentroGeocerca) {
                        viaje.address = this.localStorageService.geocercas[j]['nombre_geocerca'];
                        // return;
                    }
                }
            }
        }
    }

    verFoto(event) {
        this.dialogImagen(event, this.imeiSeleccionado, event.PS00);
    }

    verFotoDobleCamara(event) {
        this.openDialogDobleCamara(event, this.imeiSeleccionado);
    }

    openDialogDobleCamara(evento: any, imei: string) {
        const dialogRef = this.dialog.open(DialogImageDobleCamaraComponent, {
        data: {
            evento,
            imei,
            modulo: 1
        }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    dialogImagen(title: any, imei, PS00) {
        /*const dialogRef = this.dialog.open(DialogImageComponent, {
            data: {
                title,
                imei,
                ps00
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });*/

        // evaliamos si es una pantalla de escritorio o no
        let anchoPantalla = 0;
        let altoPantalla = 0;
        if(this.isDesktop()) {
            anchoPantalla = Number(screen.width) - 300;
            altoPantalla = Number(screen.height) - 300;
        } else {
            anchoPantalla = Number(screen.width);
            altoPantalla = Number(screen.height);
        }
        
        const dialogRef = this.dialog.open(DialogGalleryComponent, {
            data: {
                title,
                imei,
                PS00,
                eventos: this.detalleViaje
            },
            panelClass: 'custom-modalbox',
            height: altoPantalla+'px',
            width: anchoPantalla+'px'
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    cerrarSidenav(drawer: any) {
        if (window.innerWidth > 575) {
            // console.log('es pantalla escritorio');
            // console.log('ancho de pantalla', this.innerWidth = window.innerWidth);
        } else {
            // console.log('es mobil');
            // console.log('ancho de pantalla', this.innerWidth = window.innerWidth);
            drawer.toggle();

            if (this.icon === 'keyboard_arrow_left') {
                this.icon = 'keyboard_arrow_right';
            } else {
                this.icon = 'keyboard_arrow_left';
            }
        }
    }

    public toggleIcon() {

        if (this.icon === 'keyboard_arrow_left') {
            this.icon = 'keyboard_arrow_right';
        } else {
            this.icon = 'keyboard_arrow_left';
        }
    }

    openSnackBar(vehiculo: any, action: string) {

        const veh = this.localStorageService.vehiculos.find( evento => evento.imei === this.imeiSeleccionado );

        if (veh !== undefined) {
            this._snackBar.open('Solicitud de posición enviada', action, {
                duration: 5000,
            });
            // console.log('envio de mensaje: ', veh.id_conexion);
            this.chatService.enviarComandos(['>SXACT098<'], veh.imei, veh.id_conexion, false);
        } else {
            this._snackBar.open('Error no se pudo envia la solicitud', action, {
                duration: 5000,
              });
        }
        // console.log('POS:', vehiculo);
    }

    capturarImagenVehiculo() {

        const veh = this.localStorageService.vehiculos.find( evento => evento.imei === this.imeiSeleccionado );

        if (veh !== undefined) {

            this._snackBar.open('Solicitud de captura de imagen enviada', 'OK', {
                duration: 5000,
            });
            // enviamos el comando
            this.chatService.enviarComandos(['>SSSU051<'], veh.imei, veh.id_conexion, false);
            this.botonCamaraDesabilidato = true;
        } else {
            this._snackBar.open('Error no se pudo envia la solicitud', 'OK', {
                duration: 5000,
            });
        }
        // console.log('POS:', vehiculo);
    }

    visibilidadVehiculos() {
        const dialogRef = this.dialog.open(VisibilidadVehiculosComponent, {
            width: '400px',
            data: {}
            });
        dialogRef.afterClosed().subscribe(result => {

            this.mapService.clearMap();
            // limpiar marker agrupados
            this.mapService.markerClusterGroup.clearLayers();
            this.obtenerVehiculosAsignados();
            this.dibujarGeocercas();
        });
    }

    DeleteMarkers() {
        // Loop through all the markers and remove
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.marcadores.length; i++) {
            this.marcadores[i].setMap(null);
        }
        this.marcadores = [];
    }

    RecibirNotificacion() {
        // console.log('EVENETO');
        if (this.swUpdate.isEnabled) {
            /// console.log('ES ACEPOTADO');
            this.swPush.requestSubscription({
                serverPublicKey: this.VAPID_KEY
            }).then(sub => {
                this.restService.recibirNotificaciones(sub).subscribe();
            });
        } else {
            // console.log('NO ES ACEPTADO');
            this.swPush.requestSubscription({
                serverPublicKey: this.VAPID_KEY
            }).then(sub => {
                this.restService.recibirNotificaciones(sub).subscribe();
            });
        }
    }

    dibujarRecorrido() {

        // limpiamos los arreglos de polyline y marcadores
        this.mapService.arrayLatLng = [];
        this.arrayLatLng = [];
        this.mapService.viajeSeleccionado = [];
        
        this.mapService.clearPolyLineMonitoreo();

        // console.log('detalle viaje: ',  this.detalleViaje);

        for (const viaje of this.detalleViaje) {

            // este arreglo sirve para el polyline
            this.mapService.arrayLatLng.push([viaje.lat, viaje.lng]);

            // este arreglo sirve para los marcadores
            if (viaje.PS00 != '') {
                this.arrayLatLng.push([viaje.lat, viaje.lng, viaje.id, viaje.PS00]);
            } else {
                if (viaje.icono === 1) {
                    // console.log('icono: ', ev[i].nombre_icono);
                    // con icono etiqueta
                    this.arrayLatLng.push([viaje.lat, viaje.lng, viaje.id, -1, 1, viaje.descripcion_icono, viaje.color_icono]);
                } else {
                    // sin icono de etiqueta
                    this.arrayLatLng.push([viaje.lat, viaje.lng, viaje.id, -1, 0, '', '']);
                }
                
            }

            this.mapService.viajeSeleccionado.push(viaje);
        }

        /** 
         * Agrega un punto dado a la polilínea. De forma predeterminada, 
         * se agrega al primer anillo de la polilínea en el caso de una polilínea múltiple, 
         * pero se puede anular pasando un anillo específico como una matriz LatLng 
         * (con la que puede acceder antes getLatLngs).
        */
        // invertimos los valores para que tome el ultimo punto para añadir una nueva coordenada
        // y unir el polyLine
        this.mapService.arrayLatLng.reverse();
        this.mapService.dibujarPolyLineSinPopup();
        this.crearMarcadoresCirculares();
    }

    buscarCoordenada() {

        const dialogRef = this.dialog.open(DialogBuscarCoordenadaComponent, {
        width: '400px',
        data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
            if (result['cancel'] === false) {
                // console.log('coors: ', result['coors']);
                const lat = Number(result['coors'][0]);
                const lng = Number(result['coors'][1]);
                // asignar el imei que vehiculo seguir en el mapa
                this.vehiculoASeguir = '0';
                const myCustomColour = '#ff5722';

                const markerHtmlStyles = `  background-color: ${myCustomColour};
                                            width: 2rem;
                                            height: 2rem;
                                            display: block;
                                            left: -0.8rem;
                                            top: -1.9rem;
                                            position: relative;
                                            border-radius: 3rem 3rem 0;
                                            transform: rotate(45deg);
                                            border: 2px solid #000000`;

                const icons = L.divIcon({
                    className: "my-custom-pin",
                    html: `<span style="${markerHtmlStyles}" />`
                });

                var marker = L.marker([lat, lng], {
                    icon: icons,
                  
                }).addTo(this.mapService.rootMap);

                this.mapService.rootMap.setView([lat, lng]);
            } else {

            }
        });
    }

    verGeocercas() {
        const dialogRef = this.dialog.open(DialogVerGeocercasComponent, {
            width: '600px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                // tslint:disable-next-line: forin
                if (this.mapService.markersGeocercas.length > 0) {
                    // tslint:disable-next-line: forin
                    for (let i in this.mapService.markersGeocercas) {
                        // eliminamos el marcador del mapa
                        this.mapService.rootMap.removeLayer(this.mapService.markersGeocercas[i].marker);
                        // eliminamos el objeto del array
                        // this.mapService.markersGeocercas.splice(i, 1);
                    }
                }
                this.mapService.markersGeocercas = [];

                this.dibujarGeocercas();
            }
        });
    }

    obtenerGeocercas() {
        this.geocercasCargadas = false;
        this.restService.obtenerGeocercas3(this.localStorageService.usuario.usuario.grupos).subscribe((data) => {
            // console.log('geocercas---: ', data[58]);
            this.localStorageService.guardarGeocercas(data);
            this.dibujarGeocercas();
            this.obtenerGrupos();
        }, (err) => {
            console.log(err);
        });
    }

    dibujarGeocercas() {
    
        let idGeocercas = [];
        // console.log('GRUPOS SELECCIONADOS: ', );
        // tslint:disable-next-line: forin
        for (let i in this.localStorageService.geocercas) {

            const result = this.localStorageService.colecciones.find( coleccion => coleccion.id_coleccion_geocerca === this.localStorageService.geocercas[i].id_coleccion_geocerca );

            if (result !== undefined) {
                if (this.localStorageService.geocercas[i].visibilidad === 1) {
                    const result = idGeocercas.findIndex(idGeo => idGeo === this.localStorageService.geocercas[i].id_geocerca);
                    if (result === -1) {
                        
                        idGeocercas.push(this.localStorageService.geocercas[i].id_geocerca);
                        if (Boolean(JSON.parse(this.localStorageService.geocercas[i]['circular'])) === true) {
                            // insertamos una geocerca cirular al mapa
                            if (!this.localStorageService.geocercas[i]['coordenada_geocerca']) {
                                // console.log('geoc indefinida: ', this.localStorageService.geocercas[i]);
                            }
                            // tslint:disable-next-line: no-string-literal
                            const lat = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lat;
                            // tslint:disable-next-line: no-string-literal
                            const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lng;
                            // tslint:disable-next-line: no-string-literal
                            const radio = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].radio;
        
                            let circle = new L.circle([lat, lng], radio);
                            /*let circle = L.circleMarker([lat, lng], {
                                // renderer: this.myRenderer, 
                                radius: radio
                            });*/
                            circle.type = 'G';
                            circle.setStyle({
                                color: '#0e0e9e',
                                stroke: true,
                                weight: 1
                            });
                            circle.addTo(this.mapService.rootMap);
        
                            /*circle.on('dblclick', (e) => {
                                circle.enableEdit();
                            });*/
        
                            const radioC = parseFloat(String(radio)).toFixed(1);
                            const latC =  parseFloat(String(lat)).toFixed(7);
                            const lngC =  parseFloat(String(lng)).toFixed(7);
        
                            /*const contenido = `<h6>${this.localStorageService.geocercas[i]['nombre_geocerca']}</h6>
                                                <p style="margin-bottom:0px">
                                                    Colección: <strong>
                                                    ${this.localStorageService.geocercas[i]['nombre_coleccion'][0]['nombre']}
                                                    </strong>
                                                </p>
                                                <p style="margin-bottom:0px">
                                                    ID: ${this.localStorageService.geocercas[i]['id_geocerca']}
                                                </p>
                                                <p style="margin-bottom:0px">
                                                    Radio: ${radioC} m
                                                </p>
                                                <p style="margin-bottom:0px">
                                                    Coordenadas: ${latC} , ${lngC}
                                                </p>`;*/
                            const datos = {
                                nombreGeocerca: this.localStorageService.geocercas[i]['nombre_geocerca'],
                                nombreColeccion: this.localStorageService.geocercas[i]['nombre_coleccion'][0]['nombre'],
                                idGeocerca: this.localStorageService.geocercas[i]['id_geocerca'],
                                radio: radioC,
                                lat: latC,
                                lng: lngC
                            }
                            const contenido = this.mapService.contenidoGeocercas(datos);
                            circle.bindPopup(contenido);
                            circle.on('dblclick', L.DomEvent.stop).on('dblclick', circle.toggleEdit);
                            /*circle.on('mouseover', (e) => {
                                circle.openPopup();
                            });
                            circle.on('mouseout', (e) => {
                                circle.closePopup();
                            });*/
                            // insertamos el marcador circular al array de markers Circles
                            this.mapService.markersGeocercas.push({id: circle._leaflet_id, marker: circle});
                            this.mapService.rootMap.addLayer(circle);
        
                            // this.editableLayers.addLayer(circle);
                            this.localStorageService.geocercas[i].idLeaflet = circle._leaflet_id;
                            this.mapService.geocercas.push(this.localStorageService.geocercas[i]);
        
                        } else {
        
                            // ordenar objetos por atributos
                            // tslint:disable-next-line: max-line-length
                            const dataOrdenado =  this.localStorageService.geocercas[i]['coordenada_geocerca'].sort(function(a, b) { return a.orden - b.orden; });
                            // console.log('data ordeando: ', dataOrdenado);
                            const latLngs: any[] = [];
                            // tslint:disable-next-line: forin
                            for (const j in this.localStorageService.geocercas[i]['coordenada_geocerca']) {
                                // tslint:disable-next-line: no-string-literal
                                const lat =this.localStorageService.geocercas[i]['coordenada_geocerca'][j].lat;
                                // tslint:disable-next-line: no-string-literal
                                const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][j].lng;
                                latLngs.push([lat, lng]);
                            }
                            let polygon = L.polygon(latLngs);
                            polygon.type = 'G';
                            polygon.setStyle({
                                color: '#226104',
                                stroke: true,
                                weight: 1
                            });
                            polygon.addTo(this.mapService.rootMap);

                            //  polygon.enableEdit();
                            /*const contenido = `<h6>${this.localStorageService.geocercas[i]['nombre_geocerca']}</h6>
                                                <p style="margin-bottom:0px">
                                                    Colección: <strong>${this.localStorageService.geocercas[i]['nombre_coleccion'][0]['nombre']}</strong>
                                                </p>
                                                <p style="margin-bottom:0px">
                                                    ID Geocerca: ${this.localStorageService.geocercas[i]['id_geocerca']}
                                                </p>`;*/
                            const datos = {
                                nombreGeocerca: this.localStorageService.geocercas[i]['nombre_geocerca'],
                                nombreColeccion: this.localStorageService.geocercas[i]['nombre_coleccion'][0]['nombre'],
                                idGeocerca: this.localStorageService.geocercas[i]['id_geocerca'],
                            }
                            const contenido = this.mapService.contenidoGeocercasPoligonal(datos);
                            polygon.bindPopup(contenido);
                            polygon.on('dblclick', L.DomEvent.stop).on('dblclick', polygon.toggleEdit);
                            /*polygon.on('mouseover', (e) => {
                                polygon.openPopup();
                            });
                            polygon.on('mouseout', (e) => {
                                polygon.closePopup();
                            });*/
                            /*polygon.on('dblclick', L.DomEvent.stop).on('dblclick', polygon.toggleEdit);*/
        
                            this.mapService.markersGeocercas.push({id: polygon._leaflet_id, marker: polygon});
        
                            this.localStorageService.geocercas[i].idLeaflet = polygon._leaflet_id;
                            this.mapService.geocercas.push(this.localStorageService.geocercas[i]);
                        }
                    }
                } else {
                    // console.log('no hay resultados geocercas');
                }
            } else {
                // console.log('no tiene grupo asignado');
            }
            
        }

        this.geocercasCargadas = true;
    }

    agregarNuevaGeoCercaCiruclar(radio: number, latLng: any) {
        // this.map.editTools.startCircle();
        // console.log(' se agrego nuevca geocerca circular', this.mapService.geocercas);
        const dialogRef = this.dialog.open(DialogGeocercaComponent, {
            width: '400px',
            data: {
                radio,
                latLng,
                colecciones: this.colecciones
            }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('Se ejecuto ', result);
        if (result.accept) {
            this.openDialog('OK', 'Geocerca guardado exitosamente.');
            // location.reload();
        } else {
            this.openDialog('ERROR', 'No se pudo crear la geocerca, intente mas tarde');
        }
        });
    }

    agregarNuevaGeoCercaPoligonal(latLngs) {
        // console.log(latLngs);
        // this.map.editTools.startPolygon();
        const dialogRef = this.dialog.open(DialogGeocercaPoligonalComponent, {
        width: '400px',
        data: {
            latLngs,
            colecciones: this.colecciones
        }
        });

        dialogRef.afterClosed().subscribe(result => {
        //console.log('Se ejecuto ', result);
        if (result) {
            this.openDialog('OK', 'Geocerca guardado exitosamente.');
            // location.reload();
        } else {
            this.openDialog('ERROR', 'No se pudo crear la geocerca, intente mas tarde');
        }
        });
    }

    obtenerColeccionesPorGrupo() {
        this.restService.obtenerColeccionesPorGrupo(this.localStorageService.usuario.usuario.id_grupo).subscribe((data) => {
            // console.log('colecciones', data);
            this.colecciones.push(...data);
            // Obtenemos las geocercas para insertarlos al mapa
            // this.obtenerGeocercasPorColeccion(data);
            this.obtenerGeocercas();
        }, (err) => {
            console.log(err);
        });
    }

    guardarEditadoGeocerca() {
        const marker = this.mapService.markersGeocercas.find(mark => mark.id === this.idLeafletSeleccionado);
        if (marker !== undefined) {
            marker.marker.disableEdit();
        } else {
            console.log('no coinciden');
        }
    }

    openDialog(title: string, body: string) {

        const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {
            title,
            body
        }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);
        });
    }

    crearGeocerca(type) {

        switch (type) {
            case 'polygon':
                this.polygonDrawer = new L.Draw.Polygon(this.mapService.rootMap);

                break;
            case 'polyline':
                this.polygonDrawer = new L.Draw.Polyline(this.mapService.rootMap);
                break;
            case 'rectangle':
                this.polygonDrawer = new L.Draw.Rectangle(this.mapService.rootMap);
                break;
            case 'circle':
                this.polygonDrawer = new L.Draw.Circle(this.mapService.rootMap);
                break;
            case 'marker':
                this.polygonDrawer = new L.Draw.Marker(this.mapService.rootMap);
                break;
        }
        this.polygonDrawer.enable();
    }

    obtenerGrupos() {
        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            // console.log(data);
            this.localStorageService.guardarGruposUsuario(data);
        }, (err) => {
            console.log(err);
        });
    }

    confirmacion(info) {
        let valor: false;
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '600px',
            data: {body: info}
        });

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel !== false) {

            } else {

            }
        });

    }

    openSnackBar1() {

        this.snackBar.open('Geocerca modo editable habilitada', 'OK', {
            duration: 5000,
        });
    }

    closeSnackBar() {

        this.snackBar.open('Geocerca modo editable desabilitada', 'OK', {
            duration: 5000,
        });
    }

    editarGeocercaCircular(layer: any) {

        for (let i in this.localStorageService.geocercas) {
            if (this.localStorageService.geocercas[i].idLeaflet === layer._leaflet_id) {
                if (this.localStorageService.geocercas[i].circular === 'true') {
                    // console.log('id geocerca: ', this.mapService.geocercas[i].id_geocerca);
                    // console.log('id coordenada geocerca: ', this.mapService.geocercas[i].coordenada_geocerca[0].id_coordenada_geocerca);
                    //  console.log('id layer', layer._leaflet_id);
                    // console.log('nuevo radio: ', layer._mRadius);
                    // console.log('nuevo latLng: ', layer._latlng);

                    this.restService.actualizarGeocercaCircular(
                        this.localStorageService.geocercas[i].coordenada_geocerca[0].id_coordenada_geocerca,
                        layer._mRadius,
                        layer._latlng,
                        this.localStorageService.geocercas[i].nombre_geocerca,
                        this.localStorageService.geocercas[i].id_geocerca
                    ).subscribe((res) => {
                        // console.log(res);
                        this.openDialog('OK', 'Geocerca circular actualizada correctamente');
                        // this.viewDeleteGeocerca = false;
                        this.viewSaveGeocerca = false;
                    }, (err) => {
                        console.log(err);
                    });

                    // guardamos en el storage los cambios de la geocercas
                    // porque desdes ahuii se manda a consultar todas las geocercas
                    this.localStorageService.geocercas[i].coordenada_geocerca[0].lat = layer._latlng.lat;
                    this.localStorageService.geocercas[i].coordenada_geocerca[0].lng = layer._latlng.lng;
                    this.localStorageService.geocercas[i].coordenada_geocerca[0].radio = layer._mRadius;

                    this.localStorageService.guardarGeocercas(this.localStorageService.geocercas);

                } else {
                    const fechaUtc = String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));
                    // console.log('fecha utc: ', fechaUtc);
                    // console.log('id geocerca: ', this.mapService.geocercas[i].id_geocerca);
                    // console.log('coordenada geocerca: ', this.localStorageService.geocercas[i].coordenada_geocerca);
                    // console.log('layer: ', layer._latlngs[0]);
                    let orden1 = 1;
                    const radio1 = -1;
                    const id_geocerca1 = this.localStorageService.geocercas[i].coordenada_geocerca.id_geocerca;
                    const id_coordenada_geocerca1 = this.localStorageService.geocercas[i].coordenada_geocerca.id_coordenada_geocerca;
                    this.restService.actualizarGeocercaPoligonal(
                        this.localStorageService.geocercas[i].id_geocerca,
                        -1,
                        layer._latlngs[0],
                        fechaUtc,
                        this.localStorageService.geocercas[i].nombre_geocerca
                    ).subscribe((res) => {
                        // console.log(res);
                        this.openDialog('OK', 'Geocerca Poligonal actualizada correctamente');
                        // this.viewDeleteGeocerca = false;
                        this.viewSaveGeocerca = false;
                    }, (err) => {

                    });

                    // tslint:disable-next-line: variable-name
                    let coordenadasGeocerca: any[] = [];
                    // tslint:disable-next-line: forin
                    for (let i in layer._latlngs[0]) {
                        coordenadasGeocerca.push({
                            lat: layer._latlngs[0][i].lat,
                            lng: layer._latlngs[0][i].lng,
                            orden: orden1,
                            radio: radio1,
                            id_geocerca: id_geocerca1,
                            id_coordenada_geocerca: id_coordenada_geocerca1
                        });
                        orden1 += 1;
                    }

                    // guardamos en el localStorage
                    this.localStorageService.geocercas[i].coordenada_geocerca = coordenadasGeocerca;
                    this.localStorageService.guardarGeocercas(this.localStorageService.geocercas);
                }
            }
        }
    }

    eventoDentroGeocerca(lat1, lng1): string {
        let nombreGeo = '';
        for (const j in this.localStorageService.geocercas) {
            // tslint:disable-next-line: max-line-length
            if (Boolean(JSON.parse(this.localStorageService.geocercas[j]['circular'])) === true) {
                const lat = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lat;
                // tslint:disable-next-line: no-string-literal
                const lng = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].lng;
                // tslint:disable-next-line: no-string-literal
                const radio = this.localStorageService.geocercas[j]['coordenada_geocerca'][0].radio;
                const dentroGeocerca = this.mapService.isMarkerInsideCirclePiont(this.mapService.rootMap,
                                                                                lat1,
                                                                                lng1,
                                                                                lat, lng, radio);
                if (dentroGeocerca) {
                    nombreGeo = this.localStorageService.geocercas[j]['nombre_geocerca'];
                }

            } else {

                const dentroGeocerca = this.mapService.isMarkerInsidePolygonPoint(lat1, lng1,
                                                                                this.localStorageService.geocercas[j]['coordenada_geocerca']);
                if (dentroGeocerca) {
                    nombreGeo = this.localStorageService.geocercas[j]['nombre_geocerca'];
                }
            }
        }
        return nombreGeo;
    }

    getRow(row) {

        // movemos el mapa
        this.mapService.moverMapa(row.lat, row.lng);
        // cerramos todos los popup que existan
        this.mapService.rootMap.closePopup();

        if (this.mapService.popupEvent) {

            this.mapService.popupEvent.closePopup();
            this.mapService.popupEvent.remove();
            this.mapService.popupEvent.removeFrom(this.mapService.rootMap);
        }

        this.mapService.popupEvent = L.popup();
        this.mapService.popupEvent.setLatLng([row.lat, row.lng]);
        this.mapService.popupEvent.setContent(this.mapService.contenidoPopupEspera());
        this.mapService.popupEvent.addTo(this.mapService.rootMap);

        this.restService.obtenerImagen(row.imei, row.PS00).subscribe((data) => {

            // creacion del popup de informacón del evento
            this.mapService.popupEvent.setContent(this.mapService.contenidoPopup(row, data));

            // generar eventos dentro del popup seleccionado
            /*****************************************************************/
            const buttonSubmit = L.DomUtil.get('_'+row.PS00);

            L.DomEvent.addListener(buttonSubmit, 'click', (ee) => {
                // console.log('evento dentro del popup, imei: ', event.imei);
                // console.log('ps00: ', event.PS00);
                
                if (row.PS00) {
                    this.verFoto(row)
                } else {
                    if (row.PS01 !== '0') {
                        this.verFotoDobleCamara(row)
                    }
                }
            });
            /*****************************************************************/
            
        }, (error) => {
            console.log(error);
        });
    }

    buscarGeocerca() {

        // console.log(coleccion);

        const dialogRef = this.dialog.open(DialogBuscarGeocercaComponent, {
        width: '600px',
        data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
            // Abrimos el popup del marker circular o poligonal
            // this.mapService.markersGeocercas.push({id: circle._leaflet_id, marker: circle});
            if (result) {
                for (let i in this.localStorageService.geocercas) {
                    if (result.geocerca.id_geocerca === this.localStorageService.geocercas[i].id_geocerca) {
                        const result2 = this.mapService.markersGeocercas.find(marker => marker.id === result.geocerca.idLeaflet);
                        if (result2 !== undefined) {
                            // console.log('Esta visisble');
                            result2.marker.openPopup();
                        } else {
                            // console.log('encontro id sin visibilidad');
                            this.dibujarGeocercasPopupOpen(result.geocerca.id_geocerca);
                        }
                    }
                }
            }
        });
    }

    dibujarGeocercasPopupOpen(idGeocerca: any) {
        // console.log('GRUPOS SELECCIONADOS: ', );
        // tslint:disable-next-line: forin
        for (let i in this.localStorageService.geocercas) {

            if (this.localStorageService.geocercas[i].id_geocerca === idGeocerca) {
                if (Boolean(JSON.parse(this.localStorageService.geocercas[i]['circular'])) === true) {
                    // insertamos una geocerca cirular al mapa
                    // tslint:disable-next-line: no-string-literal
                    const lat = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lat;
                    // tslint:disable-next-line: no-string-literal
                    const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lng;
                    // tslint:disable-next-line: no-string-literal
                    const radio = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].radio;

                    let circle = new L.circle([lat, lng], radio);
                    /*let circle = L.circleMarker([lat, lng], {
                        // renderer: this.myRenderer, 
                        radius: 10
                    });*/
                    circle.type = 'G';
                    circle.addTo(this.mapService.rootMap);
                    /*circle.on('dblclick', (e) => {
                        circle.enableEdit();
                    });*/

                    const radioC = parseFloat(String(radio)).toFixed(1);
                    const latC =  parseFloat(String(lat)).toFixed(7);
                    const lngC =  parseFloat(String(lng)).toFixed(7);

                    const contenido = `<h6>${this.localStorageService.geocercas[i]['nombre_geocerca']}</h6>
                                        <p style="margin-bottom:0px">
                                            Colección: <strong>${this.localStorageService.geocercas[i]['nombre_coleccion'][0]['nombre']}</strong>
                                        </p>
                                        <p style="margin-bottom:0px">
                                            ID: ${this.localStorageService.geocercas[i]['id_geocerca']}
                                        </p>
                                        <p style="margin-bottom:0px">
                                            Radio: ${radioC} m
                                        </p>
                                        <p style="margin-bottom:0px">
                                            Coordenadas: ${latC} , ${lngC}
                                        </p>`;
                    circle.bindPopup(contenido);
                    circle.on('dblclick', L.DomEvent.stop).on('dblclick', circle.toggleEdit);
                    /*circle.on('click', (e) => {
                        circle.openPopup();
                    });
                    circle.on('click', (e) => {
                        circle.closePopup();
                    });*/
                    // insertamos el marcador circular al array de markers Circles
                    this.mapService.markersGeocercas.push({id: circle._leaflet_id, marker: circle});
                    this.mapService.rootMap.addLayer(circle);

                    // this.editableLayers.addLayer(circle);
                    this.localStorageService.geocercas[i].idLeaflet = circle._leaflet_id;
                    this.mapService.geocercas.push(this.localStorageService.geocercas[i]);
                    circle.openPopup();
                    /*var latLon = L.latLng(lat, lng);
                    var bounds = latLon.toBounds(2000); // 500 = metres
                    this.mapService.rootMap.panTo(latLon).fitBounds(bounds);*/
                    this.mapService.rootMap.panTo(new L.LatLng(lat, lng));
                } else {

                    // ordenar objetos por atributos
                    // tslint:disable-next-line: max-line-length
                    const dataOrdenado =  this.localStorageService.geocercas[i]['coordenada_geocerca'].sort(function(a, b) { return a.orden - b.orden; });
                    // console.log('data ordeando: ', dataOrdenado);
                    const latLngs: any[] = [];
                    // tslint:disable-next-line: forin
                    for (const j in this.localStorageService.geocercas[i]['coordenada_geocerca']) {
                        // tslint:disable-next-line: no-string-literal
                        const lat =this.localStorageService.geocercas[i]['coordenada_geocerca'][j].lat;
                        // tslint:disable-next-line: no-string-literal
                        const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][j].lng;
                        latLngs.push([lat, lng]);
                    }
                    let polygon = L.polygon(latLngs);
                    polygon.type = 'G';
                    polygon.addTo(this.mapService.rootMap);
                    //  polygon.enableEdit();
                    const contenido = `<h6>${this.localStorageService.geocercas[i]['nombre_geocerca']}</h6>
                                        <p style="margin-bottom:0px">
                                            Colección: <strong>${this.localStorageService.geocercas[i]['nombre_coleccion'][0]['nombre']}</strong>
                                        </p>
                                        <p style="margin-bottom:0px">
                                            ID Geocerca: ${this.localStorageService.geocercas[i]['id_geocerca']}
                                        </p>`;
                    polygon.bindPopup(contenido);
                    polygon.on('dblclick', L.DomEvent.stop).on('dblclick', polygon.toggleEdit);
                    /*polygon.on('click', (e) => {
                        polygon.openPopup();
                    });
                    polygon.on('click', (e) => {
                        polygon.closePopup();
                    });*/
                    /*polygon.on('dblclick', L.DomEvent.stop).on('dblclick', polygon.toggleEdit);*/

                    this.mapService.markersGeocercas.push({id: polygon._leaflet_id, marker: polygon});

                    this.localStorageService.geocercas[i].idLeaflet = polygon._leaflet_id;
                    this.mapService.geocercas.push(this.localStorageService.geocercas[i]);
                    polygon.openPopup();
                    // centrar
                    /*var latLon = L.latLng(polygon.getBounds().getCenter().lat, polygon.getBounds().getCenter().lng);
                    var bounds = latLon.toBounds(2000); // 500 = metres
                    this.mapService.rootMap.panTo(latLon).fitBounds(bounds);
                    console.log('center poly', polygon.getBounds().getCenter());*/
                    this.mapService.rootMap.panTo(new L.LatLng(polygon.getBounds().getCenter().lat, polygon.getBounds().getCenter().lng));
                }
            } else {
                // console.log('no hay resultados geocercas');
            }
        }
    }

    cambiarIdioma(idioma) {
        // console.log(this.localStorageService.usuario.usuario.idioma);
        this.localStorageService.usuario.usuario.idioma = idioma;
        this.localStorageService.guardarStorage(this.localStorageService.usuario);
        // tslint:disable-next-line: max-line-length
        this.restService.cambiarIdioma(this.localStorageService.usuario.usuario.id_usuario, idioma).subscribe((res) => {
            // console.log(res);
            this.reload();
        }, (err) => {
            console.log(err);
        });
    }

    virtualizaciónLeaflet() {

    }

    verViajes(nombre) {
        // visibilidad de contenedores
        this.mapService.contenedorVehiculos = false;
        this.mapService.contenedorDetalleViajes = true;
 
        this.imeiSeleccionadoEnviaje = this.imeiSeleccionado;

        this.imeiSeleccionado = '';

        // console.log('imei viaje', this.imeiSeleccionadoEnviaje);
        // console.log('ime primero: ', this.imeiSeleccionado);
        const fechaInicio = moment().format('YYYY-MM-DD');
        const fechaFin = moment().format('YYYY-MM-DD');

        // convertir fecha y hora local a hora UTC
        const utcStart = moment(fechaInicio + 'T00:00:00', 'YYYY-MM-DDTHH:mm:ss').utc();
        // console.log('fecha inicial', utcStart.format());
        // hora final
        const utcEnd = moment(fechaFin + 'T23:59:59', 'YYYY-MM-DDTHH:mm:ss').utc();

        this.obtenerDetallesViajes(this.imeiSeleccionadoEnviaje, String(utcStart.format()), String(utcEnd.format()), nombre);

        
    }

    obtenerDetallesViajes(imei: string, fInit: string, fFin: string, nombre: string) {

        const factory = this.componentFactoryResolver.resolveComponentFactory(DetallesViajesComponent);

        // ref.changeDetectorRef.detectChanges();
        this.detalleViajeContainer.clear();

        // pasar parametros al componente que estamos llamando
        const dyynamicComponent = this.detalleViajeContainer.createComponent(factory).instance as DetallesViajesComponent;

        // enviamos parametros
        dyynamicComponent.someProp = 'Hola hijo';
        dyynamicComponent.imei = imei;
        dyynamicComponent.fechaInit = fInit;
        dyynamicComponent.fechaFin = fFin;
        dyynamicComponent.nombreVehiculo = nombre;
    }

    verDetalleVehiculoSeleccionado() {

        const dialogRef = this.dialog.open(DialogDetalleVehiculoComponent, {
            width: '600px',
            data: { imei: this.imeiSeleccionado}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    popupDetalleEvento(event) {

        // console.log(event);
        this.mapService.rootMap.closePopup();
            
        if (this.mapService.popupEvent !== undefined) {
            this.mapService.popupEvent.remove();
        }

        const horaConvertida = moment.utc(event.event_time).local().format('YYYY-MM-DD LTS');

        const contenido = ` <h6 class="d-flex justify-content-between">
                                <div>${horaConvertida}</div>
                            </h6>
                            <div style="margin-top:0px; margin-bottom:16px; font-weight: 300;font-size: 13px;">
                                <i class="fas fa-bell"></i>
                                ${event.etiqueta} [${event.evento}]
                            </div>
                            <div style="margin-top:0px; margin-bottom:16px; font-weight: 300;font-size: 13px;">
                                <i class="fas fa-tachometer-alt"></i> 
                                ${event.vel} km/h
                            </div>
                            <div style="margin-top:0px; margin-bottom:16px; font-weight: 300;font-size: 13px;">
                                <i class="fas fa-map-marker-alt"></i>
                                ${event.address}
                            </div>
                            <div class=" text-center">
                                <img src="" height="100" class="img-fluid rounded mx-auto d-block img-thumbnail"/>
                            </div>`;

        this.mapService.popupEvent = L.popup().setLatLng([event.lat, event.lng]).setContent(contenido).addTo(this.mapService.rootMap);
    }

    public keyPress() {
        // console.log(event.target.value);
        // console.log('cantidad vehiculos: ', this.vehiculos.length);
        // console.log('cantidad vehiculos: ', this.localStorageService.vehiculos.length);
        // console.log('cantidad vehiculos filtrado: ', this.localStorageService.vehiculosFiltros);
    }

    scroll(scrollIndex: number) {
        // this.viewPortDetalle.scrollToIndex(scrollIndex, 'smooth');
    }

    crearMarcadoresCirculares() {

        for (const i in this.arrayLatLng) {

            if (this.arrayLatLng[i][3] == -1) {

                if (this.arrayLatLng[i][4] == 1) {
                    // console.log('nombre etiqueta',this.arrayLatLng[i][5]);

                    // con icono de etiqueta y colores
                    const iconDiv = L.divIcon({
                        className: this.mapService.getSizeIconPhotoCamera(),
                        html: `<i class='material-icons' style="color: ${this.arrayLatLng[i][6]}">${this.arrayLatLng[i][5]}</i>`,
                        text: 'texto'
                    });

                    var marker = L.marker([this.arrayLatLng[i][0], this.arrayLatLng[i][1]], {
                        icon: iconDiv,
                    });
    
                    marker.name = this.arrayLatLng[i][2];
                    marker.type = 'label';
                    marker.name_icon = this.arrayLatLng[i][5];
                    marker.color_icon = this.arrayLatLng[i][6];
    
                    marker.on('click', (ev) => {
    
                        const index = this.mapService.viajeSeleccionado.findIndex((v) => v.id === ev.target.name);
        
                        // console.log('index encontrado: ', this.mapService.viajeSeleccionado[0].id);
                        if (index > -1) {
                            // this.scroll(index);
                            // this.itemSelectDetails = index;
                            this.infoPopup(this.mapService.viajeSeleccionado[index]);
                        }
                    });
    
                    marker.addTo(this.mapService.rootMap);

                } else {
                    // sin icono de etiqueta
                    var circleMarker = L.circleMarker([this.arrayLatLng[i][0], this.arrayLatLng[i][1]], {
                        // renderer: this.myRenderer, 
                        radius: this.mapService.getRadiusAccordingToMapZoom(),
                        stroke: true,
                        color: 'white',
                        opacity: 1,
                        weight: 1,
                        fill: true,
                        fillColor: '#1A31E2',
                        fillOpacity: 1
                    });

                    // circleMarker.bindPopup(contenido);
    
                    // eventos hover entro punto
                    circleMarker.on('mouseover', (ev) => {
                        // ev.target => hace referencia al circleMarker (variable recien creado)
        
                        // console.log('entro hover marker circle');
                        // ev.target.openPopup();
                        ev.target.setRadius(10);
                        ev.target.setStyle({fillColor: '#ff5722'});
                    });
        
                    // evento hover salio punto
                    circleMarker.on('mouseout', (ev) => {
                        // ev.target => hace referencia al circleMarker (variable recien creado)
        
                        // console.log('salio hover marker');
                        this.mapService.zoomCircleMarker(ev.target);
                        ev.target.setStyle({fillColor: '#1A31E2'});
                    });
        
                    circleMarker.name = this.arrayLatLng[i][2];
        
                    circleMarker.on('click', (ev) => {
                        
                        const index = this.mapService.viajeSeleccionado.findIndex((v) => v.id === ev.target.name);
        
                        // console.log('index encontrado: ', this.mapService.viajeSeleccionado[0].id);
                        if (index > -1) {
                            // this.scroll(index);
                            // this.itemSelectDetails = index;
                            this.infoPopup(this.mapService.viajeSeleccionado[index]);
                        }
                    });
        
                    circleMarker.addTo(this.mapService.rootMap);
                }
            } else {
                const iconDiv = L.divIcon({
                    className: this.mapService.getSizeIconPhotoCamera(),
                    html: `<i class='material-icons' style="color: black">photo_camera</i>`,
                    text: 'texto'
                });
                var marker = L.marker([this.arrayLatLng[i][0], this.arrayLatLng[i][1]], {
                    icon: iconDiv,
                });

                marker.name = this.arrayLatLng[i][2];
                marker.type = 'photo';
                marker.name_icon = 'photo_camera';
                marker.color_icon = 'black';

                marker.on('click', (ev) => {

                    const index = this.mapService.viajeSeleccionado.findIndex((v) => v.id === ev.target.name);
    
                    // console.log('index encontrado: ', this.mapService.viajeSeleccionado[0].id);
                    if (index > -1) {
                        // this.scroll(index);
                        // this.itemSelectDetails = index;
                        this.infoPopup(this.mapService.viajeSeleccionado[index]);
                    }
                });

                marker.addTo(this.mapService.rootMap);
            } 
        }
    }

    infoPopup(event) {
        
        let ps = '0';

        if (event.PS00 === undefined || event.PS00 === '') {
            ps = event.PS00;
        }

        this.mapService.rootMap.closePopup(); 
        if (this.mapService.popupEvent) {
            this.mapService.popupEvent.closePopup();
            this.mapService.popupEvent.remove();
            this.mapService.popupEvent.removeFrom(this.mapService.rootMap);
        }

        this.mapService.popupEvent = L.popup();
        this.mapService.popupEvent.setLatLng([event.lat, event.lng]);
        this.mapService.popupEvent.setContent(this.mapService.contenidoPopupEspera());
        this.mapService.popupEvent.addTo(this.mapService.rootMap);

        this.restService.obtenerImagen(event.imei, event.PS00).subscribe((data) => {

            this.mapService.popupEvent.setContent(this.mapService.contenidoPopup(event, data));

            // generar eventos dentro del popup seleccionado
            /*****************************************************************/
            const buttonSubmit = L.DomUtil.get('_'+event.PS00);

            L.DomEvent.addListener(buttonSubmit, 'click', (ee) => {
                // console.log('evento dentro del popup, imei: ', event.imei);
                // console.log('ps00: ', event.PS00);
                
                if (event.PS00) {
                    this.verFoto(event)
                } else {
                    if (event.PS01 !== '0') {
                        this.verFotoDobleCamara(event)
                    }
                }
            });
            /*****************************************************************/
        }, (error) => {
            console.log(error);
        });
    }

    contenidoPopup(event, data) {

        const horaConvertida = moment(event.event_time).format('YYYY-MM-DD LTS');

        const contenido = `<h6 class="d-flex justify-content-between" style="margin-bottom: 3px; font-size:15px">
                                    <div>${horaConvertida}</div>
                                </h6>
                                <div style="margin-top:0px; margin-bottom:3px; font-weight: 300;font-size: 13px;">
                                    <i class="fas fa-bell"></i>
                                    ${event.etiqueta} [${event.evento}]
                                </div>
                                <div style="margin-top:0px; margin-bottom:3px; font-weight: 300;font-size: 13px;">
                                    <i class="fas fa-tachometer-alt"></i> 
                                    ${Number(Number(event.vel) * 1.609).toFixed(2)} km/h
                                </div>
                                <div style="margin-top:0px; margin-bottom:3px; font-weight: 300;font-size: 13px;margin-left: 1px">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${event.address}
                                </div>
                                <div style="margin-top:0px; margin-bottom:3px; font-weight: 300;font-size: 13px;margin-left:2px">
                                    <i class="fas fa-map-pin"></i>
                                    ${event.lat}, ${event.lng}
                                </div>
                                <div class=" text-center">
                                    <img src="${data['data']}" height="100" style="cursor: pointer;" class="img-fluid rounded mx-auto d-block img-thumbnail img_click"  id="_${event.PS00}"/>
                                </div>`;
        return contenido;
    }
}
