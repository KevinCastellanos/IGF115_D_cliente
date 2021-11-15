import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterLinkActive, Routes, RouterModule } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import * as XLSX from 'xlsx';
import { ConfiguracionDispositivo, Configuracion } from '../../interfaces/configuracionDispositivo';
import * as moment from 'moment';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { CodigoEvento, CODIGOS_EVENTOS } from '../../interfaces/codigosEventos';
import { DataService } from '../../services/data.service';
import { DialogConfigComponent } from '../../components/dialog-config/dialog-config.component';
import { DialogEtiquetaComponent } from '../../components/dialog-etiqueta/dialog-etiqueta.component';
import { Device } from '../../interfaces/device';
import { ChatService } from '../../services/chat.service';
import { DialogListComandosComponent } from '../../components/dialog-list-comandos/dialog-list-comandos.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { DialogEditarDispositivoComponent } from '../../components/dialog-editar-dispositivo/dialog-editar-dispositivo.component';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { HistorialAsociacionesComponent } from '../../components/historial-asociaciones/historial-asociaciones.component';

// definimos las interfaces
export interface PeriodicElement {
  id_dispositivo?: number;
  id_vehiculo?: number;
  cod_configuracion?: string;
  imei?: string;
  modelo?: string;
  fw?: string;
  configuracion?: string;
  disabled?: string;
  asociado?: string;
  nombre?: string;
}

export interface MsgCliente {
  mensaje?: string;
  cliente?: boolean;
  num?: number;
}

// definimos las interfaces
export interface ElementVehicle {
  id_vehiculo?: number;
  id_dispositivo?: number;
  id_master: number;
  id_admin?: number;
  id_usuario?: number;
  imei: string;
  nombre: string;
  rxart?: string;
  interface?: string;
  imsi?: string;
  operador?: string;
  id_sim?: string;
  version?: string;
  registrado?: string;
  year_vehicle?: string;
  marca?: string;
  modelo?: string;
  placa?: string;
  color?: string;
  vin?: string;
  descripcion?: string;
  id_grupo?: number;
}

// definimos el array de elementos
const ELEMENT_DATA: PeriodicElement[] = [];
const ELEMENT_DATA_VEHICLE: ElementVehicle[] = [];
const ELEMENT_DATA_VEHICLE2: ElementVehicle[] = [];
const ELEMENT_DATA_CONF: ConfiguracionDispositivo[] = [];
const ELEMENT_DATA_CONF_SCRIPT: any[] = [];



@Component({
  selector: 'app-configurar-vehiculo',
  templateUrl: './configurar-vehiculo.component.html',
  styleUrls: ['./configurar-vehiculo.component.css']
})

export class ConfigurarVehiculoComponent implements OnInit, AfterViewInit, OnDestroy {

  public vehiculoSinRegistrar: any;

  navigateList = ['home', 'guest'];

    // condiciones booleana
    isLinear = true;
    visible = 0;
    loaderVehicle = 0;
    loaderVehicleA = 0;
    isDesasociar = false;
    loaderSetImei = false;

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    // objetos que gestiona datos de registros
    disp = {
        imei: '',
        modelo: '',
        fw: '',
        configuracion: '',
        disabled: 'false',
        cod_configuracion: '',
        zona_horaria: 'America/El_Salvador'
    };

    regVehiculo: ElementVehicle = {
        id_vehiculo: 0,
        id_dispositivo: 0,
        id_master: 1,
        id_admin: 0,
        id_usuario: 0,
        imei: '0',
        nombre: '',
        rxart: '',
        interface: '',
        imsi: '',
        operador: '',
        id_sim: '',
        version: '',
        registrado: '',
        year_vehicle: '',
        marca: '',
        modelo: '',
        placa: '',
        color: '',
        vin: '',
        descripcion: ''
    };

    public vehiculoAsociado: ElementVehicle =  {
        id_vehiculo: 0,
        id_dispositivo: 0,
        id_master: 1,
        id_admin: 0,
        id_usuario: 0,
        imei: '',
        nombre: '',
        rxart: '',
        interface: '',
        imsi: '',
        operador: '',
        id_sim: '',
        version: '',
        registrado: '',
        year_vehicle: '',
        marca: '',
        modelo: '',
        placa: '',
        color: '',
        vin: '',
        descripcion: ''
    };

    public vehiculoAsociadoRefenciaTabla: ElementVehicle =  {
        id_vehiculo: 0,
        id_dispositivo: 0,
        id_master: 1,
        id_admin: 0,
        id_usuario: 0,
        imei: '',
        nombre: '',
        rxart: '',
        interface: '',
        imsi: '',
        operador: '',
        id_sim: '',
        version: '',
        registrado: '',
        year_vehicle: '',
        marca: '',
        modelo: '',
        placa: '',
        color: '',
        vin: '',
        descripcion: ''
    };

    willDownload = false;

    // nombramos las columnas a mostrar en la tabla
    displayedColumns: string[] = ['imei', 'id_vehiculo', 'fw', 'cod_configuracion','fecha_creacion', 'zona_horaria', 'id_dispositivo'];
    displayedColumnsVehicle: string[] = ['nombre', 'placa', 'imei', 'marca', 'fecha_creacion', 'id_dispositivo'];
    displayedColumnsVehicleA: string[] = ['nombre', 'placa', 'imei', 'marca'];
    displayedColumnsConf: string[] = [ 'id','nombre', 'fecha', 'gestion'];
    displayedColumnsConfScript: string[] = [ 'id', 'cod_configuracion_eq','nombre', 'cod_configuracion'];

    // inicializamos la tabla
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    dataSourceVehicle = new MatTableDataSource<ElementVehicle>(ELEMENT_DATA_VEHICLE);
    dataSourceVehicleA = new MatTableDataSource<ElementVehicle>(ELEMENT_DATA_VEHICLE2);
    dataSourceConf = new MatTableDataSource<ConfiguracionDispositivo>(ELEMENT_DATA_CONF);
    dataSourceConfScript = new MatTableDataSource<ConfiguracionDispositivo>(ELEMENT_DATA_CONF_SCRIPT);

    // obtenemos la referencia a elemento del DOM
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild('pag', {static: true}) paginatorVehicle: MatPaginator;
    @ViewChild('pagA', {static: true}) paginatorVehicleA: MatPaginator;
    @ViewChild('stepper', {static: true}) stepper;
    @ViewChild('pagConf', {static: true}) paginatorConf: MatPaginator;
    @ViewChild('pagConfScript', {static: true}) paginatorConfScript: MatPaginator;

    isLoadingResults = true;
    isRateLimitReached = true;

    imeiSeleccionado = '';

    objetoSeleccionado: PeriodicElement;
    objetoSeleccionadoImei: PeriodicElement = {
        id_dispositivo: 0,
        id_vehiculo: 0,
        imei: '',
        modelo: '',
        fw: '',
        configuracion: '',
        disabled: '',
        asociado: '',
        nombre: ''
    };

    public nombre = '';

    /** list of banks */
    public banks: any[] = [];
    /** list of banks */
    public banks2: any[] = CODIGOS_EVENTOS;
    public banksDispositivo: any[] = [];
    public banksImeis: any[] = [];
    public banksComandos: any[] = [];

