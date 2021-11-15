// tslint:disable-next-line: max-line-length
import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ElementRef, ViewChild, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogImageComponent } from '../dialog-image/dialog-image.component';
import { DialogResumenComponent } from '../dialog-resumen/dialog-resumen.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { EventLiveComponent } from '../event-live/event-live.component';
import { DialogCalendarComponent } from '../dialog-calendar/dialog-calendar.component';
import { Device } from '../../interfaces/device';
import { RawData } from '../../interfaces/rawdata';
import { DialogResumenViajeComponent } from '../dialog-resumen-viaje/dialog-resumen-viaje.component';
import { CompService } from 'src/app/services/comp.service';
import { MapService } from '../../services/map.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { DialogImageDobleCamaraComponent } from '../dialog-image-doble-camara/dialog-image-doble-camara.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DialogGalleryComponent } from 'src/app/components/dialog-gallery/dialog-gallery.component';

declare let L;

@Component({
  selector: 'app-detalles-viajes',
  templateUrl: './detalles-viajes.component.html',
  styleUrls: ['./detalles-viajes.component.css']
})
export class DetallesViajesComponent implements OnInit, OnDestroy, AfterViewInit  {

    // con esta propiedad el componente padre tiene acceso a sus atributos
    // tslint:disable-next-line: no-input-rename
    @Input('someProp') someProp;
    // tslint:disable-next-line: no-input-rename
    @Input('nombreVehiculo') nombreVehiculo;
    // tslint:disable-next-line: no-input-rename
    @Input('fechaInit') fechaInit: string;
    // tslint:disable-next-line: no-input-rename
    @Input('fechaFin') fechaFin: string;
    // tslint:disable-next-line: no-input-rename
    @Input('imei') imei;
    @ViewChild('insertar') insert: ElementRef;
    @ViewChild('liveEventContainer', { read: ViewContainerRef }) liveEventContainer;
    // tslint:disable-next-line: no-input-rename
    @Input('viajeNumero') viajeNumero;

    message = 'hola mundo';
    public contador = 0;
    // totales de viajes armados
    public viajes: any[] = [];
    // indicacion de dibujar o no los detalles de la linea del recorrido
    public viajesDibujado: {index: number, dibujado: boolean}[] = []
    public banderaDibujado: {index: number, dibujado: boolean}[] = []
    public detalleViaje: any[] = [];
    public lugares: any = [];
    public latT: any = [];
    public lngT: any = [];
    public totalDistancia = 0;
    public loadText = true;
    public ign = false;
    public viewViajes = true;
    public viewDetalleViajes = false;
    public streetView = false;
    public numViaje = 0;
    public noEsViaje = 0;
    public boolEventoNoGenerado = false;
    public numeroViaje = 0;
    public velocidadPromedio = 0;
    public velocidadMaximo = 0;

    public odometroVirtual = 0;
    public colores = ['#4a148c', '#ff1744', '#00acc1', '#00c853', '#b8cc00', '#ff5722', '#484848',
                    '#484848', '#6d4c41', '#6d4c41', '#707070', '#b71c1c', '#7b1fa2', '#ee98fb',
                    '#3d5afe', '#98ee99', '#ffeb3b', '#0100ca', '#26c6da', '#26c6da', '#0095a8',
                    '#ffff1a', '#e6188c', '#552cd7', '#33f41e', '#ff8120', '#f21e9f', '#1de7e7',
                    '#ff2020', '#1de7e7', '#ffb520' , '#1de9c1', '#ffac20', '#267500', '#691000'];
    public vistaTotalesViaje  = '';
    public altoFormatoViaje = 0;

    public indexViaje = 0;

    public itemSelect = -1;
    public itemSelectDetails = -1;

    public datosSinProcesar: any[] = [];

    public loaderVehiculos = true;

    @ViewChild(CdkVirtualScrollViewport) viewPortDetalle: CdkVirtualScrollViewport;

    // este sirve para crear los marcadores
    public arrayLatLng = [];

    constructor(public mapService: MapService,
                private restService: RestService,
                private dialog: MatDialog,
                public wsService: WebsocketService,
                public compService: CompService,
                public localStorageService: LocalStorageService,
                private _snackBar: MatSnackBar) { 
    }

