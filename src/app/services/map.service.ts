import { Injectable, Input, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { ArrayMarkers } from '../interfaces/arrayMarkers';
import { Device } from '../interfaces/device';
import {Howl, Howler} from 'howler';
// With ES6-style imports
import * as Nominatim from "nominatim-browser";
import { NominatimResponse } from 'nominatim-browser';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from './local-storage.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DetallesViajesComponent } from '../components/detalles-viajes/detalles-viajes.component';
import { Observable } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';


declare let L;

@Injectable({
  providedIn: 'root'
})
export class MapService {
    // *******************************************************************************************
    // propiedades generales (uso en dos o mas modulos)
    // mapa raiz que tendrá las referencia a los objetos creados en los distintos modulos
    public rootMap: any;
    // layer de google que se ocupara para tener una mejor presentacion en el mapa
    public googleLayer: any;
    // control de zoom mapa
    public controlZoom: any;
    // manejos de tooltip
    public tooltip: any;
    // *******************************************************************************************
    // propiedades para modulo Monitoreo
    // Inicializamos todos los marker vacios
    public arrayMarkers: ArrayMarkers[] = [];
    public arrayLatLng: any = [];
    public viajeSeleccionado: any[] = [];
    public polyline: any;
    // rango de marker
    public markerInit: any;
    public markerEnd: any;
    public markerClusterGroup: any;
    // lista de vehiculos
    public vehiculos: any;
    // *******************************************************************************************
    // propiedades para modulo geocerca
    public popupEvent: any;
    public markersGeocercas: any[] = [];
    public geocercas: any[] = [];
    // *******************************************************************************************
    public contenedorVehiculos = true;
    public contenedorDetalleViajes = false;
    public dato = '';
    public direccion = '';
    public polyLineMonitoreo: any;

    public sound: any;

    // tslint:disable-next-line: new-parens
    public geocoder = new google.maps.Geocoder;

    public ciLayer: any;

    // valores temporales para obtener datos de la posicion de la lista de detalle eventos
    public eventos: any[] = [];

    public colores = ['#4a148c', '#ff1744', '#00acc1', '#00c853', '#b8cc00', '#ff5722', '#484848',
                    '#484848', '#6d4c41', '#6d4c41', '#707070', '#b71c1c', '#7b1fa2', '#ee98fb',
                    '#3d5afe', '#98ee99', '#ffeb3b', '#0100ca', '#26c6da', '#26c6da', '#0095a8',
                    '#ffff1a', '#e6188c', '#552cd7', '#33f41e', '#ff8120', '#f21e9f', '#1de7e7',
                    '#ff2020', '#1de7e7', '#ffb520' , '#1de9c1', '#ffac20', '#267500', '#691000'];
    
    constructor(public restService: RestService,
                public localStorageService: LocalStorageService,
                public wsService: WebsocketService) {
        // console.log('se ejecutó mapService');
        this.sonidoRepetitivo();
        // conectar con el websocket manualmente
    }

    // cuenta la cantidad de tiempo que ha estado sin reportar un equipo
    // toma como parametros el tiempo del equipo en segundos
    // y lo convierte en segundos, minutos, horas, días
    public tiempoSinConexion(time: number, text1: string, text2: string): string {

        // text 2 = ago
        if (time === 0) {
            return text1 ;
        } else {
            if (time <= 60) {
                if (text2 !== 'ago') {
                    return text2 + ' ' + time + ' s'; // simbolo de segundo
                } else {
                    return time + ' s ' + text2; // simbolo de segundo
                }
                
            } else {
                if (time > 60 && time <= 3600) {
                    if (Math.trunc((time / 60)) === 1) {
                        if (text2 !== 'ago') {
                            return text2 + ' ' + Math.trunc((time / 60)) + ' min'; // simbolo de minutos
                        } else {
                            return Math.trunc((time / 60)) + ' min ' + text2; // simbolo de minutos
                        }
                        
                    } else {
                        if (text2 !== 'ago') {
                            return text2 + ' ' + Math.trunc((time / 60)) + ' mins'; // simbolo de monutos
                        } else {
                            return Math.trunc((time / 60)) + ' mins ' + text2; // simbolo de monutos
                        }
                        
                    }
                } else {
                    if (time > 3600 && time <= 86400) {
                        if (Math.trunc((time / 3600)) === 1) {
                            if (text2 !== 'ago') {
                                return text2 + ' ' + Math.trunc((time / 3600)) + ' h'; // simbolo de horas
                            } else {
                                return Math.trunc((time / 3600)) + ' h ' + text2; // simbolo de horas
                            }
                            
                        } else {
                            if (text2 !== 'ago') {
                                return text2 + ' ' + Math.trunc((time / 3600)) + ' h'; // simbolo de horas
                            } else {
                                return Math.trunc((time / 3600)) + ' h ' + text2; // simbolo de horas
                            }
                            
                        }
                    } else {
                        if (time > 86400 && time < 172800) {
                            if (text2 !== 'ago') {
                                return text2 + ' ' + Math.trunc((time / 86400)) + ' d'; // simbolo de días
                            } else {
                                return Math.trunc((time / 86400)) + ' d ' + text2; // simbolo de días
                            }
                             
                        } else {
                            if (text2 !== 'ago') {
                                return text2 + ' ' + Math.trunc((time / 86400)) + ' d'; // simbolo de días
                            } else {
                                return Math.trunc((time / 86400)) + ' d ' + text2; // simbolo de días
                            }
                             
                        }
                    }
                }
            }
        }
    }

    public tiempoParqueo(ign: string, timerParking: number, text1: string, text2: string, text3: string): string {
        // console.log('tiempo parqueo kkk: ', timerParking);
        if (ign === 'off') {
            if (timerParking === 0) {
                return text1;
            } else {
                if (timerParking >= 60 && timerParking <= 3600) {
                    if (Math.trunc((timerParking / 60)) === 1) {
                        return text2 + ' ' + Math.trunc((timerParking / 60)) + ' min';
                    } else {
                        return text2 + ' ' + Math.trunc((timerParking / 60)) + ' min';
                    }
                } else {
                if (timerParking > 3600 && timerParking <= 86400) {
                    if (Math.trunc((timerParking / 3600)) === 1) {
                        let hour = Math.floor(timerParking / 3600);
                        hour = Number((hour < 10) ? '0' + hour : hour);
                        let minute = Math.floor((timerParking / 60) % 60);
                        minute = Number((minute < 10) ? '0' + minute : minute);
                        let second = timerParking % 60;
                        second = Number((second < 10) ? '0' + second : second);
                        // return hour + ':' + minute + ':' + second;
                        return text2 + ' ' + hour + ' h ' + minute + ' min';
                    } else {
                        let hour = Math.floor(timerParking / 3600);
                        hour = Number((hour < 10) ? '0' + hour : hour);
                        let minute = Math.floor((timerParking / 60) % 60);
                        minute = Number((minute < 10) ? '0' + minute : minute);
                        let second = timerParking % 60;
                        second = Number((second < 10) ? '0' + second : second);
                        return text2 + ' ' + hour + ' h ' + minute + ' min';
                    }
                } else {
                        var numdays = Math.floor(timerParking / 86400);
                        var numhours = Math.floor((timerParking % 86400) / 3600);
                        var numminutes = Math.floor(((timerParking % 86400) % 3600) / 60);
                        var numseconds = ((timerParking % 86400) % 3600) % 60;
                        if (numdays === 1) {
                            return text2 + ' ' + numdays + ' d ' + numhours + ' h';
                        } else {
                            return text2 + ' ' + numdays + ' d ' + numhours + ' h';
                        }
                    }
                }
            }
        } else {
            return text3;
        }
    }

    public tiempoMovimiento(ign: string, timerMoving: number, texto1: string, texto2: string): string {
        // console.log('tiempo movimiento gggg: ', timerMoving);
        if (ign === 'on') {
            if (timerMoving === 0) {
                return texto1;
            } else {
                if (timerMoving >= 60 && timerMoving <= 3600) {
                    if (Math.trunc((timerMoving / 60)) === 1) {
                        return texto2 + ' ' + Math.trunc((timerMoving / 60)) + ' min';
                    } else {
                        return texto2 + ' ' + Math.trunc((timerMoving / 60)) + ' min';
                    }
                } else {
                    if (timerMoving > 3600 && timerMoving <= 86400) {
                        if (Math.trunc((timerMoving / 3600)) === 1) {
                            let hour = Math.floor(timerMoving / 3600);
                            hour = Number((hour < 10) ? '0' + hour : hour);
                            let minute = Math.floor((timerMoving / 60) % 60);
                            minute = Number((minute < 10) ? '0' + minute : minute);
                            let second = timerMoving % 60;
                            second = Number((second < 10) ? '0' + second : second);
                            return texto2 + ' ' + Math.trunc((timerMoving / 3600)) + ' h ' + minute + ' min';
                        } else {
                            let hour = Math.floor(timerMoving / 3600);
                            hour = Number((hour < 10) ? '0' + hour : hour);
                            let minute = Math.floor((timerMoving / 60) % 60);
                            minute = Number((minute < 10) ? '0' + minute : minute);
                            let second = timerMoving % 60;
                            second = Number((second < 10) ? '0' + second : second);
                            return texto2 + ' ' + Math.trunc((timerMoving / 3600)) + ' h ' + minute + ' min';
                        }
                    } else {
                        const numdays = Math.floor(timerMoving / 86400);
                        const numhours = Math.floor((timerMoving % 86400) / 3600);
                        const numminutes = Math.floor(((timerMoving % 86400) % 3600) / 60);
                        const numseconds = ((timerMoving % 86400) % 3600) % 60;
                        if (numdays === 1) {
                            return texto2 + ' ' + numdays + ' d ' + numhours + ' h ';
                        } else {
                            return texto2 + ' ' + numdays + ' d ' + numhours + ' h ';
                        }
                    }
                }
            }
        } else {
            return '';
        }
    }

    // convertimos fecha UTC a LOCAL
    public converterUTCToLocalDate(event) {
        return moment.utc(event).local().format('YYYY-MM-DD');
    }

    // convertimos hora UTC a hora Local
    public converterUTCToLocalTime(event) {
        return moment.utc(event).local().format('HH:mm:ss');
    }

    // convertimos hora local a formato de solo horas ej: 12:45:15 pm
    public convertAmPm(event) {
        return moment(event, 'hh:mm:ss').format('LTS');
    }

    // popup de marcador
    public contenidoPopupMarker(    texto: any,
                                    nombre: string,
                                    colorOnline: string,
                                    textOnline: string,
                                    timeConection,
                                    ultEvento: string,
                                    horaConvertida: string,
                                    onOff: string,
                                    apagadoEncendido: string,
                                    ultVel: string,
                                    labelParking: string,
                                    address: string,
                                    nomGeo: string,
                                    iconParkingMoving: string,
                                    bl: any,
                                    fuente: any,
                                    imei: string,
                                    conductor: string,
                                    fecha_fuente: string) {

        // Calculamos el porcentaje de la bateria segun el miliVoltio
        // el 100% es cuando está a 5167 mV
        // usamos la regla de 3 para hacer el calculo
        const porcentaje = Math.round((Number(bl) * 100) / 4451);
        // icono segun el porcentale
        // 100 - 80 % ------> fas fa-battery-full ************** color verde
        // 80 - 60 %  ------> fas fa-battery-three-quarters **** color verde
        // 60 - 40 %  ------> fas fa-battery-half ************** color anaranjado
        // 40 - 20 %  ------> fas fa-battery-quarter *********** color anaranjado
        // 20 - 0 %   ------> fas fa-battery-empty ************* color rojo
        let iconoBateria = 'fas fa-battery-empty';
        let colorBateria = 'red';
        
        if (porcentaje <= 100 && porcentaje >= 80) {
            iconoBateria = 'fas fa-battery-full';
            colorBateria = 'green';
        } else {
            if (porcentaje < 80 && porcentaje >= 60) {
                iconoBateria = 'fas fa-battery-three-quarters';
                colorBateria = 'green';
            } else {
                if (porcentaje < 60 && porcentaje >= 40) {
                    iconoBateria = 'fas fa-battery-half';
                    colorBateria = 'orange';
                } else {
                    if (porcentaje < 40 && porcentaje >= 20) {
                        iconoBateria = 'fas fa-battery-quarter';
                        colorBateria = 'orange';
                    } else {
                        iconoBateria = 'battery-empty';
                        colorBateria = 'red';
                    }
                }
            }           
        }

        // color fuente conectada
        // 45 -- perdidad de energia
        // 46 -- restauracion de energia
        let colorFuente = 'red';
        let fechaFuente = '';
        if ( Number(fuente) === 45) {
            // 45
            colorFuente = 'red';
            fechaFuente = `${this.localStorageService.lenguaje.lan310}: ${ this.convetirHoraLocal(fecha_fuente) }`;
        } else {
            // 46
            colorFuente = 'green';
            fechaFuente = `${this.localStorageService.lenguaje.lan311}: ${ this.convetirHoraLocal(fecha_fuente) }`;
        }

        return `<h5 class="d-flex justify-content-between" style="margin-bottom: -5px">
                    <p style="font-size: 17px !important; font-family: Roboto !important;margin-bottom:5px !important">${ nombre }</p>
                    <div style="color: ${ colorOnline };font-size: 13px" class="d-flex align-items-center">
                        <i class="fas fa-circle"></i>
                    </<div>
                </h5>
                <span class="d-flex justify-content-between" style="margin-bottom: 2px !important">
                    <span style="font-size: 11px; font-size: 12px !important;font-family: Roboto !important;font: 400 11px Roboto,Arial,sans-serif;">
                        Conductor: ${conductor}
                    </span>
                </span>
                <hr style="margin-top:0px; margin-left:-19px; margin-right:-19px; margin-bottom: 2px">
                <p style="margin-bottom: 0px !important">
                    <span class="d-flex justify-content-between">
                        <span class="font-size-12">
                            <i class="fas fa-power-off" style="color: ${ onOff }; margin-right: 3px"></i>
                            ${ apagadoEncendido }
                        </span>
                       
                    </span>
                </p>
                <p style="margin-bottom: 0px !important">
                    <span class="d-flex justify-content-between">
                        <span class="font-size-12">
                            <i class="${iconParkingMoving}" style="margin-right: 4px"></i>
                            ${ labelParking }
                        </span>
                        
                    </span>
                </p>
                <hr style="margin-top:0px; margin-left:-19px; margin-right:-19px;margin-bottom:0px !important">
                <p style="margin-bottom: 0px !important; font-size: 12px !important">
                    <i class="fas fa-map-marker-alt" style="margin-right: 5px"></i>
                    ${ address }
                </p>`;
    }

    public contenidoPopup(event, data) {

        let icono = '';
        let icono_color = 'black';
        // definimos los datos para el icono en el popup
        if (event.PS00 != '') {
            // icono con foto (marker)
           icono = 'photo_camera';
           icono_color = 'black';
        } else {
            if (event.icono === 1) {
                // con icono etiqueta (marker)
                icono = event.descripcion_icono;
                icono_color = event.color_icono;
            } else {
                // sin icono de etiqueta (circle marker)
                icono = 'fiber_manual_record';
                icono_color = '#1A31E2';
            }
        }

        const horaConvertida = moment(event.event_time).format('YYYY-MM-DD LTS');

        const contenido = `<div style="min-width:250px !important;max-width:250px !important">
                                <h6 class="d-flex justify-content-between" style="margin-bottom: 3px; font-size:15px">
                                    <div>${horaConvertida}</div>
                                </h6>
                                <div style="margin-top:0px; margin-bottom:3px; font-weight: 300;font-size: 13px;">
                                <i class='material-icons' style="color: ${icono_color}; font-size: 17px;float: left;">${icono}</i>
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
                                </div>
                            </div>`;
        return contenido;
    }

    public contenidoPopupEspera(): string {
        return `<div class="spinner-box">
                    <div class="configure-border-1">  
                    <div class="configure-core"></div>
                    </div>  
                    <div class="configure-border-2">
                    <div class="configure-core"></div>
                    </div> 
                </div>`;
    }

    public contenidoGeocercas(data): string {
        return `<h6>${data.nombreGeocerca}</h6>
                <p style="margin-bottom:0px !important">
                    Colección: <strong>
                    ${data.nombreColeccion}
                    </strong>
                </p>
                <p style="margin-bottom:0px !important">
                    ID: ${data.idGeocerca}
                </p>
                <p style="margin-bottom:0px !important">
                    Radio: ${data.radio} m
                </p>
                <p style="margin-bottom:0px !important">
                    Coordenadas: ${data.lat} , ${data.lng}
                </p>`;
    }

    public contenidoGeocercasPoligonal(data): string {
        return `<h6>${data.nombreGeocerca}</h6>
                <p style="margin-bottom:0px !important">
                    Colección: <strong>${data.nombreColeccion}</strong>
                </p>
                <p style="margin-bottom:0px !important">
                    ID Geocerca: ${data.idGeocerca}
                </p>`;
    }

    convetirHoraLocal(event_time) {
        return moment.utc(event_time).local().format('YYYY-MM-DD HH:mm:ss');
    }

    // método que resuelve direcciones con coordenada de lat y lng como parametros
    // retorna una promesa
    public async geocodeLatLng(lat1: number, lng1: number): Promise<string> {
        // console.log('lat y lng',lat1, lng1);
        return new Promise<string>((resolve, reject) => {
            L.esri.Geocoding.reverseGeocode().latlng([lat1, lng1]).run((error, result, response) => {
                // tslint:disable-next-line: no-string-literal
                // console.log(result);

                if(result !== undefined) {
                    // console.log('resultados',result);
                    // console.log('respuesta',response);
                    resolve(result['address']['Match_addr']);
                } else {
                    resolve('problema temporal de dirección');
                }

            });
        });
    }

    public geocodeLatLngGoogle(lat1: number, lng1: number): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            const latlng = {lat: lat1, lng: lng1};

            this.geocoder.geocode({'location': latlng}, (results, status) => {

                if (status === 'OK') {
                    // console.log('RESULTADOSGEO: ', results);
                    resolve(results[0].formatted_address);
                    // console.log('ESTATUS: ', status);
                    // address_components: (4) [{…}, {…}, {…}, {…}]
                    // formatted_address: "Prolongación 3a Calle Poniente, Pasaje Los Ángeles, Armenia, El Salvador"
                    // geometry: {location: _.I, location_type: "GEOMETRIC_CENTER", viewport: _.Bf}
                    // place_id: "ChIJIzvi7T7bYo8RBec_ka7NztQ"
                    // plus_code: {compound_code: "PFWV+WV Armenia, El Salvador", global_code: "765GPFWV+WV"}
                    // types: (2) ["establishment", "point_of_interest"]
                    /*if (results[0]['address_components'].length === 5) {
                        if (results[0]['address_components'][0]['long_name'] === 'Unnamed Road') {
                            // tslint:disable-next-line: max-line-length
                            const nombreFormateado = `${results[0]['address_components'][1]['long_name']},
                                                    ${results[0]['address_components'][2]['long_name']},
                                                    ${results[0]['address_components'][3]['short_name']}`;
                            resolve(nombreFormateado);
                        } else {
                            const nombreFormateado = `${results[0]['address_components'][0]['long_name']},
                                                    ${results[0]['address_components'][1]['long_name']},
                                                    ${results[0]['address_components'][2]['long_name']},
                                                    ${results[0]['address_components'][3]['long_name']},
                                                    ${results[0]['address_components'][4]['short_name']}`;
                            resolve(nombreFormateado);
                        }
                    } else {
                        if (results[0]['address_components'][0]['long_name'] === 'Unnamed Road') {
                            // tslint:disable-next-line: max-line-length
                            const nombreFormateado = `${results[0]['address_components'][1]['long_name']},
                                                    ${results[0]['address_components'][2]['long_name']},
                                                    ${results[0]['address_components'][3]['short_name']}`;
                            resolve(nombreFormateado);
                        } else {
                            const nombreFormateado = `${results[0]['address_components'][0]['long_name']},
                                                    ${results[0]['address_components'][1]['long_name']},
                                                    ${results[0]['address_components'][2]['long_name']},
                                                    ${results[0]['address_components'][3]['short_name']}`;
                            resolve(nombreFormateado);
                        }
                    }*/

                } else {
                    resolve('problema temporal de dirección');
                }
            });
        });

    }

    public async geocodeLatLngNominatim(lat1: number, lng1: number): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            Nominatim.reverseGeocode({lat: String(lat1), lon: String(lng1), addressdetails: true}).then((result: NominatimResponse) => {
                // console.log(result.display_name);
                resolve(result.display_name);
            }).catch((error) => {
                resolve('problema temporal de dirección');
            });
        });
    }

    public async geocodeLatLngNominatimLocal(lat1: number, lng1: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.restService.nominatimLocal(lat1, lng1).subscribe((result) => {
                resolve(result['display_name']);
            }, (err) => {
                resolve('problema temporal de dirección');
            });
        });
    }

    // Algoritmo: Ray Casting (para evaluar si un marcador está dentro de un poligono)
    public isMarkerInsidePolygon(marker, poly) {
        // console.log('=====>', poly);
        let inside = false;
        const x = marker.getLatLng().lat;
        const y = marker.getLatLng().lng;
        for (let ii=0; ii<poly.getLatLngs().length; ii++) {
            // console.log('poly: ', poly.getLatLngs()[ii]);
            const polyPoints = poly.getLatLngs()[ii];
            for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
                const xi = polyPoints[i].lat;
                const yi = polyPoints[i].lng;
                const xj = polyPoints[j].lat;
                const yj = polyPoints[j].lng;

                const intersect = ((yi > y) !== (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
        }

        return inside;
    }

    // Algoritmo: Ray Casting (para evaluar si un marcador está dentro de un poligono)
    public isMarkerInsidePolygonPoint(lat, lng, poly) {
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

    // Algoritmo para evaluar si un marcador esta dentro de un circulo
    public isMarkerInsideCircle(map , marker, circle) {
        var d = map.distance([marker.getLatLng().lat, marker.getLatLng().lng], circle.getLatLng());
        var isInside = d < circle.getRadius();
        if(d < circle.getRadius()) {
            return true;
        } else {
            return false;
        }
    }

    public isMarkerInsideCirclePiont(map , lat , lng, latcircle, lngcircle, radio) {
        var d = map.distance([lat , lng], [latcircle, lngcircle]);
        var isInside = d < radio;
        if (d < radio) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 
     * Algoritmos de buscador de punto dentro de una geocerca version 2
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

        return finalDistance*1000;
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

    public getData() {
        return this.dato;
    }

    public cargarGeocerca() {
        console.log('se cargo una geocerca');
        L.circle([13.675825, -89.302846], {radius: 200}).addTo(this.rootMap);
    }

    public dibujarPolyLine(color1) {

        if (this.markerInit !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        }

        this.polyline = L.polyline(this.arrayLatLng).addTo(this.rootMap);

        // color de polyline
        this.polyline.setStyle({
            color: color1,
            weight: 2,
        });

        // marker personalizado al inicio del viaje
        var redMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'B',
            iconColor: 'white',
            markerColor: 'red',
            shape: 'circle',
            prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerInit = L.marker([this.arrayLatLng[0][0], this.arrayLatLng[0][1]], {icon: redMarker}).addTo(this.rootMap);

        this.markerInit.name = 'B';

        //  leaflet Extra Markers
        var redMarkerB = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'A',
            iconColor: 'white',
            markerColor: 'green',
            shape: 'circle',
            prefix: 'fa'
        });

        this.markerEnd = L.marker([this.arrayLatLng[(this.arrayLatLng.length - 1)][0], this.arrayLatLng[(this.arrayLatLng.length - 1)][1]], {icon: redMarkerB}).addTo(this.rootMap);
        this.markerEnd.name = 'A';

        // zoom map polyline
        this.rootMap.fitBounds(this.polyline.getBounds());
    }

    public dibujarPolyLine2(color1): number {

        if (this.markerInit !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        } else {
            // console.log('No está definido');
        }

        this.polyline = L.polyline(this.arrayLatLng).addTo(this.rootMap);
        // console.log(this.polyline._leaflet_id);
        // color de polyline
        this.polyline.setStyle({
            color: color1,
            weight: 2,
        });

        // marker personalizado al inicio del viaje
        var redMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'B',
            iconColor: 'white',
            markerColor: 'red',
            shape: 'circle',
            prefix: 'fa'
        });


        // tslint:disable-next-line: max-line-length
        this.markerInit = L.marker([this.arrayLatLng[0][0], this.arrayLatLng[0][1]], {icon: redMarker}).addTo(this.rootMap);

        this.markerInit.name = 'B';

        // fin marker personalizado
        //  leaflet Extra Markers
        var redMarkerB = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'A',
            iconColor: 'white',
            markerColor: 'green',
            shape: 'circle',
            prefix: 'fa'
        });

        

        // tslint:disable-next-line: max-line-length
        this.markerEnd = L.marker([this.arrayLatLng[(this.arrayLatLng.length - 1)][0], this.arrayLatLng[(this.arrayLatLng.length - 1)][1]], {icon: redMarkerB}).addTo(this.rootMap);

        this.markerEnd.name = 'A';
        // zoom map polyline
        this.rootMap.fitBounds(this.polyline.getBounds());
        // this.moverMapa(Number(this.arrayLatLng[0][0]), Number(this.arrayLatLng[0][1]));
        // agregar marcadores en el polyline
        // const marker = L.marker([ 13.670008, -89.2942199 ], {draggable: false}).addTo(this.mapRoot);
        // tslint:disable-next-line: forin
        for (const i in this.arrayLatLng) {
            // L.marker([ this.arrayLatLng[i][0], this.arrayLatLng[i][1] ], {draggable: false}).addTo(this.mapRoot);
            // CircleMarker
            // tslint:disable-next-line: max-line-length
            const horaConvertida = this.converterUTCToLocalDate(this.viajeSeleccionado[i]) + ' ' + this.convertAmPm(this.converterUTCToLocalTime(this.viajeSeleccionado[i]));
            const contenido = ` <h6 class="d-flex justify-content-between">
                                    <div>${horaConvertida}</div>
                                </h6>
                                <div style="margin-top:0px; margin-bottom:16px; font-weight: 300;font-size: 13px;">
                                    <i class="fas fa-bell"></i>
                                    ${this.viajeSeleccionado[i].etiqueta} [${this.viajeSeleccionado[i].evento}]
                                </div>
                                <div style="margin-top:0px; margin-bottom:16px; font-weight: 300;font-size: 13px;">
                                    <i class="fas fa-tachometer-alt"></i>
                                    ${this.viajeSeleccionado[i].vel} km/h
                                </div>
                                <div style="margin-top:0px; margin-bottom:16px; font-weight: 300;font-size: 13px;">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Espere ...
                                </div>`;

            var circleMarker = L.circleMarker([this.arrayLatLng[i][0], this.arrayLatLng[i][1]], {
                radius: this.getRadiusAccordingToMapZoom(),
                stroke: true,
                color: 'white',
                opacity: 1,
                weight: 1,
                fill: true,
                fillColor: '#1A31E2',
                fillOpacity: 1
            }).addTo(this.rootMap);
            circleMarker.bindPopup(contenido);
        }

        return this.polyline._leaflet_id;
    }

    public dibujarPolyLineSinAB(color1):number {

        if (this.markerInit !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        }

        this.polyline = L.polyline(this.arrayLatLng).addTo(this.rootMap);
        
        // color de polyline
        this.polyline.setStyle({
            color: color1,
            weight: 2,
        });

        for (const i in this.arrayLatLng) {
            L.circleMarker([this.arrayLatLng[i][0], this.arrayLatLng[i][1]], {
                radius: 5,
                stroke: true,
                color: 'white',
                opacity: 1,
                weight: 1,
                fill: true,
                fillColor: '#1A31E2',
                fillOpacity: 1
            }).addTo(this.rootMap);
        }

        return this.polyline._leaflet_id;
    }

    public dibujarPolyLineSinMarker(color1) {

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        } 
        
        this.polyLineMonitoreo = L.polyline(this.arrayLatLng).addTo(this.rootMap);
        // color de polyline
        this.polyLineMonitoreo.setStyle({
            color: color1,
            weight: 2,
        });

        // marker personalizado al inicio del viaje
        var redMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'B',
            iconColor: 'white',
            markerColor: 'red',
            shape: 'circle',
            prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerInit = L.marker([this.arrayLatLng[0][0], this.arrayLatLng[0][1]], {icon: redMarker}).addTo(this.rootMap);

        this.markerInit.name = 'B';

        // fin marker personalizado
        //  leaflet Extra Markers
        var redMarkerB = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'A',
            iconColor: 'white',
            markerColor: 'green',
            shape: 'circle',
            prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerEnd = L.marker([this.arrayLatLng[(this.arrayLatLng.length - 1)][0], this.arrayLatLng[(this.arrayLatLng.length - 1)][1]], {icon: redMarkerB}).addTo(this.rootMap);

        this.markerEnd.name = 'A';
        this.rootMap.fitBounds(this.polyLineMonitoreo.getBounds());

    }

    public dibujarPolyLineSinPopup() {

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        }

        this.polyLineMonitoreo = L.polyline(this.arrayLatLng).addTo(this.rootMap);

        // color de polyline
        this.polyLineMonitoreo.setStyle({
            color: '#9c2918',
            weight: 2,
        });
    }

    public addPointPolyLineMonitoreo(lat, lng) {
        if (this.polyLineMonitoreo !== undefined) {
            /** 
             * Agrega un punto dado a la polilínea. De forma predeterminada, 
             * se agrega al primer anillo de la polilínea en el caso de una polilínea múltiple, 
             * pero se puede anular pasando un anillo específico como una matriz LatLng 
             * (con la que puede acceder antes getLatLngs).
            */
            this.polyLineMonitoreo.addLatLng([lat, lng]);
        }
    }

    public moverMapa(lat1: number, lng1: number) {
        // mover mapa con animacion
        this.rootMap.flyTo([lat1, lng1]);
    }

    public sonidoRepetitivo() {
        this.sound = new Howl({
            src: ['./assets/sound/beep_3.mp3'],
            loop: true,
        });
    }

    public sonidoNuevaNotificacion() {
        const sound = new Howl({
            src: ['./assets/sound/viridian.mp3'],
        });

        return sound;
    }

    public centerPolyLine(polyline: any[]) {

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);

            this.addInitEndMarkers(polyline);
        }

        this.rootMap.eachLayer((layer) => {

            // buscar instancias solamente de polyline
            if(layer instanceof L.Polyline ){

                // evaluamos que sea el polyline seleccionado
                if (layer._latlngs.length == polyline.length) {
                    // console.log(layer);
                    this.rootMap.fitBounds(layer.getBounds());
                }
                
            }

            // buscamos instancias de Marker
            /*if (layer instanceof L.Marker) {
                // console.log(layer);
            }*/
        });
    }

    public addInitEndMarkers(polyline: any[]) {
        // marker personalizado al inicio del viaje
        var redMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'B',
            iconColor: 'white',
            markerColor: 'red',
            shape: 'circle',
            prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerInit = L.marker([polyline[0].lat, polyline[0].lng], {icon: redMarker}).addTo(this.rootMap);

        // fin marker personalizado
        //  leaflet Extra Markers
        var redMarkerB = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: 'A',
            iconColor: 'white',
            markerColor: 'green',
            shape: 'circle',
            prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerEnd = L.marker([polyline[(polyline.length - 1)].lat, polyline[(polyline.length - 1)].lng], {icon: redMarkerB}).addTo(this.rootMap);
    }

    updateSizeMap(milliseconds:number) {
        // EMC6
        setTimeout(() => { 
            this.rootMap.invalidateSize();
            console.log('se ejecuto invalidate size');
        }, milliseconds);
    }

    zoomCircleMarker(layer) {
        switch(this.rootMap.getZoom()) {
            case 8:
                layer.setRadius(0.3);
                break;
            case 9:
                layer.setRadius(0.6);
                break;
            case 10:
                layer.setRadius(1);
                break;
            case 11:
                layer.setRadius(1.5);
                break;
            case 12:
                layer.setRadius(2);
                break;
            case 13:
                layer.setRadius(3);
                break;
            case 14:
                layer.setRadius(4);
                break;
            case 15:
                layer.setRadius(5);
                break;
            case 16:
                layer.setRadius(6);
                break;
            case 17:
                layer.setRadius(7);
                break;
            case 18:
                layer.setRadius(8);
                break;
            case 19:
                layer.setRadius(9);
                break;
            case 20:
                layer.setRadius(10);
                break;
        }
    }

    getRadiusAccordingToMapZoom(): number {
        let radius = 0;

        switch( this.rootMap.getZoom()) {
            case 8:
                radius = 0.3;
                break;
            case 9:
                radius = 0.6;
                break;
            case 10:
                radius = 1;
                break;
            case 11:
                radius = 1.5;
                break;
            case 12:
                radius = 2;
                break;
            case 13:
                radius = 3;
                break;
            case 14:
                radius = 4;
                break;
            case 15:
                radius = 5;
                break;
            case 16:
                radius = 6;
                break;
            case 17:
                radius = 7;
                break;
            case 18:
                radius = 8;
                break;
            case 19:
                radius = 9;
                break;
            case 20:
                radius = 10;
                break;
        }

        return radius;
    }

    getSizeIconPhotoCamera(): string {

        let className = 'custom-div-icon-travel-photo-8';

        // console.log('Zoom mapa: ', this.rootMap.getZoom());

        switch(this.rootMap.getZoom()) {
            
            case 8:
                className = 'custom-div-icon-travel-photo-8';
                break;
            case 9:
                className = 'custom-div-icon-travel-photo-9';
                break;
            case 10:
                className = 'custom-div-icon-travel-photo-10';
                break;
            case 11:
                className = 'custom-div-icon-travel-photo-11';
                break;
            case 12:
                className = 'custom-div-icon-travel-photo-12';
                break;
            case 13:
                className = 'custom-div-icon-travel-photo-13';
                break;
            case 14:
                className = 'custom-div-icon-travel-photo-14';
                break;
            case 15:
                className = 'custom-div-icon-travel-photo-15';
                break;
            case 16:
                className = 'custom-div-icon-travel-photo-16';
                break;
            case 17:
                className = 'custom-div-icon-travel-photo-17';
                break;
            case 18:
                className = 'custom-div-icon-travel-photo-18';
                break;
            case 19:
                className = 'custom-div-icon-travel-photo-19';
                break;
            case 20:
                className = 'custom-div-icon-travel-photo-20';
                break;
        }

        return className; 
    }

    changeRadiusMarker(lat, lng, bool) {
        // buscamos todas las instancias de circle market para eliminarlas
        this.rootMap.eachLayer((layer) => {
            // evaluamos si existe instancias de ExtraMarkers
            if(layer instanceof L.CircleMarker ) {
                if (lat === layer._latlng.lat && lng === layer._latlng.lng) {
                    if (bool) {
                        // aumentar tamaño fillColor: '#1A31E2'
                        layer.setRadius(10);
                        layer.setStyle({fillColor: '#ff5722'});
                    } else {
                        // dejarlo en su tamaño default
                        this.zoomCircleMarker(layer);
                        layer.setStyle({fillColor: '#1A31E2'});
                    }
                    return false;
                }
            }
        });
    }

    // -------------------------------------------------------------------------------------
    // metodos de eliminacion de marcadores
    deleteCircleMarket() {
        // buscamos todas las instancias de circle market para eliminarlas
        this.rootMap.eachLayer((layer) => {

            // evaluamos si existe instancias de ExtraMarkers
            if(layer instanceof L.CircleMarker ) {

                // eliminamos del mapa sino es una geocerca
                if (layer.type != 'G') {
                    this.rootMap.removeLayer(layer);
                }
            }

            // evaluamos los marker instanciados
            if (layer instanceof L.Marker ) {
                this.rootMap.removeLayer(layer);
            }
        });
    }

    public deletePolylineAndCircleMarker(polyline: any[]) {

        this.rootMap.eachLayer((layer) => {

            // buscar instancias solamente de polyline
            if(layer instanceof L.Polyline ) {

                // evaluamos que sea el polyline seleccionado
                if (layer._latlngs.length == polyline.length) {
                    // eliminar un polyline
                    this.rootMap.removeLayer(layer);
                }
                
            }

            // evaluamos instancias de ExtraMarkers
            if(layer instanceof L.CircleMarker ) {
                const latLng = polyline.find((e) => e.lat === layer._latlng.lat && e.lng === layer._latlng.lng);

                if (latLng) {
                    this.rootMap.removeLayer(layer);
                }
                
            }

            // evaluamos instancias de ExtraMarkers
            if(layer instanceof L.Marker ) {
                // eliminar inconos personalizados
                if (layer.type == 'photo' || layer.type == 'icon') {
                    // buscamos la posicion exacta del marcador para eliminarlo
                    const latLng = polyline.find((e) => e.lat === layer._latlng.lat && e.lng === layer._latlng.lng);
                    if (latLng) {
                        this.rootMap.removeLayer(layer);
                    }
                }
                
                
            }

        });

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        }
    }

    public deletePolylineAndCircleMarker2(polyline: any[], idsLeaflet: number[]) {

        this.rootMap.eachLayer((layer) => {

            // buscar instancias solamente de polyline
            if(layer instanceof L.Polyline ) {
                // console.log('layer: ', layer._leaflet_id);
                const index = idsLeaflet.findIndex((id) => id == layer._leaflet_id);
                if (index >= -1) {
                    this.rootMap.removeLayer(layer);
                }
                
            }

            // evaluamos instancias de ExtraMarkers
            if(layer instanceof L.CircleMarker ) {

                // buscamos coincidencia en latitud y longitud 
                const latLng = polyline.find((e) => e.lat === layer._latlng.lat && e.lng === layer._latlng.lng);

                // verificamos que exista el valor
                if (latLng) {
                    // eliminamos del mapa
                    this.rootMap.removeLayer(layer);
                }
                
            }
        });

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        } else {
            // console.log('No está definido');
        }
    }

    async clearMap() {
        
        for (let i in this.rootMap._layers) {
            // console.log('layer: ',  this.rootMap._layers[i]);
            if (this.rootMap._layers[i]._path !== undefined || this.rootMap._layers[i]._markerCluster !== undefined) {
                try {

                    // buscar instancias solamente de polyline
                    if(this.rootMap._layers[i] instanceof L.Polygon ) {
                        if (this.rootMap._layers[i].type != 'G') {
                            await this.rootMap.removeLayer(this.rootMap._layers[i]);
                        }
                    }

                    // evaluamos instancias de ExtraMarkers
                    if(this.rootMap._layers[i] instanceof L.CircleMarker ) {
                        if (this.rootMap._layers[i].type != 'G') {
                            await this.rootMap.removeLayer(this.rootMap._layers[i]);
                        }
                    }

                    // evaluamos instancias de Circle
                    if(this.rootMap._layers[i] instanceof L.Circle ) {
                        if (this.rootMap._layers[i].type != 'G') {
                            await this.rootMap.removeLayer(this.rootMap._layers[i]);
                        }
                    }

                    if(this.rootMap._layers[i] instanceof L.Polyline ) {
                        await this.rootMap.removeLayer(this.rootMap._layers[i]);
                    }
                } catch (e) {
                    console.log('"problem with "' + e + this.rootMap._layers[i]);
                }
            }

            if(this.rootMap._layers[i] instanceof L.Marker ) {
                if (this.rootMap._layers[i].type === 'photo') {
                    // console.log('instancia foto');
                    await this.rootMap.removeLayer(this.rootMap._layers[i]);
                }
            } 
            
            if(this.rootMap._layers[i] instanceof L.Marker ) {
                if (this.rootMap._layers[i].type === 'label') {
                    // console.log('instancia foto');
                    await this.rootMap.removeLayer(this.rootMap._layers[i]);
                }
            } 
        }

        for (let i in this.arrayMarkers) {
            await this.rootMap.removeLayer(this.arrayMarkers[i].marker);
        }

        this.arrayMarkers = [];

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            await this.rootMap.removeLayer(this.markerInit);
            await this.rootMap.removeLayer(this.markerEnd);
        }
    }

    public clearMapPolyLine(points: number) {
        
        for (let i in this.rootMap._layers) {

            if (this.rootMap._layers[i].options.icon !== undefined) {
                try {
                    this.rootMap.removeLayer(this.rootMap._layers[i]);
                } catch(e) {
                    // console.log('"problem with "' + e + this.rootMap._layers[i]);
                }
            }

            try {
                if (this.rootMap._layers[i]._latlngs !== undefined) {
                    // console.log('ESTA DEFINIDO LATLNGS******');
                    if (points === this.rootMap._layers[i]._latlngs.length) {
                        this.rootMap.removeLayer(this.rootMap._layers[i]);
                    }
                }
            } catch(e) {
                // console.log(e);
            }
 
        }

        for (let i in this.arrayMarkers) {

            this.rootMap.removeLayer(this.arrayMarkers[i].marker);
        }

        this.arrayMarkers = [];

        if (this.markerInit !== undefined && this.markerEnd !== undefined) {
            // console.log('esta definido');
            this.rootMap.removeLayer(this.markerInit);
            this.rootMap.removeLayer(this.markerEnd);
        } 
    }

    public clearPointMarker() {

        for (let i in this.rootMap._layers) {
            try {

                if (this.rootMap._layers[i].options.fillColor !== undefined) {
                    if (this.rootMap._layers[i].options.fillColor === 'red') {
                        // console.log(`Layer # ${i}: `, this.rootMap._layers[i]);
                        this.rootMap.removeLayer(this.rootMap._layers[i]);
                    }
                }
    
            } catch( e ) {
    
            }
        }
        
    }

    public clearPolyLineMonitoreo() {

        if (this.polyLineMonitoreo !== undefined) {
            this.rootMap.removeLayer(this.polyLineMonitoreo);
        }
    }
}
