import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from 'src/app/services/map.service';
import * as shape from 'd3-shape';
import { RestService } from 'src/app/services/rest.service';
import * as moment from 'moment';
import { LocalStorageService } from 'src/app/services/local-storage.service';

declare let L;

@Component({
  selector: 'app-dialog-detalle-velocidad',
  templateUrl: './dialog-detalle-velocidad.component.html',
  styleUrls: ['./dialog-detalle-velocidad.component.css']
})
export class DialogDetalleVelocidadComponent implements OnInit {

    /**
     * Grafico gauge
     */
    singleGauge: any[] = [
        {
          "name": "Máxima velocidad en km/h",
          "value": 26.3
        }
    ];
    viewGauge: any[] = [300, 200];
    legendGauge: boolean = false;
    legendPositionGauge: string = 'below';
    colorSchemeGauge = {
      domain: ['red', '#222fbd']
    };
    legendTitleGauge = '';
    showAxisGauge = true;
    tooltipDisabledGauge = false;
    units = 'km/h'
    /**
     * FIN Grafico gauge
     */
    /**
     * 
     * Grafico lineal
     * 
     */
    multiLineal: any[] = [
        {
          "name": "Velocidad del día",
          "series": [{
            "name": "01:33",
            "value": 320
          },
          {
            "name": "03:55",
            "value": 430
          },
          {
            "name": "07:44",
            "value": 89
          },
          {
              "name": "10:00",
              "value": 53
          },
          {
              "name": "13:51",
              "value": 300
          },
          {
              "name": "15:30",
              "value": 55
          },
          {
              "name": "15:50",
              "value": 200
          }]
        }
    ];
    viewLineal: any[] = [500, 200];
    // options
    legendLineal: boolean = false;
    showLabelsLineal: boolean = true;
    animationsLineal: boolean = true;
    xAxisLineal: boolean = true;
    yAxisLineal: boolean = true;
    showYAxisLabelLineal: boolean = true;
    showXAxisLabelLineal: boolean = true;
    xAxisLabelLineal: string = 'Hora';
    yAxisLabelLineal: string = 'Velocidad';
    timelineLineal: boolean = false;
    curve = shape.curveCatmullRom.alpha(1);
    colorSchemeLineal = {
        domain: ['blue', 'red']
    };
    legendTitleLineal = '';
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
    legendPositionLineal = 'below';
    roundDomainsLineal = true;
    // fin grafico linea

    /**
     * configuracion de packgage de graficos
     * GRAFICO DE BARRAS
     */
    public singleBarra: any[] = [];
    // tamaño del grafico (ancho y alto respectivamente)
    viewBarra: any[] = [400, 200];
    // options
    showXAxisBarra = true;
    showYAxisBarra = true;
    gradientBarra = false;
    showXAxisLabelBarra = true;
    xAxisLabelBarra = 'Hora';
    showYAxisLabelBarra = true;
    yAxisLabelBarra = 'Velocidades';
    schemeTypeBarra = 'ordinal';
    showLegendBarra = false;
    legendTitleBarra = 'Vehículos'
    legendPositionBarra = 'right';
    showDataLabelBarra = true;
    colorSchemeBarra = {
        domain: ['#D7CB58', '#5A959B']
    };
    maxYAxisTickLengthBarra = 60;
    barPaddingBarra = 8;
    // fin de configuraciones de graficos
    
    public direccion = 'Resolviendo ...';

    private marker;

    public notaConduccion = 10;
    public SobrePasoExcesoPermitido = 1;

    constructor(public dialogRef: MatDialogRef<DialogDetalleVelocidadComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public mapService: MapService,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit(): void {
        // console.log(this.data);

        this.yAxisLabelLineal = this.localStorageService.lenguaje.lan328;
        this.yAxisLabelBarra = this.localStorageService.lenguaje.lan328;
        this.legendTitleBarra = this.localStorageService.lenguaje.lan322;
        this.legendTitleBarra = this.localStorageService.lenguaje.lan095;
        this.xAxisLabelBarra = this.localStorageService.lenguaje.lan307;

        // asginamos la velocidad maxima que ha reportado el EQ
        this.singleGauge[0].value = this.data.velocidad_maxima;

        this.cargarMapaLeaflet();
        this.data.fecha.substring(0,10)

        this.convertirDirecciones(this.data.latitud, this.data.longitud);
        
        // console.log('fecha en detalle velocidad: ', this.data.fecha.substring(0,10));
        // convertir fecha y hora local a hora UTC
        const utcStart = moment(this.data.fecha.substring(0,10) + 'T00:00:00', 'YYYY-MM-DDTHH:mm:ss').utc();
        const utcEnd = moment(this.data.fecha.substring(0,10) + 'T23:59:59', 'YYYY-MM-DDTHH:mm:ss').utc();
        
        // console.log(utcStart.format('YYYY-MM-DDTHH:mm:ss'));
        // console.log(utcEnd.format('YYYY-MM-DDTHH:mm:ss'));
        
        this.obtenerDetallesVelocidadesPorDia(this.data.imei, utcStart.format('YYYY-MM-DDTHH:mm:ss'), utcEnd.format('YYYY-MM-DDTHH:mm:ss'));
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
            center: new L.LatLng(this.data.latitud, this.data.longitud),
            zoom: 14,
            editable: true
        });