    ngOnInit() {

        this.mapService.arrayLatLng = [];
        this.mapService.viajeSeleccionado = [];
        
        this.mapService.clearMap();

        this.obtenerDetalleViajes();

        if (window.innerWidth > 575) {
            this.streetView = false;
        } else {
            this.streetView = true;
        }

        this.preferenciaVistaViaje();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {

    }

    sendMessage() {
        // this.dataService.setData('parametro enviado desde el hijo');
        // console.log(this.dataService.getData());
        // this.dataService.contenedorVehiculos = true;
    }

    atras() {
        this.mapService.contenedorVehiculos = true;
        this.mapService.contenedorDetalleViajes = false;
    }

    async obtenerDetalleViajes() {
        this.loaderVehiculos = true;
        // console.log('fecha inicial: ', String(this.fechaInit));
        // console.log('fecha final: ', String(this.fechaFin));

        this.datosSinProcesar = [];
        this.banderaDibujado = [];
        this.viajesDibujado = [];
        this.viajes = [];
        this.lugares = [];
        this.latT = [];
        this.lngT = [];
        this.datosSinProcesar = [];
        this.indexViaje = 0;
        this.itemSelect = -1;
        this.itemSelectDetails = -1;
        this.contador = 0;
        this.odometroVirtual = 0;
        this.numViaje = 0;
        this.noEsViaje = 0;
        this.boolEventoNoGenerado = false;
        this.numeroViaje = 0;
        this.velocidadPromedio = 0;
        this.velocidadMaximo = 0;


        // console.log('fecha inicial: ', this.fechaInit);
        // console.log('fecha fin: ', this.fechaFin);

        this.restService.obtenerDataRaw(this.imei, this.fechaInit, this.fechaFin).subscribe((response) => {
            // console.log('todos los eventos', response);

            if (response.length > 0) {

                // Evaluamos si tiene valores repetidos, si lo tiene, se elimina los que aparecen repetidos
                var hash = {};
                response = response.filter(function(current) {
                    let go = current.SA !== undefined ? String(current.event_time) + String(current.SA) : String(current.event_time);
                    let exists = !hash[go] || false;
                    hash[go] = true;
                    return exists;
                });
                // fin de evaluacion de datos repetidos

                this.datosSinProcesar = response;

                const resulApagado = response.find( eventos => eventos.evento === '02' );
                const resulEncendido = response.find( eventos => eventos.evento === '03' );

                if (resulApagado !== undefined && resulEncendido !== undefined) {
                    if (resulEncendido !== undefined) {
                        this.ign = true;
                        
                        if (response[0].VO === '') {
                            // significa que no trae VO 
                            // armamos un solo viaje
                            this.armarViajeUnico(response);
                        } else {
                            // armar viaje por ign encendido/apagado
                            // console.log('viaje armado por ign');
                            this.armarViajesPorIgn(response);
                        }

                    } else {
                        this.ign = false;

                        if (response[0].VO === '') {
                            // armamos un solo viaje
                        } else {
                            // amramos multiples viaje por distancia
                            // armar viaje por distancia recorrido
                            this.armarViajePorDistancia(response);
                        }
                    }
                } else {
                    this.boolEventoNoGenerado = false;
                    // armar viaje por distancia recorrido
                    if (response[0].VO === '') {
                            // armamos un solo viaje
                        } else {
                            // amramos multiples viaje por distancia
                            // armar viaje por distancia recorrido
                            this.armarViajePorDistancia(response);
                        }
                }
            } else {
                this.boolEventoNoGenerado = true;
                this.loaderVehiculos = false;
                console.log('no tiene viajes armados');
            }

        }, (error) => {
            console.log(error);
        });
    }

    // ARMADO DE VIAJE POR ENCENDIDO Y APAGADO
    armarViajesPorIgn(response: RawData[]) {
        this.numeroViaje = 0;
        let viaje: any = [];
        this.viajes = [];
        let viajeApagado: any = [];
        let viajeFecha: any = [];
        let apagado = false;
        let inicioViaje = false;
        let distInitTemp = 0;
        let distFinTemp = 0;
        let ultimoApagado: any;
        let distanciaPorViajeInit = 0;
        let distanciaPorviajeFin = 0;
        let diaFecha = 0;
        this.latT = [];
        this.lngT = [];
        let sa = -1;

        let eventosAntesViajes = true;
        let arrayAntesViaje: any[] = [];

        let eventosDespuesViajes = false;
        let arrayDespuesViaje: any[] = [];

        // inicio de for
        // tslint:disable-next-line: forin
        for (const i in response) {

            // evaluamos que no se registre un SA duplicado si es el caso omitimos el evento
            if (Number(response[i].SA) !== Number(sa)) {
                
                // actualizamos el SA temporal
                sa = Number(response[i].SA);

                // actualizamos el odometro
                this.odometroVirtual = Number(response[i].VO);

                // sumamos todas las velocidades
                this.velocidadPromedio += response[i].vel;

                // evaluamos la velocidad maxima
                if (this.velocidadMaximo < response[i].vel) {
                    this.velocidadMaximo = response[i].vel;

                }

                // damos valores por defecto
                response[i].desde = 'Espere ...';
                response[i].hasta = 'Espere ...';
                response[i].viaje = false;
                response[i].ign_off = false;
                response[i].ign_on = false;
                response[i].num_viaje = 0;
                response[i].viaje_unico = false;
                response[i].color = this.colores[Math.floor(Math.random() * 35)];

                // separamos los viajes por fechas
                const dia = moment.utc(response[i].event_time).local().format('DD');

                


                if (diaFecha !== Number(dia)) {
                    diaFecha = Number(dia);

                    let eventoDia = {
                        id: response[i].id,
                        imei: response[i].imei,
                        nombre: response[i].nombre,
                        evento: "-1",
                        etiqueta: "nulo",
                        address: "Espere ...",
                        event_time: response[i].event_time,
                        system_time: response[i].system_time,
                        lat: response[i].lat,
                        lng: response[i].lng,
                        vel: response[i].vel,
                        direccion: response[i].direccion,
                        modo_adqui: response[i].modo_adqui,
                        calidad_datos: response[i].calidad_datos,
                        SV: response[i].SV,
                        BL: response[i].BL,
                        DOP: response[i].DOP,
                        CF: response[i].CF,
                        AL: response[i].AL,
                        AC: response[i].AC,
                        IX: response[i].IX,
                        SA: response[i].SA,
                        TI: response[i].TI,
                        CE: response[i].CE,
                        CL: response[i].CL,
                        CS: response[i].CS,
                        VO: response[i].VO,
                        SC: response[i].SC,
                        PS00: response[i].PS00,
                        RE: response[i].RE,
                        ibutton: response[i].ibutton,
                        PS01: "0",
                        PS02: "0",
                        status_foto: "-1",
                        PS03: "0",
                        AD: 0,
                        icono: 0,
                        nombre_icono: "",
                        descripcion_icono: "black",
                        color_icono: "undefined",
                        posicion_valida: 1,
                        desde: "",
                        hasta: "",
                        viaje: false,
                        ign_off: false,
                        ign_on: false,
                        num_viaje: 0,
                        viaje_unico: false,
                        color: "#1de9c1",
                        hora_inicio: "",
                        hora_final: ""
                    };
                    
                    // console.log('es otra fecha');
                    eventoDia.evento = '-1';
                    eventoDia.event_time = moment.utc(eventoDia.event_time).local().format('YYYY-MM-DD');
                    viajeFecha.unshift(eventoDia);
                    // insertamos un viaje
                    this.viajes.push(viajeFecha);
                    // this.viajesDibujado.push({index: Number(i), dibujado: false});
                    viajeFecha = [];
                }

                // inicio de viaje
                if (response[i].evento === '03') {

                    // actualizamos a false eventoAntesViajes para no añadir items al array
                    eventosAntesViajes = false;

                    // actualizamos a false eventos despues de viaje lo que significa que se va armar un
                    // nuevo viaje y no es nesesario tener los residuales acumulados
                    eventosDespuesViajes = false;
                    // limpiamos los items despues de viaje porque se armara uno nuevo
                    arrayDespuesViaje = [];

                    // color cerde por encendido
                    response[i].background = '#a5fba5';
                    response[i].colorText = 'black';

                    // obtenemos el incio del odometro
                    distanciaPorViajeInit = Number(response[i].VO);

                    // indicamos el inicio del viaje
                    inicioViaje = true;

                    // insertamos un evento en viaje (un viaje x)
                    viaje.unshift(response[i]);

                    // almacenamos las latitudes y longitudes en un array diferente
                    this.latT.unshift(response[i].lat);
                    this.lngT.unshift(response[i].lng);

                    // capturamos una distancia temporal
                    if (distInitTemp === 0 ) {
                        distInitTemp = Number(response[i].VO);
                    }

                    // console.log('odometro init: ', distInitTemp);
                    if (apagado === true) {
                        apagado = false;
                        response[i].ign_off = true;

                        //
                        // evaluamos que tenga habilitado los detalle para ver este viaje apagado
                        //
                        if (this.localStorageService.detalleIgn.ign) {
                            viajeApagado.unshift(response[i]);
                            this.viajes.push(viajeApagado);
                        }

                        viajeApagado = [];
                    }

                }

                // insertamos todos los items antes del primer armado de viaje
                if (eventosAntesViajes) {
                    arrayAntesViaje.unshift(response[i]);
                }

                // insertamos todos los items despues del ultimo viaje armado
                if (eventosDespuesViajes) {
                    arrayDespuesViaje.unshift(response[i]);
                }

                // evento de parada
                if (response[i].etiqueta === 'Stopped (Idle)') {
                    // color rojo por apagado
                    response[i].background = '#b1eeff';
                    response[i].colorText = 'black';
                }

                // evento velocidad excesiva
                if (response[i].etiqueta === 'Velocidad excesiva') {
                    response[i].background = '#ffa50066';
                    response[i].colorText = 'black';
                }

                // eventos despues de encendido
                if (inicioViaje) {
                    // eventos emitidos
                    if (response[i].evento !== '03' && response[i].evento !== '02') {

                        viaje.unshift(response[i]);
 
                        this.latT.unshift(response[i].lat);
                        this.lngT.unshift(response[i].lng);

                    }
                }

                if (apagado === true) {

                    viajeApagado.unshift(response[i]);
                    // lugar.unshift('Onteniendo dirección ... ');
                    this.latT.unshift(response[i].lat);
                    this.lngT.unshift(response[i].lng);
                }
                // eventos cuando se apaga el vehiculo
                // se guarda el arreglo de objetos
                // tslint:disable-next-line: no-string-literal
                if (response[i].evento === '02' && inicioViaje === true) {

                    // cambiamos a verdadero que los siguientes eventos se acumulen como residuales en el ultimo viaje
                    eventosDespuesViajes = true;

                    // color rojo por apagado
                    response[i].background = '#5a5a5ac2';
                    response[i].colorText = 'white';

                    let bandera = false;
                    // obtenemos el odometro cuando se apaga el vehiculo
                    distanciaPorviajeFin = Number(response[i].VO);
                    // finaliza
                    distFinTemp = Number(response[i].VO);

                    // evaluamos si es viaje o no en el momento que se apaga el vehiculo
                    // evaluamos si la distancia es mayor a 10 metros
                    if ((distanciaPorviajeFin - distanciaPorViajeInit) > 10) {
                        response[i].viaje = true;
                        this.numeroViaje += 1;
                        response[i].num_viaje = this.numeroViaje;
                        // console.log('mayor a 10m');
                    } else {
                        // console.log('menor a 10 m');
                        bandera = true;
                    }

                    // evaluamos que sea una ign on pero que no se mueve mas de 10 metro de lugar
                    if (((distanciaPorviajeFin - distanciaPorViajeInit) < 10) &&  response[i].evento === '02' && this.ign === true) {
                        response[i].ign_on = true;
                    }

                    // evaluamos que sea una ign off y que no se ha movido del lugar
                    // tslint:disable-next-line: max-line-length
                    if (this.ign === true && (response[i].evento === '03' && ((distanciaPorviajeFin - distanciaPorViajeInit) <= 10)) || response[i].evento === '01' ) {
                        response[i].ign_off = true;
                    }

                    viaje.unshift(response[i]);
                    ultimoApagado = response[i];

                    // lugar.unshift('Onteniendo dirección ... ');
                    this.latT.unshift(response[i].lat);
                    this.lngT.unshift(response[i].lng);

                    // evaluamos que se muestra el viaje con ign on
                    if (bandera && this.localStorageService.detalleIgn.ign === true) {
                        // insertamos el viaje en viajes
                        this.viajes.push(viaje);
                    }

                    // evalamos un viaje normal
                    if (bandera === false) {
                        // insertamos el viaje en viajes
                        this.viajes.push(viaje);
                    }

                    // limpiamos el array de viaje
                    viaje = [];
                    inicioViaje = false;

                    // se apaga el motor
                    apagado = true;
                    viajeApagado.unshift(response[i]);

                    // limpiamos datos de distancia por viaje
                    distanciaPorviajeFin = 0;
                    distanciaPorViajeInit = 0;
                }

            } else {
                // console.log('Hay SA duplicado: ', Number(info.SA));
            }
        } // termina for


        // evaluamos si hay eventos para agregar antes de un armado de viajes
        if (arrayAntesViaje.length > 0) {
            // añadimos los eventos antes del primer viaje armado a viajes (lo añadimos en la segunda posicion del array padre)
            this.viajes.splice(1, 0, arrayAntesViaje);
            // limpiamos eventosAntesViajes
            arrayAntesViaje = [];
        }

        // evaluamos si hay eventos despues del ultimo viaje armado
        if (arrayDespuesViaje.length > 0) {
            // añadimos los eventos antes del primer viaje armado a viajes (lo añadimos en la segunda posicion del array padre)
            this.viajes.push(arrayDespuesViaje);
            // limpiamos eventosAntesViajes
            arrayDespuesViaje = [];
        }
        

        
        // console.log('viajes: ', this.viajes);
        // console.log('cantiad de viajes armados: ', this.viajes.length);

        const tam = this.viajes.length;
        for (let i = 0; i < tam; i++) {
            this.banderaDibujado.push({index: i, dibujado: false})
        }
        

        this.velocidadPromedio = (this.velocidadPromedio / response.length);

        // --------------------------------------------------------------
        this.totalDistancia = (distFinTemp - distInitTemp);

        // insertamos el ultimo evento que ha reportado el equipo
        if (response[response.length - 1].evento !== '03') {
            // console.log('ultimo apagado', ultimoApagado);
            // console.log('es hoy', this.esHoy(ultimoApagado));
            //if (this.esHoy(ultimoApagado)) {
                // ultimo evento del sistema
                // const obj = JSON.parse(response[response.length - 1]['arreglo']);
                // obj.direcion = 'Obteniendo dirección, espere ...';
                // viaje.unshift(ultimoApagado);

                // ultimo evento generado manualmente para hacer diferencia de hora
                // por evaluar
                /*const objTemp = JSON.parse(response[response.length - 1]['arreglo']);
                objTemp.code = '01';
                objTemp.direcion = 'Obteniendo dirección, espere ...';
                objTemp.event_time = moment().utc().format('YYYY-MM-DD HH:mm:ss');
                viajeApagado.unshift(objTemp);
                this.viajes.push(viajeApagado);
                viajeApagado = [];*/
            // }*/
        }

        
        // ivertimos los datos procesados
        this.viajes.reverse();

        
        // actualizamos los detalles
        this.viajes = [...this.viajes];

        this.loaderVehiculos = false;

        // ejecutado un metodo 1 segundo despues que hayamos procesados los datos
        const inter = setInterval(() => {
            this.convertirDireciones();
            clearInterval(inter);
        }, 1000);
    }

    // ARMADO DE VIAJE POR DISTANCIA Y MOVIMIENTO
    armarViajePorDistancia(response: RawData[]) {

        // logica para armado de viajes
        let viaje: any = [];
        this.viajes = [];
        let viajeFecha: any = [];

        // cantidades de dias 
        let diaFecha = 0;

        // indicador de inicio y fin de viaje
        let primeraVelocidades = true;

        // indicador de viaje
        let inicioViaje = false;

        // distancia inicial y final
        let distanciaPorViajeInit = 0;
        let distanciaPorviajeFin = 0;

        // distancia temporal de inicio y fin
        let distInitTemp = 0;
        let distFinTemp = 0;

        this.latT = [];
        this.lngT = [];


        // mantenemos el ultimo evento con velocidad cero para insertar ese unicamente en el inicio 
        // de viaje no aumentar la hora de viaje del vehiculo
        let ultimoEventoCero: RawData = {};

        // console.log('arrDist', arrDistancias[1]);
        // tslint:disable-next-line: forin
        for (const i in response) {

            // actualizamos el odometro
            this.odometroVirtual = Number(response[i].VO);

            /**
             * damos unos valores por defecto antes de evaluar el viajes para considerarlo uno como tal
             */
            response[i].desde = 'Espere ...';
            response[i].hasta = 'Espere ...';
            response[i].viaje = false;
            response[i].ign_off = false;
            response[i].ign_on = false;
            response[i].num_viaje = 0;
            response[i].viaje_unico = false;
            response[i].color = this.colores[Math.floor(Math.random() * 35)];


            // separamos los viajes por fechas
            const dia = moment.utc(response[i].event_time).local().format('DD');

            // evaluamos si son datos del mismo día
            if (diaFecha !== Number(dia)) {
                diaFecha = Number(dia);
                // console.log('es otra fecha');
                response[i].evento = '-1';
                response[i].event_time = moment.utc(response[i].event_time).local().format('YYYY-MM-DD');
                viajeFecha.unshift(response[i]);
                this.viajes.push(viajeFecha);
                viajeFecha = [];
            } else {
                // console.log('es el mismo dia');
            }

            /**
             * 
             * Evaluamos el inicio del viajes, indicando que no se haya evaluado eventos con velocidades
             * ceros, si para el dia consulta no ha resportado evento con velocidades > 0 seran los evento
             * de inicio de viaje
             * 
             */
            if (primeraVelocidades) {
                if (response[i].vel === 0) {
                    // actualizamos el evento con velocidad cero kilometro sobre hora
                    ultimoEventoCero = response[i];
                } else {

                    // obtenemos el incio del odometro
                    distanciaPorViajeInit = Number(response[i].VO);

                    // insertamos el evento en un viaje (el primero evento del viaje con velocidad 0 km/h)
                    viaje.unshift(ultimoEventoCero);

                    // insertamos el evento en un viaje
                    viaje.unshift(response[i]);

                    // insertamos la posición en un arreglo global
                    this.latT.unshift(response[i].lat);
                    this.lngT.unshift(response[i].lng);

                    if (distInitTemp === 0 ) {
                        // tslint:disable-next-line: no-string-literal
                        distInitTemp = Number(response[i].VO);
                    }

                    // indicamos que ha iniciado el viaje
                    inicioViaje = true;
                    // ponemos en false la primera velocidad indicando que se ha movido el vehiculo
                    primeraVelocidades = false;
                }
            }

            /**
             * 
             * Paso 2: insertamos evento en movimiento
             * 
             */
            // eventos despues de encendido
            if (inicioViaje) {
                // eventos emitidos
                viaje.unshift(response[i]);

                // insertamos la posicion en un arreglo global
                this.latT.unshift(response[i].lat);
                this.lngT.unshift(response[i].lng);
            }

            /**
             * 
             * Paso 3: a Finalizado un viaje porque vuelve a cero y 
             * el atributo primeraVelocidad es falso indica que ha vuelto
             * a detenerse el vehiculo y marca el fin de un viaje
             * 
             */
            if (primeraVelocidades === false && response[i].vel === 0) {

                // reportamos que ha armado un viaje
                response[i].viaje = true;

                // cantidad de viajes
                this.numeroViaje += 1;
                response[i].num_viaje = this.numeroViaje;
                
                // console.log('numero de viaje: ', response[i].num_viaje);
                // obtenemos el odometro cuando se apaga el vehiculo
                distanciaPorviajeFin = Number(response[i].VO);
                // finaliza
                distFinTemp = Number(response[i].VO);

                viaje.unshift(response[i]);

                // lugar.unshift('Onteniendo dirección ... ');
                this.latT.unshift(response[i].lat);
                this.lngT.unshift(response[i].lng);

                // insertamos el viaje en viajes
                this.viajes.push(viaje);

                // limpiamos el array de viaje
                viaje = [];
                primeraVelocidades = true;

                // limpiamos datos de distancia por viaje
                distanciaPorviajeFin = 0;
                distanciaPorViajeInit = 0;

                // ponemos como falso el atributo inicio viaje porque ha finalizado uno
                inicioViaje = false;

                // volvemos actualizar el ultimo evento con velocidad cero para amarrarlo en el viaje siguiente
                ultimoEventoCero = response[i];
            }


        } // fin de for

        const tam = this.viajes.length;
        for (let i = 0; i < tam; i++) {
            this.banderaDibujado.push({index: i, dibujado: false})
        }

        this.velocidadPromedio = (this.velocidadPromedio / response.length);

        // --------------------------------------------------------------
        this.totalDistancia = (distFinTemp - distInitTemp);

        this.viajes.reverse();
        this.viajes = [...this.viajes];

        this.loaderVehiculos = false;
        // console.log('todo los viajes...: ', this.viajes);

        const inter = setInterval(() => {
            this.convertirDireciones();
            clearInterval(inter);
        }, 2000);
    }

    // ARMADO DE VIAJE UNICO CUANDO NO ENCUENTRA IGN O VO
    armarViajeUnico(response: RawData[]) {
        // console.log('unicio viaje armado por no tener VO  ni ign');
        // console.log(response);

        let viaje: any = [];
        this.viajes = [];
        this.numeroViaje = 0;
        let distInitTemp = 0;
        let distFinTemp = 0;
        this.latT = [];
        this.lngT = [];

        for (const i in response) {
            /**
             * damos unos valores por defecto antes de evaluar el viajes para considerarlo uno como tal
             */
            // response[i].event_time = moment.utc(response[i].event_time).local().format('YYYY-MM-DD');
            response[i].desde = 'Espere ...';
            response[i].hasta = 'Espere ...';
            response[i].viaje = false;
            response[i].ign_off = false;
            response[i].ign_on = false;
            response[i].num_viaje = 1;
            response[i].viaje_unico = true;
            response[i].color = this.colores[Math.floor(Math.random() * 35)];
           

             // eventos emitidos
            viaje.unshift(response[i]);

            // insertamos la posicion en un arreglo global
            this.latT.unshift(response[i].lat);
            this.lngT.unshift(response[i].lng);
        }

        this.viajes.push(viaje);
        console.log('viajes armados unicos: ', this.viajes);
        this.viajes.reverse();
        this.viajes = [...this.viajes];

        const tam = this.viajes.length;
        for (let i = 0; i < tam; i++) {
            this.banderaDibujado.push({index: i, dibujado: false})
        }

        this.loaderVehiculos = false;

        const inter = setInterval(() => {
            this.convertirDireciones();
            clearInterval(inter);
        }, 2000);
    }

    // ARMADO DE VIAJE POR GEOCERCAS
    armarViajePorGeoreferencia(response: RawData[]) {

        this.numeroViaje = 0;
        let viaje: any = [];
        this.viajes = [];
        let viajeApagado: any = [];
        let viajeFecha: any = [];
        let apagado = false;
        let inicioViaje = false;
        let distInitTemp = 0;
        let distFinTemp = 0;
        let ultimoApagado: any;
        let distanciaPorViajeInit = 0;
        let distanciaPorviajeFin = 0;
        let diaFecha = 0;
        this.latT = [];
        this.lngT = [];
        let sa = -1;
        // objetos de geocercas
        // este arreglo tendra 2 geocerca (referencia como punto de partida para armar viaje)
        const geopuntos = [{
            nombre: 'Ter.pto_II',
            lat: 13.4853201,
            lng: -89.3332138,
            radio: 84.2
        },
        {
            nombre: 'Terminal SS',
            lat: 13.6952066,
            lng: -89.2005157,
            radio: 81.4
        }];

        for (const i in response) {

            // evaluamos que no tenga SA repetido
            if (Number(response[i].SA) !== Number(sa)) {

            }

        }

    }

    async convertirDireciones() {

        // tslint:disable-next-line: forin
        for (const i in this.viajes) {
            // como esta invertido la pila de datos asi se resolvera la direeccion
            // tslint:disable-next-line: max-line-length
            this.viajes[i][0].desde =  await this.mapService.geocodeLatLng(this.viajes[i][this.viajes[i].length - 1].lat, this.viajes[i][this.viajes[i].length - 1].lng);
            this.viajes[i][this.viajes[i].length - 1].hasta =  await this.mapService.geocodeLatLng(this.viajes[i][0].lat, this.viajes[i][0].lng);
            // calculamos la hora de incio fin de cada viaje
            this.viajes[i][0].hora_inicio =  this.viajes[i][0].event_time;
            this.viajes[i][this.viajes[i].length - 1].hora_final =  this.viajes[i][this.viajes[i].length - 1].event_time;
            // console.log('index: ', i, ' ... event time', this.viajes[i][0].event_time);
        }

    }

    async resolverDirecciones(ev: RawData[], position, color: string, conMarker) {
        if (this.localStorageService.usuario.usuario.api_google === 1) {
            // Convertimos las coordenadas en direcciones
            // tslint:disable-next-line: forin
            for (const index in this.viajes[position]) {
                // tslint:disable-next-line: max-line-length
                this.viajes[position][index].address = await this.mapService.geocodeLatLng(this.viajes[position][index].lat, this.viajes[position][index].lng);

                // evaluamos si la coordenada ha entrado a una geocerca
                // tslint:disable-next-line: forin
                for (const i in this.localStorageService.geocercas) {
                    // tslint:disable-next-line: max-line-length
                    if (Boolean(JSON.parse(this.localStorageService.geocercas[i]['circular'])) === true) {
                        const lat = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lat;
                        // tslint:disable-next-line: no-string-literal
                        const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lng;
                        // tslint:disable-next-line: no-string-literal
                        const radio = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].radio;
                        const dentroGeocerca = this.mapService.isMarkerInsideCirclePiont(this.mapService.rootMap,
                                                                    this.viajes[position][index].lat,
                                                                    this.viajes[position][index].lng,
                                                                    lat, lng, radio);
                        if (dentroGeocerca) {
                            this.viajes[position][index].address = this.localStorageService.geocercas[i]['nombre_geocerca'];
                            // return;
                        }
                    } else {
                        // console.log(this.mapService.geocercas[i]['coordenada_geocerca']);
                        // tslint:disable-next-line: max-line-length
                        // console.log(this.mapService.isMarkerInsidePolygonPoint(this.viajes[position][index].lat, this.viajes[position][index].lng, this.mapService.geocercas[i]['coordenada_geocerca']));
                        // tslint:disable-next-line: max-line-length
                        const dentroGeocerca = this.mapService.isMarkerInsidePolygonPoint(this.viajes[position][index].lat, this.viajes[position][index].lng, this.localStorageService.geocercas[i]['coordenada_geocerca']);
                        if (dentroGeocerca) {
                            this.viajes[position][index].address = this.localStorageService.geocercas[i]['nombre_geocerca'];
                            // return;
                        }
                    }
                }
            }
        } else {
            // Convertimos las coordenadas en direcciones
            // tslint:disable-next-line: forin
            for (const index in this.viajes[position]) {
                // tslint:disable-next-line: max-line-length
                this.viajes[position][index].address = await this.mapService.geocodeLatLngNominatimLocal(this.viajes[position][index].lat, this.viajes[position][index].lng);

                // evaluamos si la coordenada ha entrado a una geocerca
                // tslint:disable-next-line: forin
                for (const i in this.localStorageService.geocercas) {
                    // tslint:disable-next-line: max-line-length
                    if (Boolean(JSON.parse(this.localStorageService.geocercas[i]['circular'])) === true) {
                        const lat = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lat;
                        // tslint:disable-next-line: no-string-literal
                        const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lng;
                        // tslint:disable-next-line: no-string-literal
                        const radio = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].radio;
                        const dentroGeocerca = this.mapService.isMarkerInsideCirclePiont(this.mapService.rootMap,
                                                                    this.viajes[position][index].lat,
                                                                    this.viajes[position][index].lng,
                                                                    lat, lng, radio);
                        if (dentroGeocerca) {
                            this.viajes[position][index].address = this.localStorageService.geocercas[i]['nombre_geocerca'];
                            // return;
                        }
                    } else {
                        // console.log(this.mapService.geocercas[i]['coordenada_geocerca']);
                        // tslint:disable-next-line: max-line-length
                        // console.log(this.mapService.isMarkerInsidePolygonPoint(this.viajes[position][index].lat, this.viajes[position][index].lng, this.mapService.geocercas[i]['coordenada_geocerca']));
                        // tslint:disable-next-line: max-line-length
                        const dentroGeocerca = this.mapService.isMarkerInsidePolygonPoint(this.viajes[position][index].lat, this.viajes[position][index].lng, this.localStorageService.geocercas[i]['coordenada_geocerca']);
                        if (dentroGeocerca) {
                            this.viajes[position][index].address = this.localStorageService.geocercas[i]['nombre_geocerca'];
                            // return;
                        }
                    }
                }
            }
        }
    }

    date(ev) {
        // console.log(ev);
        return new Date(ev).toISOString();
    }

    eventoDetalle(event: RawData, index: number ) {

        // console.log('evento detalle: ', event);

        this.itemSelectDetails = index;
        
        this.mapService.moverMapa(event.lat, event.lng);

        let ps = '0';

        if (event.PS00 === undefined || event.PS00 === '') {
            ps = event.PS00;
        } else {

        }

        // cerramos todos los popup que existan
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

            // this.mapService.popupEvent = L.popup();
            // this.mapService.popupEvent.setLatLng([event.lat, event.lng]);
            // this.mapService.popupEvent.setContent(this.contenidoPopup(event, data));
            // this.mapService.popupEvent.addTo(this.mapService.rootMap);
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

        // creamos un nuevo popup
        this.mapService.popupEvent = L.popup();
        this.mapService.popupEvent.setLatLng([event.lat, event.lng]);
        this.mapService.popupEvent.setContent(this.mapService.contenidoPopupEspera());
        this.mapService.popupEvent.addTo(this.mapService.rootMap);

        this.restService.obtenerImagen(event.imei, event.PS00).subscribe((data) => {

            // this.mapService.popupEvent = L.popup();
            // this.mapService.popupEvent.setLatLng([event.lat, event.lng]);
            // this.mapService.popupEvent.setContent(this.contenidoPopup(event, data));
            // this.mapService.popupEvent.addTo(this.mapService.rootMap);
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

        const horaConvertida = this.converterUTCToLocalDate(event) + ' ' + this.convertAmPm(this.converterUTCToLocalTime(event));

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

    verFoto(event) {
        // console.log(event);
        this.dialogImagen(event, event.imei, event.PS00);
    }

    verFotoDobleCamara(event) {

        this.openDialogDobleCamara(event, event.imei);
    }

    dialogImagen(title: string, imei, PS00) {
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
            width: anchoPantalla+'px',
           
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    openDialogDobleCamara(evento: string, imei: string) {
        const dialogRef = this.dialog.open(DialogImageDobleCamaraComponent, {
            data: {
                evento,
                imei,
                modulo: 2
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    isDesktop(): boolean {
        if (window.innerWidth > 575) {
            return true;
        } else {
            return false;
        }
    }

    detalleResumen(ev) {

        const dialogRef = this.dialog.open(DialogResumenComponent, {
            width: '600px',
            data: {
                title: this.localStorageService.lenguaje.lan128,
                body: ev
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
    }

    diferenciaEntreFecha(now, then) {
        return moment.utc(moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'))).format('HH:mm:ss');
    }

    numero(num) {
        return Number(num);
    }

    convertirMiAKm(millas: string) {
        return Number(Number(millas) * 1.609).toFixed(2);
    }

    evaluarCondicion(val) {
        if (Number(val) <= 0.01) {
        return true;
        } else {
        return false;
        }
    }

    geocodeLatLng(lat1: number, lng1: number): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            L.esri.Geocoding.reverseGeocode().latlng([lat1, lng1]).run((error, result, response) => {
                console.log('resultados',result);
                console.log('respuesta',response);
                console.log('error: ', error)
                resolve("result['address']['Match_addr']");
            });
        });
    }

    async obtenerDireccion() {
        return await 'hola mundo';
    }

    conLat(lat: any) {
        return Number(lat.substr(0, 3) + '.' + lat.substr(3, 9));
    }

    conLng(lng: any) {
        return Number(lng.substr(0, 4) + '.' + lng.substr(4, 9));
    }

    esHoy(viaje) {
        console.log('es hoy: ', viaje);
        // console.log(moment().format('YYYY-MM-DD') + ',' + moment(viaje[0].event_time).format('YYYY-MM-DD') );
        if ( String(moment().format('YYYY-MM-DD')) === String(moment(viaje.event_time).format('YYYY-MM-DD'))) {
            return true;
        } else {
            return false;
        }
    }

    conteoViaje(cantidad) {
        return Math.round((cantidad / 2));
    }

    seleccionarFechas(ev) {
        
        const dialogRef = this.dialog.open(DialogCalendarComponent, {
        data: {
            title: this.imei,
            body: 'cuerpo'
        }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);

        if ( result.end ) {
            // console.log('desde: ', result.start.getFullYear() + '-' + ( result.start.getMonth() + 1) + '-' + result.start.getDate());
            // console.log('hasta: ', result.end.getFullYear() + '-' + ( result.end.getMonth() + 1) + '-' + result.end.getDate());
            const fInit = result.start.getFullYear() + '-' + ( result.start.getMonth() + 1) + '-' + result.start.getDate();
            const fFin = result.end.getFullYear() + '-' + ( result.end.getMonth() + 1) + '-' + result.end.getDate();

            // convertir fecha y hora local a hora UTC
            const utcStart = moment(fInit + 'T' + result.hInit, 'YYYY-MM-DDTHH:mm:ss').utc();
            // hora final
            const utcEnd = moment(fFin + 'T' + result.hEnd, 'YYYY-MM-DDTHH:mm:ss').utc();

            // console.log(utcEnd.format());
            // this.obtenerDetallesViajes(ev.value, String(utcStart.format()), String(utcEnd.format()), this.vehiculos[i].nombre);
            this.mapService.contenedorVehiculos = false;
            this.fechaInit = String(utcStart.format());
            this.fechaFin = String(utcEnd.format());
            this.obtenerDetalleViajes();
        } else {
            // console.log('desde: ', result.start.getFullYear() + '-' + ( result.start.getMonth() + 1) + '-' + result.start.getDate());
            // console.log('hasta: ', result.start.getFullYear() + '-' + ( result.start.getMonth() + 1) + '-' + result.start.getDate());
            const fInit2 = result.start.getFullYear() + '-' + ( result.start.getMonth() + 1) + '-' + result.start.getDate();
            const fFin2 = result.start.getFullYear() + '-' + ( result.start.getMonth() + 1) + '-' + result.start.getDate();

            // convertir fecha y hora local a hora UTC
            const utcStart = moment(fInit2 + 'T' + result.hInit, 'YYYY-MM-DDTHH:mm:ss').utc();
            // console.log(utcStart.format());
            // hora final
            const utcEnd = moment(fFin2 + 'T' + result.hEnd, 'YYYY-MM-DDTHH:mm:ss').utc();

            this.fechaInit = String(utcStart.format());
            this.fechaFin = String(utcEnd.format());
            this.obtenerDetalleViajes();
            // this.obtenerDetallesViajes(ev.value, String(utcStart.format()), String(utcEnd.format()), this.vehiculos[i].nombre);
            this.mapService.contenedorVehiculos = false;
        }

        // console.log('desde: ', result.start.getDate());
        });
    }

    mostrarDetalleViaje(viaje: any, numViaje: number, viajeNumero: number) {
        if (viaje[0].VO - viaje[viaje.length - 1].VO > 10) {
            // this.numViaje = Math.round(numRealViaje);
            this.numViaje = viajeNumero;
            this.noEsViaje = 0;
        } else {
            this.noEsViaje = 1;
            this.numViaje = 0;
        }


        // console.log(viaje);
        // quitamos visibilidad de viajes
        this.viewViajes = false;
        // damos visibilidad a detalle de viajes
        this.viewDetalleViajes = true;

        // vaciamos detalle de viajes
        this.detalleViaje = [];
        // llenamos la iformacion con el detalle de viaje
        this.detalleViaje.push(...viaje);


    }

    async openGroup(ev: RawData[], position, color: string, conMarker) {
        
        this.itemSelect = position;

        // console.log('eventos: ', ev);
        // console.log('posicion: ', position);
        this.indexViaje = position;

        // polyline
        this.mapService.arrayLatLng = [];
        //marcadores
        this.arrayLatLng = [];

        this.mapService.viajeSeleccionado = [];
        // this.mapService.clearMap();
        // tslint:disable-next-line: forin
        for (const i in ev) {
            // console.log('lat:', Number(ev[i].lat.substr(0, 3) + '.' + ev[i].lat.substr(3, 9)));

            // este array sirve para crear el polyline
            this.mapService.arrayLatLng.push([ev[i].lat, ev[i].lng, ev[i].id]);

            // este sirve para los marcadores
            if (ev[i].PS00 != '') {
                this.arrayLatLng.push([ev[i].lat, ev[i].lng, ev[i].id, ev[i].PS00]);
            } else {
                if (ev[i].icono === 1) {
                    // console.log('icono: ', ev[i].nombre_icono);
                    // con icono etiqueta
                    this.arrayLatLng.push([ev[i].lat, ev[i].lng, ev[i].id, -1, 1, ev[i].descripcion_icono, ev[i].color_icono]);
                } else {
                    // sin icono de etiqueta
                    this.arrayLatLng.push([ev[i].lat, ev[i].lng, ev[i].id, -1, 0, '', '']);
                }
                
            }
            
            this.mapService.viajeSeleccionado.push(ev[i]);
            
        }

        if (conMarker) {
            
            this.mapService.eventos = [];
            this.mapService.eventos = ev;

            this.mapService.dibujarPolyLine(color);
            this.resolverDirecciones(ev, position, color, conMarker);
            this.crearMarcadoresCirculares();
        } else {
            
            // evaluamos si existe marcado ese viaje para poder eliminarlo o armarlo de nuevo (linea)
            const indexV = this.viajesDibujado.findIndex(v => v.index === position);
            const indexV2 = this.banderaDibujado.findIndex(v => v.index === position);

            if (indexV === -1) {
                // significa que no existe y hay que agregarlo y ademas de dibujar la linea de marcadores
                this.viajesDibujado.push({index: Number(position), dibujado: true});
                
                this.mapService.dibujarPolyLineSinMarker(color);

                if (indexV2 > -1) {
                    this.banderaDibujado[indexV2].dibujado = true;
                }
            } else {
                // significa que existe y hay que evaluar si esta dibujado, hay que eliminarlo sino hay que dibujarlo
                if (this.viajesDibujado[indexV].dibujado === true) {
                    // si esta dibujado hay que limpiarlo
                    this.viajesDibujado[indexV].dibujado = false;
                    this.mapService.clearMapPolyLine(ev.length);
                    
                    if (indexV2 > -1) {
                        this.banderaDibujado[indexV2].dibujado = false;
                    }
                } else {
                    // si no esta dibujado hay que crearlo
                    this.viajesDibujado[indexV].dibujado = true;
                    this.mapService.dibujarPolyLineSinMarker(color);
                    
                    if (indexV2 > -1) {
                        this.banderaDibujado[indexV2].dibujado = true;
                    }
                }

            }

        }        
    }

    atrasTotalesViajes() {
        // agregamos visibilidad de viajes
        this.viewViajes = true;
        // quitamos visibilidad a detalle de viajes
        this.viewDetalleViajes = false;
        // vaciamos detalle de viajes
        this.detalleViaje = [];
        this.boolEventoNoGenerado = false;
        this.mapService.clearPointMarker();
    }

    detalleResumenViajes() {
        const dialogRef = this.dialog.open(DialogResumenViajeComponent, {
            width: '500px',
            data: {
                viajes: this.viajes,
                totalDistancia: this.totalDistancia,
                cantidadViajes: this.numeroViaje,
                velocidadPromedio: this.velocidadPromedio,
                velocidadMaxima: this.velocidadMaximo,
                odometroVirtual: this.odometroVirtual,
                rawdata: this.datosSinProcesar
            }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);
        });
    }

    dibujarGeocercas() {

        for (let i in this.localStorageService.geocercas) {

            if (this.localStorageService.geocercas[i].visibilidad === 1) {
                if (Boolean(JSON.parse(this.localStorageService.geocercas[i]['circular'])) === true) {
                    // insertamos una geocerca cirular al mapa
                    // tslint:disable-next-line: no-string-literal
                    const lat = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lat;
                    // tslint:disable-next-line: no-string-literal
                    const lng = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].lng;
                    // tslint:disable-next-line: no-string-literal
                    const radio = this.localStorageService.geocercas[i]['coordenada_geocerca'][0].radio;

                    // const circle = new L.circle([lat, lng], radio).addTo(this.mapService.rootMap);
                    let circle = new L.circle([lat, lng], radio);
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
                                            Colección: <strong>${this.localStorageService.geocercas[i]['nombre']}</strong>
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
                    // const polygon = L.polygon(latLngs).addTo(this.mapService.rootMap);
                    let polygon = L.polygon(latLngs);
                    polygon.type = 'G';
                    polygon.addTo(this.mapService.rootMap);
                    //  polygon.enableEdit();
                    const contenido = `<h6>${this.localStorageService.geocercas[i]['nombre_geocerca']}</h6>
                                        <p style="margin-bottom:0px">
                                            Colección: <strong>${this.localStorageService.geocercas[i]['nombre']}</strong>
                                        </p>
                                        <p style="margin-bottom:0px">
                                            ID Geocerca: ${this.localStorageService.geocercas[i]['id_geocerca']}
                                        </p>`;
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
            } else {
                // console.log('no hay resultados geocercas');
            }
        }
    }

    preferenciaVistaViaje() {
        // pre = predeterminado
        // aum = aumentado con mas detalle
        this.vistaTotalesViaje = 'aum';
    }

    viajeAnterior() {
  
        if (this.viajes[this.indexViaje + 1]) {
            // console.log('viajeSiguiente: ', this.viajes[this.indexViaje + 1]);
            this.mostrarDetalleViaje(this.viajes[this.indexViaje + 1], this.indexViaje + 1, this.viajes[this.indexViaje + 1][0].num_viaje );
            this.openGroup(this.viajes[this.indexViaje + 1], this.indexViaje + 1, this.viajes[this.indexViaje + 1][0].color, true);
        } else {
            // console.log('no definido');
            this._snackBar.open(`Ya no hay viajes`, 'OK', {
                duration: 5000,
            });
        }
    } 

    viajeSiguiente() {
        
        if (this.viajes[this.indexViaje - 1]) {
            // console.log('viajeAnterior: ', this.viajes[this.indexViaje - 1]);
            this.mostrarDetalleViaje(this.viajes[this.indexViaje - 1], this.indexViaje - 1, this.viajes[this.indexViaje - 1][0].num_viaje );
            this.openGroup(this.viajes[this.indexViaje - 1], this.indexViaje - 1, this.viajes[this.indexViaje - 1][0].color, true)
        } else {
            // console.log('no definido');
            this._snackBar.open(`Ya no hay viajes`, 'OK', {
                duration: 5000,
            });
        }
    }

    seleccionHoverMarker(bool, evento) {
        // console.log('seleccion hover:', bool);
        // console.log('evento: ', evento);
        this.mapService.changeRadiusMarker(evento.lat, evento.lng, bool);
    }

    scroll(scrollIndex: number) {
        this.viewPortDetalle.scrollToIndex(scrollIndex, 'smooth');
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
                            this.scroll(index);
                            this.itemSelectDetails = index;
                            this.infoPopup(this.detalleViaje[index]);
                        }
                    });
    
                    marker.addTo(this.mapService.rootMap);

                } else {
                    // sin icono de etiqueta
                    var circleMarker = L.circleMarker([this.arrayLatLng[i][0], this.arrayLatLng[i][1]], {
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
                        // console.log('emitio evento marker', ev.target.name);
                        // this.wsService.emit('circle-marker', {data: this.arrayLatLng[i][2]});
                        // this.scroll(ev.target.name);
                        
                        const index = this.mapService.viajeSeleccionado.findIndex((v) => v.id === ev.target.name);
        
                        // console.log('index encontrado: ', this.mapService.viajeSeleccionado[0].id);
                        if (index > -1) {
                            this.scroll(index);
                            this.itemSelectDetails = index;
                            this.infoPopup(this.detalleViaje[index]);
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
                        this.scroll(index);
                        this.itemSelectDetails = index;
                        this.infoPopup(this.detalleViaje[index]);
                    }
                });

                marker.addTo(this.mapService.rootMap);
            }
        }
    }
}
