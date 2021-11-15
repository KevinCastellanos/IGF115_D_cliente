import { Injectable } from '@angular/core';
// import { L } from '../interfaces/globalReferencial';
import * as moment from 'moment';


declare let L;
@Injectable({
  providedIn: 'root'
})
export class DataService {
    dato = '';
    direccion = '';
    public contenedorVehiculos = true;
    public contenedorDetalleViajes = false;
    public arrayLatLng: any = [];
    public arrayLat: any = [];
    public arrayLng: any = [];
    // un objeto de mapa (root)
    mapRoot: any;
    // un objeto de marker
    markerEvent: any;
    // un objeto de popup
    popupEvent: any;
    // un objeto de polyline
    polyline: any;
    // rango de marker
    markerInit: any;
    markerEnd: any;

    googleLayer: any;

    viajeSeleccionado: any[] = [];
    constructor() {

    }

    setData(data: string) {
        this.dato = data;
    }

    getData() {
        return this.dato;
    }

    dibujarPolyLine() {

        if (this.markerInit !== undefined) {
        // console.log('esta definido');
        this.mapRoot.removeLayer(this.markerInit);
        this.mapRoot.removeLayer(this.markerEnd);
        } else {
        // console.log('No está definido');
        }

        this.polyline = L.polyline(this.arrayLatLng).addTo(this.mapRoot);
        // color de polyline
        this.polyline.setStyle({
        color: '#9c2918',
        weight: 5,
        });

        // marker personalizado al inicio del viaje
        var redMarker = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: 'B',
        iconColor: 'white',
        markerColor: 'orange-dark',
        shape: 'square',
        prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerInit = L.marker([this.arrayLatLng[0][0], this.arrayLatLng[0][1]], {icon: redMarker}).addTo(this.mapRoot);

        // fin marker personalizado
        //  leaflet Extra Markers
        var redMarkerB = L.ExtraMarkers.icon({
        icon: 'fa-number',
        number: 'A',
        iconColor: 'white',
        markerColor: 'orange-dark',
        shape: 'square',
        prefix: 'fa'
        });

        // tslint:disable-next-line: max-line-length
        this.markerEnd = L.marker([this.arrayLatLng[(this.arrayLatLng.length - 1)][0], this.arrayLatLng[(this.arrayLatLng.length - 1)][1]], {icon: redMarkerB}).addTo(this.mapRoot);

        // this.mapRoot.setView(new L.LatLng(this.arrayLatLng[0][0], this.arrayLatLng[0][1]));
        // zoom map polyline
        this.mapRoot.fitBounds(this.polyline.getBounds());
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
                radius: 6,
                stroke: true,
                color: '#00ff26',
                opacity: 1,
                weight: 4,
                fill: true,
                fillColor: 'red',
                fillOpacity: 1
            }).addTo(this.mapRoot);
            circleMarker.bindPopup(contenido);
        }
    }

    onClick(e) {
        
     }

    clearMap() {
        for (const i in this.mapRoot._layers) {
            if (this.mapRoot._layers[i]._path !== undefined) {
                try {
                this.mapRoot.removeLayer(this.mapRoot._layers[i]);
                } catch (e) {
                    console.log('"problem with "' + e + this.mapRoot._layers[i]);
                }
            }
        }
    }

    moverMapa(lat1: number, lng1: number) {
        // this.mapRoot.setView(new L.LatLng(lat1, lng1));
        // mover mapa con animacion
        this.mapRoot.flyTo([lat1, lng1], 15);
    }

    generadorId(): string {
        const length = 30;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    cargarGeocerca() {
        console.log('se cargo una geocerca');
        L.circle([13.675825, -89.302846], {radius: 200}).addTo(this.mapRoot);
    }

    generadorIdNumber() {
        var length = 15;
        var result           = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    converterUTCToLocalTime(event) {
        // const utcTime = '2019-10-23 16:53:52';
        return moment.utc(event.event_time).local().format('HH:mm:ss');
    }

    converterUTCToLocalDate(event) {
        // const utcTime = '2019-10-23 16:53:52';
        return moment.utc(event.event_time).local().format('YYYY-MM-DD');
    }
    convertAmPm(event) {
        return moment(event, 'hh:mm:ss').format('LTS');
    }

    geocodeLatLng(lat1: number, lng1: number): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            L.esri.Geocoding.reverseGeocode().latlng([lat1, lng1]).run((error, result, response) => {
                resolve(result['address']['Match_addr']);
            });
        });
    }
}