        // Cargamos el layer de google maps ***************************************************************************************
        this.mapService.googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            reuseTiles: true,
            updateWhenIdle: true,
            keepBuffer: 2
        }).addTo(this.mapService.rootMap);


        // Agregamos los controles de zoom al mapa *********************************************************************************
        this.mapService.controlZoom = L.control.zoom({
            position: 'bottomright'
        }).addTo(this.mapService.rootMap);

       // agremaos un marcador
       /*const circle = new L.circle([13.701170, -89.224402], 200).addTo(this.mapService.rootMap);


       const iconDiv = L.divIcon({
            className: 'custom-div-icon',
            html: `<i class='material-icons' style="transform: rotate(180deg) !important;">navigation</i>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            text: 'texto'
        });*/

        /*const marker = L.marker([13.701170, -89.224402], {
            icon: iconDiv,
            title: `nombre`,
            
        }).addTo(this.mapService.rootMap);*/

        var pulsingIcon = L.icon.pulse({iconSize:[20,20], color:'red'});
        this.marker = L.marker([this.data.latitud, this.data.longitud],{icon: pulsingIcon}).addTo(this.mapService.rootMap);

    }

    convertirDirecciones(lat, lng) {
        this.mapService.geocodeLatLngNominatimLocal(lat, lng).then(dir => {
            this.direccion = dir;
        }).catch((e) =>{
            this.direccion = e;
        });
    }

    obtenerDetallesVelocidadesPorDia(imei, fechaInicio, fechaFin) {
        // NOTA IMPORTANTE: LA FECHA ESTA EN HORA LOCAL DE EL SALVADOR ALMACENADA EN LA BASE DE DATOS
        // POR LO TANTO NO ES NESESARIO HACER CONVERSION DE HORARIO UTCS
        this.restService.obtenerVelocidades(imei, fechaInicio, fechaFin).subscribe((res) => {
            console.log(res);

            let valores: any[] = [];
            for (let i in res) {
                res[i].vel = this.convertirMiAKm(res[i].vel);
                // convertimos la hora utc a local (hora del sistema)
                res[i].event_time = moment.utc(res[i].event_time).local().format('HH:mm');;
                // console.log(res[i].vel);
                if (res[i].vel >= this.localStorageService.usuario.usuario.velocidad_maxima) {
                    const index = valores.findIndex(v => v.name === res[i].event_time);
                    // console.log('index encontrado: ', index);
                    if (index === -1) {
                        valores.push({  
                            name: res[i].event_time, 
                            value: Number(res[i].vel),
                            lat: res[i].lat,
                            lng: res[i].lng
                        });

                        // evaluar nota de conduccion
                        if (this.SobrePasoExcesoPermitido > this.localStorageService.usuario.usuario.exceso_permitido) {
                            this.calcularNotaconduccion();
                        } else {
                            this.SobrePasoExcesoPermitido ++;
                        }
                    } else {
                        if (res[i].vel > valores[index].value) {
                            valores[index].value = Number(res[i].vel);
                        } else {

                        }
                    }
                    
                }
            }
    
            this.singleBarra = valores.map(datum => ({ name: datum.name, value: datum.value, lat: datum.lat, lng: datum.lng }));

            // this.singleBarra = [...this.singleBarra];
            /*this.multiLineal[0].name = 'velocidad';
            this.multiLineal[0].series =  valores.map(datum => ({ name: datum.name, value: datum.value }));
    
            this.singleBarra = [...this.singleBarra];*/
        }, (err) => {
            console.log(err);
        })
    }

    convertirMiAKm(millas: number): number {
        return Number(Number(millas * 1.609).toFixed(2));
    }

    onSelect(event) {
        console.log(event);
        // console.log(this.singleBarra);

        const ob = this.singleBarra.find(vel => vel.name === event.name);

        if (ob) {
            console.log('objeto encontrado: ', ob);
            this.mapService.rootMap.setView([ob.lat, ob.lng]);
            this.marker.setLatLng([ob.lat, ob.lng]);
        }
    }


    calcularNotaconduccion() {
        this.notaConduccion -=1;
    }
}
