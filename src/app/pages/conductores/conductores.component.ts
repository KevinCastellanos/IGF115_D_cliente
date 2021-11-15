import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Conductor } from 'src/app/interfaces/conductor';
import { MatDialog } from '@angular/material/dialog';
import { DialogEtiquetaComponent } from '../../components/dialog-etiqueta/dialog-etiqueta.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { takeUntil, take } from 'rxjs/operators';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogConfirmComponent } from 'src/app/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.css']
})
export class ConductoresComponent implements OnInit, AfterViewInit, OnDestroy {

    public modulos: any;
    public conductores: Conductor[] = [];
    public vehiculosDisponible: any[] = [];

    public searchText = '';
    public flipped = true;
    public conductor: Conductor = {};
    public vehiculoSeleccionadoC = {};
    public cardVisible = false;
    public cardVisibleConductor = false;

    // acciones de boton actualizar
    public datosValidos = false;
    public disableBtn = false;
    // -----------------------
    // acciones de boton eliminar
    public datosValidosEliminar = false;
    public disableBtnEliminar = false;
    // -----------------------

    // validacion de datos de un nuevo conductor
    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    public tercerFormGroup: FormGroup;

    public isEditable = true;

    /**************************************** SELECT CON FILTRO VEHICULOS ************************************************/
    /** datos crudos: lista de objetos */
    public banksDispositivo: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlDispositivo: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlDispositivo: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksDispositivo: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectDispositivo', { static: true }) singleSelectDispositivo: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyDispositivo = new Subject<void>();
    // valor seleccionado por defecto
    public valor = {
        nombre: 'GXX 8588'
    };
    /**************************************** SELECT CON FILTRO VEHICULO ************************************************/

    /**************************************** SELECT CON FILTRO USUARIOS2 ************************************************/
    /** datos crudos: lista de objetos */
    public banksVehiculos: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlVehiculos: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlVehiculos: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksVehiculos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    /** selección única */
    @ViewChild('singleSelectVehiculos', { static: true }) singleSelectVehiculos: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyVehiculos = new Subject<void>();
    public vehiculoSeleccionado = {
        nombre: 'GRR 1993'
    };
    /**************************************** SELECT CON FILTRO USUARIOS2 ************************************************/

    public dataValidoVehiculo = true;
    public spinnerVehiculoRegistrar = false;
    public filteredCount = { count: 0 };

    public asociarDisp = false;

    constructor(public localStorageService: LocalStorageService,
                private restService: RestService,
                private dialog: MatDialog,
                private _formBuilder: FormBuilder) { }