    /** control for the selected bank */
    public bankCtrl: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    /** control for the selected bank */
    public bankCtrl2: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public bankFilterCtrl2: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanks2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect2', { static: true }) singleSelect2: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy2 = new Subject<void>();

    public configuracion: ConfiguracionDispositivo = {};
    public fecha = '';
    private confAgregado: any[] = [];
    private configuracionSeleccionado: ConfiguracionDispositivo = {};
    public listaConfiguracion: string[] = [];
    public nombreArchivo = 'Nombre';

    /** control for the selected bank */
    public bankCtrlDispositivo: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public bankFilterCtrlDispositivo: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanksDispositivo: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild('singleSelectDispositivo', { static: true }) singleSelectDispositivo: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroyDispositivo = new Subject<void>();

    /** control for the selected bank */
    public bankCtrlComandos: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public bankFilterCtrlComandos: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanksComandos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild('singleSelectComandos', { static: true }) singleSelectComandos: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroyComandos = new Subject<void>();


    /** control for the selected bank ****************************************************/
    public bankCtrlImeis: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public bankFilterCtrlImeis: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanksImeis: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelectImeis', { static: true }) singleSelectImeis: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroyImeis = new Subject<void>();



    public comandosEnCola = false;
    public comandosEnviar: any[] = [];
    public logComandos: MsgCliente[] = [];
    public conteoLogComando = 0;
    public elemento: HTMLElement;
    public verConfiguraciones = false;
    public modulos: any;

    /************************************ Select simple *************************************/
    // grupos seleccionado
    grupoSeleccionadoVehiculo: any;
    public grupos: any[] = [];
    public dataValidoVehiculo = true;
    public spinnerVehiculoRegistrar = false;

    public subWsMarcadorMover: Subscription;
    public subWsMarcadorSinReporte: Subscription;

    /**************************************** SELECT CON FILTRO GRUPOS ************************************************/
    /** datos crudos: lista de objetos */
    public banksGrupos: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlGrupos: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlGrupos: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksGrupos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectGrupos', { static: true }) singleSelectGrupos: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyGrupos = new Subject<void>();
    /**************************************** SELECT CON FILTRO GRUPOS ************************************************/

    public spinner1 = false;
    public spinner2 = false;

    public disableDispositivo = false;

    public zonaHoraria = 'America/El_Salvador';

    public boolAgregarDispositivo = false;

    private idConexion = 0;
    private imeiSeleccionado2 = 0;

    constructor(private restService: RestService,
                private formBuilder: FormBuilder,
                private dialog: MatDialog,
                private dataService: DataService,
                private chatService: ChatService,
                public localStorageService: LocalStorageService,
                public wsService: WebsocketService,) {
        this.obtenerEtiquetas();
        this.obtenerGrupos();
    }