    ngOnInit() {
        // this.bankCtrlDispositivo2.value.nombre = 'GLL 1609';

        this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            // console.log('modulos asignados: ');
            // console.log(data);
            this.modulos = data;
        }, (err) => {
            console.log(err);
        });

        this.obtenerConductores();
        this.validacionDatosRegistros();
        this.obtenerVehiculosAsignados();
    }

    // metodos utilzados en select con filtros
    ngAfterViewInit() {
        // this.setInitialValueVehiculos();
    }

    // metodos utilizados en select con filtro
    ngOnDestroy() {
        this._onDestroyDispositivo.next();
        this._onDestroyDispositivo.complete();

        this._onDestroyVehiculos.next();
        this._onDestroyVehiculos.complete();
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    conductorSeleccionado(conductor) {

        this.vehiculoSeleccionado = {
            nombre: '-'
        };
        this.vehiculoSeleccionadoC = {
            nombre: '-'
        };
        this.conductor.nombre_vehiculo = '';
        console.log('CONDUCTOR SELECCIONADO: ', conductor);
        this.cardVisible = true;
        this.cardVisibleConductor = false;

        this.conductor.nombre = conductor.nombre;
        this.conductor.apellido = '';
        this.conductor.id_conductor = conductor.id_conductor;
        this.conductor.pais = conductor.pais;
        this.conductor.estado = conductor.estado;
        this.conductor.direccion = conductor.direccion;
        this.conductor.tipo_sangre = conductor.tipo_sangre;
        this.conductor.telefono = conductor.telefono;
        this.conductor.correo = conductor.correo;
        this.conductor.contacto_emergencia = conductor.contacto_emergencia;
        this.conductor.licencia = conductor.licencia;
        this.conductor.tipo_licencia = conductor.tipo_licencia;

        this.vehiculoAsignadoAChofer(conductor.id_conductor);

        
        
    }

    // CRUD conductores
    obtenerConductores() {
        this.restService.obtenerConductores(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            console.log(data);
            this.conductores = data;
        }, (err) => {
            console.log(err);
        });
    }

    actualizarConductor() {
        this.datosValidos = true;
        this.disableBtn = true;

        this.restService.actualizarConductor(this.conductor).subscribe((resp) => {
            this.datosValidos = false;
            this.disableBtn = false;
            // console.log('respuesta del servidor: ', resp);
            const traduccion = this.localStorageService.traductorLocal('Conductor actualizado exitosamente');
            this.openDialog('OK', traduccion);
            // actualizamos los datos del arreglo de conductores
            const cond = this.conductores.find((c) => c.id_conductor === this.conductor.id_conductor);
            
            if (cond) {
                cond.nombre = this.conductor.nombre;
                cond.apellido = this.conductor.apellido;
                cond.pais = this.conductor.pais;
                cond.estado = this.conductor.estado;
                cond.direccion = this.conductor.direccion;
                cond.tipo_sangre = this.conductor.tipo_sangre;
                cond.telefono = this.conductor.telefono;
                cond.correo = this.conductor.correo;
                cond.contacto_emergencia = this.conductor.contacto_emergencia;
                cond.licencia = this.conductor.licencia;
                cond.tipo_licencia = this.conductor.tipo_licencia;
            }
        }, (err) => {
            console.log(err);

            const traduccion = this.localStorageService.traductorLocal('No se pudo realizar la operación, intente mas tarde');
            this.openDialog('OK', traduccion);
            // this.openDialog('ERROR', 'No se pudo realizar la operación, intente mas tarde');
        });
    }

    eliminarConductor() {
        this.datosValidosEliminar = true;
        this.disableBtnEliminar = true;

        // tslint:disable-next-line: max-line-length
        const traduccion = this.localStorageService.traductorLocal('¿Desea eliminar al conductor?, desasociar al vehículo el cual tenia asignado');
        const traduccionConfirmar = this.localStorageService.traductorLocal('Confirmar');

        const dialogRef = this.dialog.open(DialogEtiquetaComponent, {
            maxWidth: '350px',
            data:  {
                title: traduccionConfirmar,
                body: traduccion
            }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            console.log(dialogResult);

            if (dialogResult) {
                this.restService.eliminarConductor(this.conductor.id_conductor).subscribe((res) => {
                    this.datosValidos = false;
                    this.disableBtn = false;
                    // ocultamos la card visible
                    this.cardVisible = false;
                    

                    console.log('di conductor a eliminar: ', this.conductor.id_conductor);
                    console.log('conductores: ', this.conductores);
                    // eliminamos de la lista de conductores
                    const index = this.conductores.findIndex(con => con.id_conductor === this.conductor.id_conductor);

                    if (index > -1) {
                        this.conductores.splice(index, 1);
                        console.log('hay conductor para eliminar: ', index);
                    } else {
                        console.log('No encontro conductor para eliminar');
                    }

                    // traducimos el texto de español a ingles
                    const traduccion = this.localStorageService.traductorLocal('Conductor eliminado correctamente');
                    this.openDialog('OK', traduccion);

                    // this.openDialog('OK', 'Conductor eliminado');

                    // vaciamos el conductor
                    this.conductor = {};
                }, (err) => {
                    console.log(err);
                });
            } else {
                this.datosValidos = false;
                this.disableBtn = false;
            }
        });
    }
    // Fin CRUD conductores

    cardVisibleCrearConductor() {
        this.cardVisible = false;
        this.cardVisibleConductor = true;
        
    }

    ocultarCardCrearConductor() {
        this.cardVisibleConductor = false;
    }

    validacionDatosRegistros() {
        // definimos los parametro del primer form group
        this.firstFormGroup = this._formBuilder.group({
            nombreCtrl: ['', Validators.required],
            paisCtrl: [''],
            estadotCtrl: [''],
            direcciontCtrl: [''],
            tipoSangretCtrl: ['']
        });

        // definimos los parametros del segundo form group
        this.secondFormGroup = this._formBuilder.group({
            telefonoCtrl: ['', Validators.required],
            correoCtrl: [''],
            contactoCtrl: ['']
        });

        // definimos los parametros del tercer form group
        this.tercerFormGroup = this._formBuilder.group({
            licenciaCtrl: [''],
            tipoLicenciaCtrl: ['']
        });
    }

    guardarConductor(stepper) {
        this.dataValidoVehiculo = true;
        this.spinnerVehiculoRegistrar = true;
        // console.log(this.firstFormGroup.value);
        // console.log(this.secondFormGroup.value);
        // console.log(this.tercerFormGroup.value);
        // console.log(this.bankCtrlDispositivo.value);

        let idDips = 0;
        if (this.bankCtrlDispositivo.value) {
            console.log('se ha seleccionado vehiculo');
            idDips = this.bankCtrlDispositivo.value.id_dispositivo;
        } else {
            console.log('sin seleccionar vehiculos');
            idDips = 0;
        }

        const infoConductor = {
            nombre: this.firstFormGroup.value.nombreCtrl,
            pais: this.firstFormGroup.value.paisCtrl,
            estado: this.firstFormGroup.value.estadotCtrl,
            direccion: this.firstFormGroup.value.direcciontCtrl,
            tipo_sangre: this.firstFormGroup.value.tipoSangretCtrl,
            telefono: this.secondFormGroup.value.telefonoCtrl,
            correo: this.secondFormGroup.value.correoCtrl,
            contacto_emergencia: this.secondFormGroup.value.contactoCtrl,
            id_dispositivo: idDips,
            id_usuario: this.localStorageService.usuario.usuario.id_usuario,
            tipo_licencia: this.tercerFormGroup.value.tipoLicenciaCtrl,
            licencia: this.tercerFormGroup.value.licenciaCtrl
        };

        console.log('conductor: ', infoConductor);

        this.restService.crearConductor(infoConductor).subscribe((res) => {
            console.log(res);
            // traducimos el texto de español a ingles
            const traduccion = this.localStorageService.traductorLocal('Conductor registrado exitosamente');
            this.openDialog('OK', traduccion);

            // this.openDialog('OK', 'Conductor registrado exitosamente');
            
            this.dataValidoVehiculo = true;
            this.spinnerVehiculoRegistrar = true;
            const c: Conductor = {
                id_conductor: res['insertId'],
                nombre: this.firstFormGroup.value.nombreCtrl,
                pais: this.firstFormGroup.value.paisCtrl,
                estado: this.firstFormGroup.value.estadotCtrl,
                direccion: this.firstFormGroup.value.direcciontCtrl,
                tipo_sangre: this.firstFormGroup.value.tipoSangretCtrl,
                telefono: this.secondFormGroup.value.telefonoCtrl,
                correo: this.secondFormGroup.value.correoCtrl,
                contacto_emergencia: this.secondFormGroup.value.contactoCtrl,
                id_dispositivo: idDips,
                id_usuario: this.localStorageService.usuario.usuario.id_usuario,
                tipo_licencia: this.tercerFormGroup.value.tipoLicenciaCtrl,
                licencia: this.tercerFormGroup.value.licenciaCtrl
            };

            this.conductores.push(c);
            // limpiar slelect con filtros
            event.stopPropagation(); // <-- stop event propagation
            this.bankCtrlDispositivo.reset(); // <-- brackets () were missing
            stepper.reset();

        }, (err) => {
            console.log(err);
        });
    }

    obtenerVehiculosAsignados() {
        this.vehiculosDisponible = [];
        // tslint:disable-next-line: max-line-length
        this.restService.obtenerVehiculosPorUsuarios(this.localStorageService.usuario.usuario.grupos).subscribe((data) => {
            // console.log('vehiculos con conductor------obtenidos : ', data);
            
            for (const vehiculo of data) {
                if (vehiculo.id_conductor === 0 || vehiculo.id_conductor === null) {
                    // console.log('disponible');
                    // this.vehiculosDisponible.push(vehiculo);
                    this.llenarDatosDispositivos(vehiculo);
                    this.llenarDatosVehiculos(vehiculo);

                } else {
                    console.log('no disponible');
                }
            }
            // console.log(this.banksDispositivo);
            // this.setInitialValueVehiculos();
            this.matSelectDispositivo();
            this.matSelectVehiculos();

        }, (err) => {
            console.log(err);
        });
    }

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosDispositivos(data: any) {
        this.banksDispositivo.push(data);
        // despues llamamos al metodo matSelect 
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectDispositivo() {
        this.filteredBanksDispositivo.next(this.banksDispositivo.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlDispositivo.valueChanges.pipe(takeUntil(this._onDestroyDispositivo)).subscribe(() => {
            this.filterBanksDispositivo();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksDispositivo() {
        //
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

        // tslint:disable-next-line: max-line-length
        this.filteredBanksDispositivo.next(this.banksDispositivo.filter(bankDispositivo => bankDispositivo.nombre.toLowerCase().indexOf(searchDispositivo) > -1));
    }

    // cuarto:
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
    /*************************************** Métodos de select con filtro ********************************************/

    /*************************************** Métodos de select con filtro ********************************************/

    validarVehiculoSeleccionado(vehiculo) {
        console.log('vehiculo seleccionado: ', vehiculo);
        this.dataValidoVehiculo = false;
    }

    openDialog(title: string, body: string) {

        const dialogRef = this.dialog.open(DialogComponent, {
            width: '300px',
            data: {
                title,
                body
            }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);
        });
    }

    vehiculoAsignadoAChofer(id_conductor) {
        const vehiculoChofer = this.localStorageService.vehiculos.find((disp) => disp.id_conductor === id_conductor);
        if (vehiculoChofer) {
            console.log('vehiculo qe tiene el cionductor: ', vehiculoChofer);
            this.conductor.nombre_vehiculo = vehiculoChofer.nombre;
            this.vehiculoSeleccionadoC = vehiculoChofer;
        }
    }

    cambiarIdioma(idioma) {
        console.log(idioma);
        this.localStorageService.usuario.usuario.idioma = idioma;
        this.localStorageService.guardarStorage(this.localStorageService.usuario);
        // tslint:disable-next-line: max-line-length
        this.restService.cambiarIdioma(this.localStorageService.usuario.usuario.id_usuario, idioma).subscribe((res) => {
            console.log(res);
            window.location.reload();
        }, (err) => {
            console.log(err);
        });
    }

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosVehiculos(data: any) {
        // console.log('vehiculos: ', data);
        this.banksVehiculos.push(data);
        // despues llamamos al metodo matSelect
        
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectVehiculos() {
        this.filteredBanksVehiculos.next(this.banksVehiculos.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlVehiculos.valueChanges.pipe(takeUntil(this._onDestroyVehiculos)).subscribe(() => {
            this.filterBanksVehiculos();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksVehiculos() {
        //
        if (!this.banksVehiculos) {
            return;
        }
        // get the search keyword
        let searchVehiculos = this.bankFilterCtrlVehiculos.value;

        if (!searchVehiculos) {
            this.filteredBanksVehiculos.next(this.banksVehiculos.slice());
            return;
        } else {
            searchVehiculos = searchVehiculos.toLowerCase();
        }
        // tslint:disable-next-line: max-line-length
        // console.log('filtro por parametros: ', this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.usuario.toLowerCase().indexOf(searchUsuarios2) > -1).length );

        if (this.banksVehiculos.filter(bankVehiculo => bankVehiculo.nombre.toLowerCase().indexOf(searchVehiculos) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
            this.filteredBanksVehiculos.next(this.banksVehiculos.filter(bankVehiculo => bankVehiculo.nombre.toLowerCase().indexOf(searchVehiculos) > -1));
        }


    }

    // cuarto:
    protected setInitialValueVehiculos() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksVehiculos.pipe(take(1), takeUntil(this._onDestroyVehiculos)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectVehiculos.compareWith = (a: any, b: any) => a && b &&  a.nombre === b.nombre;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    desasociarVehiculoConductor() {
        // console.log('vehiculo del consutor: ', this.vehiculoSeleccionadoC['id_dispositivo']);
        // console.log('conductor al cual se le    quitara el vehiculo: ', this.conductor.id_conductor);

        const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '400px',
            data: {body: 'Do you want to disassociate the vehicle from the driver?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                // console.log('es verdadero para eliminar');
                // tslint:disable-next-line: max-line-length
                this.restService.desasociarVehiculoDelConductor(this.vehiculoSeleccionadoC['id_dispositivo'], this.conductor.id_conductor).subscribe((res) => {
                    // console.log('vehiculo eliminado: ', res);
                    this.openDialog('OK', 'Successful disassociation');
                    this.conductor.nombre_vehiculo = '-';
                    // tslint:disable-next-line: max-line-length
                    const disp = this.localStorageService.vehiculos.find((c) => c.id_dispositivo === this.vehiculoSeleccionadoC['id_dispositivo']);
                    if (disp) {
                        // console.log('******SE ACTUALIZO EL ID DEL CONDUCTOR DE VEHICULO ******');
                        disp.id_conductor = 0;

                        this.localStorageService.guardarVehiculos(this.localStorageService.vehiculos);
                    }
                }, (err) => {
                    // console.log(err);
                    this.openDialog('ERROR', 'The operation could not be performed');
                });
            } else {
                console.log(' se ha cancelado eliminacion');
            }
        });
    }

    nuevoVehiculoAsociado(disp) {
        // console.log('nuevo vehiculo a asociar', disp.id_dispositivo);
        // console.log();
        // console.log('conductor al cual se le asociara el vehiculo: ', this.conductor.id_conductor);

        const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '400px',
            data: {body: 'Do you want to associate the vehicle with the driver?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                // console.log('es verdadero para asociar');
                // tslint:disable-next-line: max-line-length
                this.restService.asociarVehiculoDelConductor(disp.id_dispositivo, this.conductor.id_conductor).subscribe((res) => {
                    // console.log('vehiculo asociado: ', res);
                    this.openDialog('OK', 'Vehicle successfully associated');
                    this.conductor.nombre_vehiculo = disp.nombre;
                    
                    // actualizamos la info del localstorage
                    const disp1 = this.localStorageService.vehiculos.find((c) => c.id_dispositivo === disp.id_dispositivo);
                    if (disp1) {
                        // console.log('******SE ACTUALIZO EL ID DEL CONDUCTOR DE VEHICULO PARA ASOCIAR ******');
                        disp1.id_conductor = this.conductor.id_conductor;
                        console.log(this.localStorageService.vehiculos);
                        this.localStorageService.guardarVehiculos(this.localStorageService.vehiculos);
                    }
                }, (err) => {
                    // console.log(err);
                    this.openDialog('ERROR', 'The operation could not be performed');
                });
            } else {
                console.log(' se ha cancelado asignacion');
            }
        });
    }
}