    ngOnInit() {

        // conectar con el websocket manualmente
        this.wsService.conectarWs();

        this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            // console.log('modulos asignados: ');
            // console.log(data);
            this.modulos = data;
        }, (err) => {
            console.log(err);
        });

        this.chatService.obtenerRespuestaConsola().subscribe( (msg: any) => {
            // console.log('mensaje respuesta: ', msg['cuerpo']);

            const log2: MsgCliente = {
                mensaje:  msg['cuerpo'],
                cliente: false
            };
            this.logComandos.push(log2);

            // this.scriptEnCola(false);
        });

        this.fecha = moment().format('YYYY-MM-DD HH:mm:ss');
        this.configuracion.configuracion = [];

        this.obtenerImeis();
        this.obtenerConfiguracionesScript();
        this.obtenerVehiculosAsignados();
        this.obtenerConfiguracionesDispositivos();

        // ingregar la data en el paginator
        this.dataSource.paginator = this.paginator;
        this.dataSourceVehicle.paginator = this.paginatorVehicle;
        this.dataSourceVehicleA.paginator = this.paginatorVehicleA;
        this.dataSourceConf.paginator = this.paginatorConf;
        this.dataSourceConfScript.paginator = this.paginatorConfScript;

        this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this.formBuilder.group({
        secondCtrl: ['', Validators.required]
        });

        this.restService.obtenerVehiculosSinregistrar().subscribe((response) => {
            // console.log(response);
            this.vehiculoSinRegistrar = response;
            // llenar de data el objeto de vehiculos
            this.dataSourceVehicle.data = [];
            this.dataSourceVehicle.data.push(...response);
            this.dataSourceVehicle.data = this.dataSourceVehicle.data;
        }, (error) => {
            console.log('error is ', error);
        });

        this.matSelect2();

        this.escucharSockets();
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    dataVehiculo(event) {
        console.log(event.value);
    }

    click(event) {
        console.log('click en un enlace a');
        console.log(event);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterVehicles(filterValue: string) {
        this.dataSourceVehicle.filter = filterValue.trim().toLowerCase();
    }

    applyFilterVehiclesAsociacion(filterValue: string) {
        this.dataSourceVehicleA.filter = filterValue.trim().toLowerCase();
    }

    registrarDispositivo() {
        
        // console.log('zona horaria: ', this.zonaHoraria);
        this.disableDispositivo = true;
        this.visible = 1;

        // console.log('datos del dispositivos');
        // console.log(this.disp);
        this.disp.configuracion = this.configuracionSeleccionado.nombre;
        this.disp.cod_configuracion = this.configuracionSeleccionado.cod_configuracion;
        this.disp.zona_horaria = this.zonaHoraria

        console.log('DATOS DISPOSITIVO: ', this.disp);
        // buscamos duplicidad en imei
        const imeiDuplicado = this.dataSource.data.find((d) => d.imei === this.disp.imei);

        if(!imeiDuplicado) {
            console.log('no existe hay que registrarlo');

            this.restService.registrarDispositivo(this.disp).subscribe((data) => {
                // console.log(data);
                this.visible = 0;
                // tslint:disable-next-line: no-string-literal
                if (data['ok'] === true) {
    
                    // tslint:disable-next-line: max-line-length
                    this.dataSource.data.push({modelo: this.disp.modelo, id_vehiculo: 0, id_dispositivo: Number(data['id']), imei: this.disp.imei, fw: this.disp.fw, configuracion: this.disp.configuracion});
                    //
                    this.dataSource.data = this.dataSource.data;
                    // this.dataSource.filter = '';
    
                    console.log('guardado exitosamente');
                    this.openDialog('OK', 'Dispositivo guardado exitosamente');
                    // resetamos el formulario
                    this.disp.imei = '';
                    this.disp.modelo = '';
                    this.disp.fw = '';
                    this.disp.configuracion = '';
                    this.disableDispositivo = false;
    
                } else {
                    console.log('error al guardar datos');
                    this.openDialog('Error', 'Dispositivo no guardado');
                    this.disableDispositivo = false;
                }
    
            }, (error) => {
                console.log(error);
            });
        } else {
            console.log('existe mensaje de advertencia');
            this.openDialog('Error', `IMEI: ${this.disp.imei} duplicado`);
            this.disableDispositivo = false;
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

    obtenerImeis() {
        this.restService.obtenerImeis().subscribe((response) => {
            console.log('dispositivos', response);

            // tslint:disable-next-line: max-line-length
            // this.dataSource = new MatTableDataSource<PeriodicElement>(response);
            this.dataSource.data = [];  // vacias los datos
            this.dataSource.data.push(...response);
            this.dataSource.data = this.dataSource.data;
            
            
            this.banksDispositivo.push(...response);

            // llenamos la lista de busqueda select
            this.banksImeis.push(...response);

            this.matSelectDispositivo();
            this.matSelectImeis();
            // console.log('-------------------');
            // console.log(this.dataSource.data[0].imei);
            this.isLoadingResults = false;
        }, (error) => { console.log(error); });
    }

    changeListener(files: FileList) {

        console.log(files);

        if (files && files.length > 0) {

        const file: File = files.item(0);
        console.log(file.name);
        console.log(file.size);
        console.log(file.type);
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const csv = reader.result;
            console.log(csv);
        };
        }
    }

    onFileChange(ev) {

        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];

        reader.onload = (event) => {
            // 
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            // const dataString = JSON.stringify(jsonData);
            console.log(this.dataSource.data);

            // tslint:disable-next-line: no-string-literal
            for (const row of jsonData['Hoja1']) {
                console.log('***');
                // console.log(row.imei);
                console.log(this.filterItems(this.dataSource.data, String(row.imei))[0]);
                if (this.filterItems(this.dataSource.data, String(row.imei))[0] === undefined) {
                    console.log('no hay registro, puede registrarlo en la db');

                    const dispRow = {
                        imei: row.imei,
                        modelo: 'sin especificar',
                        fw: 'sin especificar',
                        configuracion: 'sin especificar',
                        disabled: 'false',
                        cod_configuracion: 'YkMPST4yHPF2i0XGwDnoLcywQE1N5e',
                    };

                    console.log(dispRow);
                    // registrar dispositivos
                    // --------------------------------------------------
                    // tslint:disable-next-line: no-shadowed-variable
                    this.restService.registrarDispositivo(dispRow).subscribe((data) => {
                        console.log(data);
                        this.visible = 0;
                        // tslint:disable-next-line: no-string-literal
                        if (data['ok'] === true) {

                            // tslint:disable-next-line: max-line-length
                            this.dataSource.data.push({modelo: '', id_vehiculo: 0, id_dispositivo: Number(data['id']), imei: row.imei, fw: '', configuracion: ''});
                            //
                            this.dataSource.data = this.dataSource.data;
                            // this.dataSource.filter = '';
                            console.log('guardado exitosamente');
                            // this.openDialog('OK', 'Dispositivo guardado exitosamente');
                            // resetamos el formulario
                            // tslint:disable-next-line: max-line-length
                            document.getElementById('output').innerHTML += `<p style="color: green">imei: ${row.imei} registrado exitosamente</p>`;
                        } else {
                            console.log('error al guardar datos');
                            this.openDialog('Error', 'Dispositivo no guardado');
                        }

                    }, (error) => { console.log(error); });
                    // -------------------------------------------------
                } else {
                    console.log('ya existe el registro');
                    document.getElementById('output').innerHTML += `<p style="color: red">imei: ${row.imei} ya existe</p>`;
                }

            }
        };
        reader.readAsBinaryString(file);
    }

    crearGeocercaPorExcel(ev) {
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];

        reader.onload = (event) => {
            // leemos el archivo
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            // obetenermos la informacion del excel
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            // const dataString = JSON.stringify(jsonData);
            console.log('--------informacion geocerca------');
            console.log('Reference Points');
            console.log(jsonData);

            const coleccionSeleccionada = [{
                cantidad: 132,
                cantidad_vehiculo: 0,
                ciudad: null,
                coleccion: 1,
                direccion_1: 'Guyana',
                direccion_2: null,
                email: null,
                fecha: '2020-07-15T18:11:56.000Z',
                fecha_actualizado: null,
                fecha_creado: null,
                id: 56,
                id_coleccion_geocerca: 21,
                id_grupo: 30,
                logo: null,
                nombre: 'Massy Distribution',
                nombre_compania: 'Massy distribution',
                nombre_grupo: 'Massy distribution',
                pais: null,
                status: 0
            }];
            for (const row of jsonData['Reference Points']) {
                // console.log(row);
                if (row['Radius (meters)'] !== 0) {

                    const radio = row['Radius (meters)'];
                    const latLng = {
                        lat: row['Latitude'],
                        lng: row['Longitude']
                    };
                    const nombreGeocerca = row['Name'];
                    const fecha = '2020-09-10 19:44:52';

                    /*console.log('circular');
                    console.log('radio: ', radio);
                    console.log('latLng', latLng);
                    console.log('nombre: ', nombreGeocerca);*/
                    this.restService.registrarGeocercaCircularColecciones(  radio,
                                                                    latLng,
                                                                    nombreGeocerca,
                                                                    [],
                                                                    coleccionSeleccionada,
                                                                    fecha,
                                                                    'true').subscribe((resp) => {
                        // console.log(resp);
                        if (resp['affectedRows'] === 1) {
                            // this.dialogRef.close({accept: true});
                            // tslint:disable-next-line: max-line-length
                            document.getElementById('output2').innerHTML += `<p style="color: green">G: ${nombreGeocerca} registrado exitosamente</p>`;
                        } else {
                            // this.dialogRef.close({accept: false});
                            // tslint:disable-next-line: max-line-length
                            document.getElementById('output2').innerHTML += `<p style="color: red">G: ${nombreGeocerca} no se pudo registrar</p>`;
                        }
                        // this.desabilitar = false;
                    }, (err) => {
                            console.log(err);
                            // this.desabilitar = false;
                            // tslint:disable-next-line: max-line-length
                            document.getElementById('output2').innerHTML += `<p style="color: red">G: ${nombreGeocerca} no se pudo registrar</p>`;
                    });
                } else {
                    const latLngs = row['Corners (X Y, X Y, X Y)'];
                    const nombreGeocerca = row['Name'];
                    const fecha = '2020-09-10 19:44:52';
                    console.log('poligonal');
                    // console.log(latLngs.split(','));
                    let latLngsArmado: any[] = [];
                    for (const s of latLngs.split(',')) {
                        const l = s.split(' ')[1];
                        const n = s.split(' ')[0];
                        latLngsArmado.push({lat: l, lng: n});
                    }
                    // console.log(latLngsArmado);
                    this.restService.registrarGeocercaPoligonalColecciones(
                                                                            -1,
                                                                            latLngsArmado,
                                                                            nombreGeocerca,
                                                                            [],
                                                                            coleccionSeleccionada,
                                                                            fecha, 'false').subscribe((resp) => {
                        // console.log(resp);
                        if (resp['affectedRows'] === 1) {
                            // this.dialogRef.close(true);
                            document.getElementById('output2').innerHTML += `<p style="color: green">G: ${nombreGeocerca} registrado exitosamente</p>`;
                        } else {
                            //  this.dialogRef.close(false);
                            document.getElementById('output2').innerHTML += `<p style="color: red">G: ${nombreGeocerca} no se pudo registrar</p>`;
                        }
                        // this.desabilitar = false;
                    }, (err) => {
                        console.log(err);
                        // this.desabilitar = false;
                        document.getElementById('output2').innerHTML += `<p style="color: red">G: ${nombreGeocerca} no se pudo registrar</p>`;
                    });
                }
            }
        };
        reader.readAsBinaryString(file);
    }

    /*setDownload(data) {
        this.willDownload = true;
        setTimeout(() => {
        const el = document. ("#download");
        el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
        el.setAttribute("download", 'xlsxtojson.json');
        }, 1000);
    }*/

    filterItems(arrs: any, query: string) {
        // tslint:disable-next-line: only-arrow-functions
        return arrs.filter(dispositivo => dispositivo.imei === query);
    }

    findIndex(arr: any, query: string) {
        return arr.findIndex(dispositivo => dispositivo.imei === query);
    }

    onCompleteItem($event) {
        console.log($event);
    }

    registrarVehiculo() {

        this.loaderVehicle = 1;
        this.dataValidoVehiculo = true;
        this.spinnerVehiculoRegistrar = true;

        if (typeof(this.objetoSeleccionado) !== 'undefined') {
            this.regVehiculo.imei = this.objetoSeleccionado.imei;
            this.regVehiculo.id_dispositivo = Number(this.objetoSeleccionado.id_dispositivo);
        } else {
            this.regVehiculo.imei = '';
        }

        // console.log(this.regVehiculo);

        // this.objetoSeleccionado.disabled = 'true';
        // console.log('DATOS DEL DISPOSITIVO');
        // console.log(this.objetoSeleccionado);
        // console.log(this.regVehiculo);
        // console.log('datos', this.bankCtrlImeis.value.imei);
        // console.log('datos', this.bankCtrlImeis.value.id_dispositivo);

        this.regVehiculo.imei = this.bankCtrlImeis.value.imei;
        this.regVehiculo.id_dispositivo = this.bankCtrlImeis.value.id_dispositivo;
        this.regVehiculo.id_grupo = this.grupoSeleccionadoVehiculo.id_grupo;
        console.log('id grupo: ', this.grupoSeleccionadoVehiculo.id_grupo);
        this.restService.registrarVehiculo(this.regVehiculo).subscribe((data) => {
            console.log(data);
            // tslint:disable-next-line: no-string-literal
            if (data['ok'] === true) {

                let dat: ElementVehicle = {
                    imei: this.regVehiculo.imei,
                    nombre: this.regVehiculo.nombre,
                    id_master: 1,
                    marca: this.regVehiculo.marca,
                    placa: this.regVehiculo.placa,
                    id_dispositivo: Number(this.objetoSeleccionado),
                    id_grupo: this.grupoSeleccionadoVehiculo.id_grupo
                };
                // tslint:disable-next-line: max-line-length
                this.dataSourceVehicle.data.push(dat);
                // console.log(this.regVehiculo);
                this.dataSourceVehicle.data = this.dataSourceVehicle.data;
                // this.dataSource.filter = '';

                console.log('guardado exitosamente');
                this.openDialog('OK', 'Vehículo guardado exitosamente');
                // resetamos el formulario

                // inabilitar elemento seleccionado
                if (typeof(this.objetoSeleccionado) !== 'undefined') {
                this.objetoSeleccionado.disabled = 'true';
                }
                // actualizar datos de la tabla de dispositivos
                if (typeof(this.objetoSeleccionado) !== 'undefined') {
                this.objetoSeleccionado.id_vehiculo = Number(data['id']);
                }
                // console.log(this.findIndex(this.dataSource.data, String(this.objetoSeleccionado.imei)));
                // tslint:disable-next-line: max-line-length
                // console.log('update', this.dataSource.data[this.findIndex(this.dataSource.data, String(this.objetoSeleccionado.imei))].id_vehiculo = Number(data['id']);
                this.objetoSeleccionado = undefined;
                this.dataSource.data = this.dataSource.data;

                this.regVehiculo.nombre = '';
                this.regVehiculo.year_vehicle = '';
                this.regVehiculo.marca = '';
                this.regVehiculo.modelo = '';
                this.regVehiculo.placa = '';
                this.regVehiculo.color = '';
                this.regVehiculo.vin = '';
                this.regVehiculo.descripcion = '';
                this.loaderVehicle = 0;
                this.spinnerVehiculoRegistrar = false;

                // limpiamos selets
                this.bankCtrlImeis.reset();
                this.bankCtrlGrupos.reset();

            } else {
                console.log('error al guardar datos');
                this.openDialog('Error', 'Dispositivo no guardado');
            }
        }, (error) => { console.log(error); });

    }

    getRow(row) {
        console.log(row);
    }

    obtenerDataVehiculoSeleccionado(row) {
        // row objeto de referencia de la tabla
        // console.log(row);
        let event: ElementVehicle = {
        imei: row.imei,
        nombre: row.nombre,
        id_vehiculo: row.id_vehiculo,
        id_master: 1
        };

        // console.log(event);
        this.vehiculoAsociado = event;
        // object con referencia a tabla 
        this.vehiculoAsociadoRefenciaTabla = row;
    }

    obtenerVehiculosAsignados() {
        this.restService.obtenerVehiculosAsociados().subscribe((response) => {
        // console.log('vehiculos asociados');
        // console.log(response);
        // llenar de data el objeto de vehiculos
        this.dataSourceVehicleA.data = [];  // vacias los datos
        this.dataSourceVehicleA.data.push(...response);
        this.dataSourceVehicleA.data = this.dataSourceVehicleA.data;
        }, (error) => {
        console.log(error);
        });
    }

    limpiarInputs() {
        this.vehiculoAsociado.imei = '';
        this.vehiculoAsociado.nombre = '';
        this.vehiculoAsociado.id_vehiculo = 0;
        this.isDesasociar = false;
    }

    confirmacionDesasociar() {
        this.isDesasociar = true;
    }

    reasignarImei() {

        this.loaderSetImei = true;

        console.log('imei antiguo: ', this.vehiculoAsociado.imei);
        console.log('imei nuevo: ', this.objetoSeleccionadoImei.imei);
        // 
        console.log('id vehiculo: ', this.vehiculoAsociado.id_vehiculo);
        
        // tslint:disable-next-line: max-line-length
        this.restService.reasignarImei(this.vehiculoAsociado.id_vehiculo, this.vehiculoAsociado.imei, this.objetoSeleccionadoImei.imei).subscribe((response) => {
            console.log(response);
            if (response['ok'] === true) {
                // actualizar la tabla con el nuevo imei
                // this.vehiculoAsociadoRefenciaTabla.imei = this.objetoSeleccionadoImei.imei;
                
                /*
                console.log('index', this.findIndex(this.dataSource.data, String(this.vehiculoAsociado.imei)));
                // tslint:disable-next-line: max-line-length .id_vehiculo = Number( this.vehiculoAsociado.id_vehiculo)
                console.log('update', this.dataSource.data[this.findIndex(this.dataSource.data, String(this.objetoSeleccionadoImei.imei))].id_vehiculo = Number( this.vehiculoAsociado.id_vehiculo));
                // tslint:disable-next-line: max-line-length
                console.log('update', this.dataSource.data[this.findIndex(this.dataSource.data, String(this.vehiculoAsociado.imei))].id_vehiculo = Number( 0 ) );
                // tslint:disable-next-line: max-line-length
                console.log('update', this.dataSourceVehicle.data[this.findIndex(this.dataSourceVehicle.data, String(this.vehiculoAsociado.imei))].imei = String( this.objetoSeleccionadoImei.imei ) );
                */

                // this.dataSourceVehicle.data = this.dataSourceVehicle.data;
                // this.dataSource.data = this.dataSource.data;
                this.openDialog('OK', 'Dispositivo reasignado exitosamente');

                this.loaderSetImei = false;
                this.limpiarInputs();
                this.stepper.reset();
            } else {
                this.loaderSetImei = false;
                this.openDialog('ERROR', 'Falló en la gestión, intente de nuevo');
            }

        }, (error) => {
        console.log(error);
        });
    }

    obtenerConfiguracionesDispositivos() {
        this.restService.obtenerConfiguraciones().subscribe((data) => {
        // console.log('-------------');
        //  console.log('DATA', data);
        this.dataSourceConf.data = [];  // vacias los datos
        this.dataSourceConf.data.push(...data);
        this.dataSourceConf.data = this.dataSourceConf.data;
        }, (err) => {
        console.log(err);
        });
    }


    applyFilterConf(filterValue: string) {
        this.dataSourceConf.filter = filterValue.trim().toLowerCase();
    }

    converterUTCToLocalDate(event) {
        // const utcTime = '2019-10-23 16:53:52';
        return moment.utc(event).local().format('YYYY-MM-DD');
        // return event;
    }

    matSelect() {

        // this.bankCtrl.setValue(this.banks[0]);

        // load the initial bank list
        this.filteredBanks.next(this.banks.slice());

        // listen for search field value changes
        this.bankFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanks();
        });
    }

    matSelect2() {
        // ----------------------------------------------------------
        this.filteredBanks2.next(this.banks2.slice());

        // listen for search field value changes
        this.bankFilterCtrl2.valueChanges.pipe(takeUntil(this._onDestroy2)).subscribe(() => {
        this.filterBanks2();
        });
    }

    matSelectDispositivo() {
        this.filteredBanksDispositivo.next(this.banksDispositivo.slice());

        // listen for search field value changes
        this.bankFilterCtrlDispositivo.valueChanges.pipe(takeUntil(this._onDestroyDispositivo)).subscribe(() => {
            this.filterBanksDispositivo();
        });
    }

    matSelectImeis() {
        this.filteredBanksImeis.next(this.banksImeis.slice());

        // listen for search field value changes
        this.bankFilterCtrlImeis.valueChanges.pipe(takeUntil(this._onDestroyImeis)).subscribe(() => {
            this.filterBanksImeis();
        });
    }

    matSelectComandos() {
        this.filteredBanksComandos.next(this.banksComandos.slice());

        // listen for search field value changes
        this.bankFilterCtrlComandos.valueChanges.pipe(takeUntil(this._onDestroyComandos)).subscribe(() => {
            this.filterBanksComandos();
        });
    }

    ngAfterViewInit() {
        this.setInitialValue();
        this.setInitialValue2();
        this.setInitialValueDispositivo();
        this.setInitialValueImeis();
        this.setInitialValueComandos();
        this.setInitialValueGrupos();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this._onDestroy2.next();
        this._onDestroy2.complete();
        this._onDestroyDispositivo.next();
        this._onDestroyDispositivo.complete();
        this._onDestroyComandos.next();
        this._onDestroyComandos.complete();
        this._onDestroyImeis.next();
        this._onDestroyImeis.complete();

        // desconectar con el websocket manualmente
        this.wsService.desconectarWs();
        // this.subWsMarcadorMover.unsubscribe();
        // this.subWsMarcadorSinReporte.unsubscribe();

        this._onDestroyGrupos.next();
        this._onDestroyGrupos.complete();

        this.subWsMarcadorMover.unsubscribe();
        this.subWsMarcadorSinReporte.unsubscribe();
    }

    /**
     * Sets the initial value after the filteredBanks are loaded initially
     */
    protected setInitialValue() {
        this.filteredBanks.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id_etiqueta === b.id_etiqueta;
        });

    }

    protected setInitialValue2() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanks2.pipe(take(1), takeUntil(this._onDestroy2)).subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect2.compareWith = (a: any, b: any) => a && b && a.cod === b.cod;
        });
    }

    protected setInitialValueDispositivo() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksDispositivo.pipe(take(1), takeUntil(this._onDestroyDispositivo)).subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelectDispositivo.compareWith = (a: any, b: any) => a && b &&  a.nombre === b.nombre;
        });
    }

    protected setInitialValueImeis() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksImeis.pipe(take(1), takeUntil(this._onDestroyImeis)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectImeis.compareWith = (a: any, b: any) => a && b &&  a.imei === b.imei;
        });
    }

    protected setInitialValueComandos() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksComandos.pipe(take(1), takeUntil(this._onDestroyComandos)).subscribe(() => {
            this.singleSelectComandos.compareWith = (a: any, b: any) => a && b &&  a.nombre === b.nombre;
        });
    }

    protected filterBanks() {
        if (!this.banks) {
        return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value;
        if (!search) {
        this.filteredBanks.next(this.banks.slice());
        return;
        } else {
        search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks.next(this.banks.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1));
    }

    protected filterBanks2() {
        // ---------------------------------------------------------------------------------
        if (!this.banks2) {
        return;
        }
        // get the search keyword
        let search2 = this.bankFilterCtrl2.value;
        if (!search2) {
        this.filteredBanks2.next(this.banks2.slice());
        return;
        } else {
        search2 = search2.toLowerCase();
        }
        // filter the banks
        this.filteredBanks2.next(this.banks2.filter(bank2 => bank2.cod.toLowerCase().indexOf(search2) > -1));
    }

    protected filterBanksDispositivo() {
        // ---------------------------------------------------------------------------------
        if (!this.banksDispositivo) {
        return;
        }
        // get the search keyword
        let searchDispositivo = this.bankFilterCtrlDispositivo.value;
        if (!searchDispositivo) {
        this.filteredBanksDispositivo.next(this.banksDispositivo.slice());
        return;
        } else {
        searchDispositivo = searchDispositivo.toLowerCase();
        }

        if (!isNaN(searchDispositivo)) {
        console.log('es numero');
        // tslint:disable-next-line: max-line-length
        this.filteredBanksDispositivo.next(this.banksDispositivo.filter(bankDispositivo => bankDispositivo.imei.toLowerCase().indexOf(searchDispositivo) > -1));
        } else {
        console.log('no es numero');
        // tslint:disable-next-line: max-line-length
        this.filteredBanksDispositivo.next(this.banksDispositivo.filter(bankDispositivo => bankDispositivo.nombre.toLowerCase().indexOf(searchDispositivo) > -1));
        }
        // filter the banks
        // tslint:disable-next-line: max-line-length
        // this.filteredBanksDispositivo.next(this.banksDispositivo.filter(bankDispositivo => bankDispositivo.imei.toLowerCase().indexOf(searchDispositivo) > -1));
        // tslint:disable-next-line: max-line-length
        
    }

    protected filterBanksImeis() {
        // ---------------------------------------------------------------------------------
        if (!this.banksImeis) {
            return;
        }

        // get the search keyword
        let searchImeis = this.bankFilterCtrlImeis.value;
        if (!searchImeis) {
            this.filteredBanksImeis.next(this.banksImeis.slice());
            return;
        } else {
            searchImeis = searchImeis.toLowerCase();
        }

        if (!isNaN(searchImeis)) {
            console.log('es numero');
            // tslint:disable-next-line: max-line-length
            this.filteredBanksImeis.next(this.banksImeis.filter(bankImei => bankImei.imei.toLowerCase().indexOf(searchImeis) > -1));
        } else {
            console.log('no es numero');
            // tslint:disable-next-line: max-line-length
            this.filteredBanksImeis.next(this.banksImeis.filter(bankImei => bankImei.nombre.toLowerCase().indexOf(searchImeis) > -1));
        }
    }

    protected filterBanksComandos() {
        // ---------------------------------------------------------------------------------
        if (!this.banksComandos) {
            return;
        }

        // get the search keyword
        let searchComandos = this.bankFilterCtrlComandos.value;
        if (!searchComandos) {
            this.filteredBanksComandos.next(this.banksComandos.slice());
            return;
        } else {
            searchComandos = searchComandos.toLowerCase();
        }
        // filter the banks
        // tslint:disable-next-line: max-line-length
        this.filteredBanksComandos.next(this.banksComandos.filter(bankComandos => bankComandos.nombre.toLowerCase().indexOf(searchComandos) > -1));
    }

    // se añade dinamicamente el elemento al componente de html.
    agregarItemConfiguracion() {

        // evaluamos que no exista el evento ya registrado
        const index = this.confAgregado.findIndex( (code: any) => {
            return code.cod1 === this.bankCtrl2.value.cod;
        } );

        if (index === -1) {
            let conf: Configuracion = {};

            // añadimos el item en el arreglo de objeto de configuracion
            conf.cod_evento = this.bankCtrl2.value.cod;
            conf.id_etiqueta = this.bankCtrl.value.id_etiqueta;
            conf.etiqueta = this.bankCtrl.value.nombre;
            conf.fotografia = Boolean(JSON.parse(this.bankCtrl.value.fotografia));
            conf.icono = this.bankCtrl.value.icono;
            conf.nombre_icono = this.bankCtrl.value.nombre_icono;
            conf.descripcion_icono = this.bankCtrl.value.descripcion_icono;
            conf.color_icono = this.bankCtrl.value.color_icono;

            // console.log('fot: ', Boolean(JSON.parse(this.bankCtrl.value.fotografia)));
            // agregamos el item en la configuracion
            this.configuracion.configuracion.push(conf);
            this.confAgregado.push({cod1: this.bankCtrl2.value.cod});
        } else {
            this.openDialog('ERROR', `No puede registrar el evento ${this.bankCtrl2.value.cod} mas de una vez en una configuración`);
        }

    }

    obtenerEtiquetas() {

        this.restService.obtenerEtiquetas().subscribe((response) => {
            // console.log('etiquetas obtenidas: ', response);
            this.banks.push(...response);
            this.matSelect();
        }, (error) => {
            console.log(error);
        });
    }

    registrarConfiguracion() {
        // console.log(this.configuracion.configuracion);

        if (this.evaluarNombreRepetido(this.nombre)) {
            if (this.nombre !== '') {
                if (this.configuracion.configuracion.length !== 0) {
                    this.configuracion.nombre = this.nombre;
                    this.configuracion.cod_configuracion = this.dataService.generadorId();
                    this.configuracion.fecha = String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));
                
                    console.log('datos a registrar en config etiqueta', this.configuracion);
                
                    this.restService.registrarConfiguracion(this.configuracion).subscribe((response) => {
                        console.log(response);
                
                        // tslint:disable-next-line: no-string-literal
                        if (response['affectedRows'] === 1) {
                        this.dataSourceConf.data.push(this.configuracion);
                        this.dataSourceConf.data = this.dataSourceConf.data;
                
                        this.openDialog('OK', 'Configuracion agregada exitosamente');
                
                        // limpiamos los inputs
                        this.configuracion.configuracion = [];
                        this.confAgregado = [];
                        this.nombre = '';
                
                        } else {
                        this.openDialog('Error', 'Error al guardar la configuración');
                        }
                    }, (err) => {
                
                        console.log(err);
                    });
                } else {
                this.openDialog('Error', 'Agrege al menos un evento en la configuración');
                }
            } else {
                this.openDialog('Error', 'Agrege un nombre a la configuración');
            }
        } else {
            this.openDialog('Error', 'Nombre de configuracion ya existente');
        }
        

    }

    eliminarEvento(item) {
        console.log(item);

        const index = this.configuracion.configuracion.findIndex( (code: any) => {
        return code.cod_evento === item.cod_evento;
        } );

        if (index > -1) {
            this.configuracion.configuracion.splice(index, 1);
            // console.log('item eliminado');
        }
    }

    obtenerConfiguracionSeleccionado(row: ConfiguracionDispositivo) {
        // console.log(row);

        this.restService.getConfig(row.cod_configuracion).subscribe((data) => {
            row.configuracion = data;
            // console.log(row);
            const dialogRef = this.dialog.open(DialogConfigComponent, {
                width: '600px',
                data: row
            });

            dialogRef.afterClosed().subscribe(result => {
                // console.log('The dialog was closed', result);
            });
        }, (err) => {
            console.log(err);
        });

    }

    dialogEliminarConfiguracion(id: string) {

        const dialogRef = this.dialog.open(DialogEtiquetaComponent, {
        maxWidth: '350px',
        data:  {
            title: 'Confirmar',
            body: '¿Desea eliminar la configuración?, esta acción es destructiva y desasociará al dispositivo.'
        }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
        console.log(dialogResult);

        if (dialogResult) {

            this.restService.eliminarConfiguracion(id).subscribe((data) => {
            console.log(data);
            this.openDialog('OK', 'Etiqueta Elimnado extisamente');

            const index = this.dataSourceConf.data.findIndex( dato => dato.id === Number(id) );

            // tslint:disable-next-line: align
            if (index > -1) {
                this.dataSourceConf.data.splice(index, 1);
                this.dataSourceConf.data = this.dataSourceConf.data;
                console.log('objeto eliminado');
            }

            }, (err) => {
            console.log(err);
            });
        } else {

        }
        });
    }

    evaluarNombreRepetido(nombre: string): boolean {

        const index = this.dataSourceConf.data.findIndex( (data) => {
        return data.nombre === nombre;
        });
        console.log(index);
        if (index !== -1) {
        return false;
        } else {
        return true;
        }
    }

    SeleccionarConfiguracionEt(event: ConfiguracionDispositivo) {
        // console.log(event);
        this.configuracionSeleccionado = event;
    }

    cambiarConfiguracionDispositivo(event, element: Device) {
        
        console.log(element);
        // buscamos la configuracion seleccionado
        const index = this.dataSourceConf.data.findIndex( (data) => {
        return data.cod_configuracion === event;
        });

        if (index > -1) {

            console.log(element.imei);
            console.log(this.dataSourceConf.data[index].cod_configuracion);
            console.log(this.dataSourceConf.data[index].nombre);

            this.restService.actualizarConfiguracionDispositivo(
                                                                element.imei,
                                                                this.dataSourceConf.data[index].cod_configuracion,
                                                                this.dataSourceConf.data[index].nombre
                                                                ).subscribe((res) => {
                console.log(res);
                this.openDialog('OK', 'Configuración actualizada conrrectamente');
            }, (err) => {
                console.log(err);
            });

        }
    }

    cambiarZonaHorariaDispositivo(event, element: Device) {
        
        console.log(element);

        this.restService.actualizarZonaHorariaDispositivo(element.imei, element.zona_horaria).subscribe((res) => {
            console.log(res);
            this.openDialog('OK', 'Zona horaria actualizada correctamente');
        }, (err) => {
            console.log(err);
        });
    }

    onFileComplete(data: any) {
        this.listaConfiguracion = [];
        // console.log(data); // We just print out data bubbled up from event emitter.
        // console.log(data['nombre']);
        // console.log(data['cuerpo'].split('\n'));
        const listComando: string[] = data['cuerpo'].split(/>|</);
        // insertamos la data en el arreglo para previsualización
        for (const i in listComando) {
        if (listComando[i] !== '' && listComando[i] !== '\r\n' && listComando[i] !== ' ') {
            this.listaConfiguracion.push('>' + listComando[i] + '<');
        }
        }

        this.nombreArchivo = data['nombre'];

        console.log(this.listaConfiguracion);
    }

    guardarNuevaConfiguracionEq() {
        const fechaUtc = String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));
        const codConf = this.dataService.generadorId();
        this.restService.agregarNuevaConfiguracionEq(codConf, this.nombreArchivo, fechaUtc, this.listaConfiguracion).subscribe((res) => {
        // console.log(res);
        if (res['affectedRows'] === 1) {
            this.openDialog('OK', 'Configuración guardada exitosamente');
            this.nombreArchivo = 'Nombre';
            this.listaConfiguracion = [];
        } else {
            this.openDialog('ERROR', 'Ups! no se pudo guarda la configuracion, intente mas tarde');
        }
        }, (err) => {
        console.log(err);
        });
    }

    // cargador script
    cargarScriptAEquipo() {

        /**
         * 
         * actualizamos el id de condiguracion de script
         * 
         */
        this.restService.actualizarIdConfiguracionScript(this.bankCtrlDispositivo.value.id_dispositivo, this.bankCtrlComandos.value.id).subscribe((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });

        this.restService.obtenerScript(this.bankCtrlComandos.value['cod_configuracion_eq']).subscribe((data) => {

            this.chatService.enviarcomandosConfiguracion(data, this.bankCtrlDispositivo.value.imei, this.idConexion, false);

            // tslint:disable-next-line: forin
            for (let i in data) {
                const log: MsgCliente = {
                    mensaje: data[i].comando,
                    cliente: true,
                    num: this.conteoLogComando += 1
                };

                this.logComandos.push(log);
            }
        }, (err) => {
            console.log(err);
        });

    }

    cargarScriptAEquipo2() {

        this.restService.obtenerScript(this.bankCtrlComandos.value['cod_configuracion_eq']).subscribe((data) => {

        }, (err) => {
        console.log(err);
        });

    }

    scriptEnCola(client: boolean) {

        if (this.comandosEnviar.length > 0) {

            const log: MsgCliente = {
                mensaje: this.comandosEnviar[0].comando,
                cliente: true,
                num: this.conteoLogComando += 1
            };

            this.logComandos.push(log);
            // console.log(this.comandosEnviar[0].comando.replace(/(?:\r\n|\r|\n)/g, ''));
            const comand = this.comandosEnviar[0].comando.replace(/(?:\r\n|\r|\n)/g, '');

            this.chatService.enviarComandos([`${comand}`], this.bankCtrlDispositivo.value.imei, this.bankCtrlDispositivo.value.id_conexion, false);
            this.comandosEnviar.splice(0, 1);
        } else {
            console.log('comandos vacio');
        }
        // this.chatService.enviarComandos(event.message, this.imei, this.idConexion);
    }

    obtenerConfiguracionesScript() {
        this.restService.obtenerConfiguracionScript().subscribe((data) => {
        // console.log(data);
        this.banksComandos.push(...data);

        // llenamos la tabla para gestionarla
        this.dataSourceConfScript.data.push(...data);
        this.dataSourceConfScript.data = this.dataSourceConfScript.data;

        this.matSelectComandos();
        }, (err) => {
        console.log(err);
        });
    }

    changeConfiguracionSeleccionada() {
        this.verConfiguraciones = true;
        console.log('configuraqciuon cargada', this.bankCtrlComandos.value);
    }

    dialogComandosConfiguracion() {
        // console.log(row);

        this.restService.obtenerScript(this.bankCtrlComandos.value['cod_configuracion_eq']).subscribe((res) => {
        // console.log(data[0].comando);
        const dialogRef = this.dialog.open(DialogListComandosComponent, {
            width: '600px',
            data: {
            titulo: this.bankCtrlComandos.value['nombre'],
            data: res
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
        }, (err) => {
        console.log(err);
        });
    }

    dialogComandosConfiguracion2(codConfiguracion: any, nombre: any) {
        // console.log(row);

        this.restService.obtenerScript(codConfiguracion).subscribe((res) => {
        // console.log(data[0].comando);
        const dialogRef = this.dialog.open(DialogListComandosComponent, {
            width: '600px',
            data: {
            titulo: nombre,
            data: res
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed', result);
        });
        }, (err) => {
        console.log(err);
        });
    }

    verHistorialAsociaciones(element) {
        this.spinner1 = true;
        console.log(element);

        this.restService.verHistorialAsociaciones(element).subscribe((res) => {
            this.spinner1 = false;
            console.log(res);
            const dialogRef = this.dialog.open(HistorialAsociacionesComponent, {
                width: '900px',
                data: {
                    titulo: 'Historial de asociaciones',
                    data: res
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                // console.log('The dialog was closed', result);
            });
        }, (err) => {
            console.log(err);
        });
    }

    verHistorialAsociacionesVehiculo(element) {
        console.log(element);
        this.spinner2 = true;
        this.restService.verHistorialAsociacionesVehiculo(element).subscribe((res) => {
            this.spinner2 = false;
            console.log(res);
            const dialogRef = this.dialog.open(HistorialAsociacionesComponent, {
                width: '900px',
                data: {
                    titulo: 'Historial de asociaciones',
                    data: res
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                // console.log('The dialog was closed', result);
            });
        }, (err) => {
            console.log(err);
        });
    }

    //
    dialogEditarVehiculo(event) {
        const dialogRef = this.dialog.open(DialogEditarDispositivoComponent, {
            width: '400px',
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            // tslint:disable-next-line: no-string-literal
            if (result.ok) {
                // tslint:disable-next-line: no-string-literal
                this.openDialog('OK', 'Vehículo editado con exito');
            } else {
                if (result.cancel) {

                } else {
                    this.openDialog('ERROR', 'Error al editar el vehículo');
                }

            }
        });
    }

    dialogEliminarDispositivo(event) {

    }

    eliminarVehiculo(vehiculo: any) {
        console.log('vehiculo eliminar: ', vehiculo);
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '400px',
            data: {body: `¿Desea eliminar el vehiculo ${vehiculo.nombre}?`}
        }); 

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                this.restService.eliminarVehiculo(vehiculo).subscribe((res) => {
                    console.log('vehiculo eliminado: ', res);
                    this.openDialog('OK', 'Vehículo eliminado con exito');
                }, (err) => {
                    console.log(err);
                    this.openDialog('ERROR', 'No se pudo eliminar el vehiculo');
                });
            } else {
                console.log(' se ha cancelado eliminacion');
            }
        });

    }

    eliminarDispositivo(dispositivo: any) {
        console.log('disp eliminar: ', dispositivo);

        if (dispositivo.id_vehiculo === 0) {
            const dialogRef = this.dialog.open(DialogConfirmComponent, {
                width: '400px',
                data: {body: `¿Desea eliminar el dispositivo ${dispositivo.imei}?`}
            });

            dialogRef.afterClosed().subscribe(result => {
                // Verificamos que no haya cancelado la operación
                if (result.cancel === false) {
                    const dialogRef2 = this.dialog.open(DialogConfirmComponent, {
                        width: '400px',
                        data: {body: `Advertencia, la siguiente acción es sumamente destructiva,
                                    eliminará todos los datos relacionado a este imei como: chat de consola,
                                    historial de datos sin procesar, configuraciones y eliminado en todos los usuarios.
                                    ¿Está seguro que quiere eliminar?`}
                    });
                    dialogRef2.afterClosed().subscribe(result => {
                        // Verificamos que no haya cancelado la operación
                        if (result.cancel === false) {
                            console.log('aceptar eliminar: ');
                            this.restService.eliminarDispositivo(dispositivo).subscribe((res) => {
                                console.log('respueta de eliminado: ', res);
                                if (res['affectedRows'] === 1) {
                                    this.dialog.open(DialogConfirmComponent, {
                                        width: '400px',
                                        data: {body: `Dispositivo eliminado con exito`}
                                    });
                                } else {
                                    this.dialog.open(DialogConfirmComponent, {
                                        width: '400px',
                                        data: {body: `Error al eliminar el dispositivo`}
                                    });
                                }
                            }, (err) => {
                                console.log('error', err);
                            });
                        } else {
                            console.log(' se ha cancelado eliminacion');
                        }
                    });
                } else {
                    console.log(' se ha cancelado eliminacion');
                }
            });
        } else {
            this.dialog.open(DialogConfirmComponent, {
                width: '400px',
                data: {body: `No se puede eliminar un dispositivo asociado, primero elimine el vehiculo.`}
            });
        }
    }

    dialogEditarNombreConfiguracionScript(event) {
        const dialogRef = this.dialog.open(DialogEditarDispositivoComponent, {
            width: '400px',
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
            // tslint:disable-next-line: no-string-literal
            if (result.ok) {
                // tslint:disable-next-line: no-string-literal
                this.openDialog('OK', 'Nombre de script actualizado exitosamente');
            } else {
                if (result.cancel) {

                } else {
                    this.openDialog('ERROR', 'No se pudo actualizar el nombre, intente luego.');
                }

            }
        });
    }

    eliminarfiguracionScript(event) {
        console.log(event);
        const dialogRef = this.dialog.open(DialogEtiquetaComponent, {
            maxWidth: '350px',
            data:  {
                title: 'Confirmar',
                body: '¿Desea eliminar la configuración de script?'
            }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            console.log(dialogResult);

            if (dialogResult) {

                this.restService.eliminarConfiguracionScript(event.cod_configuracion_eq).subscribe((data) => {
                console.log(data);
                this.openDialog('OK', 'Etiqueta Eliminado extisamente');

                // tslint:disable-next-line: max-line-length
                const index = this.dataSourceConfScript.data.findIndex( dato => dato['cod_configuracion_eq'] === event.cod_configuracion_eq );

                // tslint:disable-next-line: align
                if (index > -1) {
                    this.dataSourceConfScript.data.splice(index, 1);
                    this.dataSourceConfScript.data = this.dataSourceConfScript.data;
                    console.log('objeto eliminado');
                }

                }, (err) => {
                console.log(err);
                });
            } else {

            }
        });
    }

    /******************************mat select simple***************************************/
    seleccionUsuarioVehiculos(event) {
        // console.log(event.value);
        // console.log(this.grupoSeleccionadoVehiculo);
        this.grupoSeleccionadoVehiculo = event.value;
        this.dataValidoVehiculo = false;
    }

    obtenerGrupos() {
        this.restService.obtenerGrupos().subscribe((data) => {
            this.grupos.push(...data);
            this.llenarDatosGrupos(data);
        }, (error) => {
            console.log(error);
        });
    }

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosGrupos(data: any) {
        this.banksGrupos.push(...data);
        // despues llamamos al metodo matSelect
        this.matSelectGrupos();
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectGrupos() {
        this.filteredBanksGrupos.next(this.banksGrupos.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlGrupos.valueChanges.pipe(takeUntil(this._onDestroyGrupos)).subscribe(() => {
            this.filterBanksGrupos();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksGrupos() {
        //
        if (!this.banksGrupos) {
            return;
        }
        // get the search keyword
        let searchGrupos = this.bankFilterCtrlGrupos.value;
        if (!searchGrupos) {
            this.filteredBanksGrupos.next(this.banksGrupos.slice());
            return;
        } else {
            searchGrupos = searchGrupos.toLowerCase();
        }

        // tslint:disable-next-line: max-line-length
        this.filteredBanksGrupos.next(this.banksGrupos.filter(bankGrupos => bankGrupos.nombre_grupo.toLowerCase().indexOf(searchGrupos) > -1));
    }

    // cuarto:
    protected setInitialValueGrupos() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksGrupos.pipe(take(1), takeUntil(this._onDestroyGrupos)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectGrupos.compareWith = (a: any, b: any) => a && b &&  a.nombre_grupo === b.nombre_grupo;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    mostrarOcultarFormularioRegistroDispositivo(bool) {
        this.boolAgregarDispositivo = bool;
    }

    dispositivoSeleccionado(disp) {

        this.idConexion = disp.value.id_conexion;
        this.imeiSeleccionado2 = disp.value.imei;

        this.restService.obtenerDatosVehiculo(String(disp.value.imei)).subscribe((data) => {

            this.idConexion = data.id_conexion;

            }, (error) => {
            console.log(error);
        });
    }

    escucharSockets() {

        this.subWsMarcadorMover = this.wsService.listen('marcador-mover').subscribe((marcador: Device) => {
            if (String(this.imeiSeleccionado2) === String(marcador.imei)) {
                this.idConexion = marcador.id_conexion;
            }
        });


        this.subWsMarcadorSinReporte = this.wsService.listen('marcador-tiempo-sin-conexion').subscribe((marcador: Device) => {
            if (String(this.imeiSeleccionado2) === String(marcador.imei)) {
                this.idConexion = marcador.id_conexion;
            }
        });
    }

}


