import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../../services/rest.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Modulo } from 'src/app/interfaces/modulo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoVisibilidad } from '../../interfaces/vehiculoVisibilidad';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogEditarGrupoComponent } from '../../components/dialog-editar-grupo/dialog-editar-grupo.component';
import { ColeccionVisibilidad } from '../../interfaces/coleccionVisibilidad';
import { DialogEditarUsuarioComponent } from '../../components/dialog-editar-usuario/dialog-editar-usuario.component';
import { DialogConfirmComponent } from '../../components/dialog-confirm/dialog-confirm.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { ISO_3166_1_CODES } from 'src/app/data/codigoCiudades';
import { PhoneErrorMatcher, phoneValidator } from 'src/app/classes/Phone';
import PhoneNumber from 'awesome-phonenumber';
import PhoneNumber2 from 'awesome-phonenumber';

export interface ElementGrupo {
    id_grupo?: number;
    nombre_grupo?: string;
    cantidad_vehiculo?: number;
    status?: number;
}

export interface ElementUser {
    id_grupo?: number;
    nombre_grupo?: string;
    cantidad_vehiculo?: number;
    status?: number;
    id_usuario?: number;
    usuario?: string;
    password?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    telefonos?: any[];
    root?: number;
}

const ELEMENT_DATA: ElementGrupo[] = [];
const ELEMENT_DATA_USER: ElementGrupo[] = [];
const ELEMENT_DATA_VEHICLE: VehiculoVisibilidad[] = [];
const ELEMENT_DATA_VEHICLER: any[] = [];
const ELEMENT_DATA_COLECCION: ColeccionVisibilidad[] = [];



@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit, AfterViewInit, OnDestroy {

    idMaster = 1;
    idGrupo = 0;
    idUsuario = 0;
    nombGrupo = '';
    nombAdmin = '';
    nombUsuario = '';
    nomVehiculo = '';
    listaGrupo: any;
    listaUsuario: any;
    listaVehiculos: any;
    public nombreCompania = '';
    public direccion = '';

    public modulos: Modulo[] = [];
    public vehiculos: any;

    // loader para tabla de grupos
    public isLoadingResults = true;
    public isLoadingResults2 = false;
    public isLoadingResultsR = false;

    // nombramos las columnas a mostrar en la tabla
    public displayedColumns: string[] = ['nombre_compania', 'nombre_grupo', 'direccion_1', 'cantidad_vehiculo', 'id_grupo'];
    // inicializamos la tabla
    public dataSource = new MatTableDataSource<ElementGrupo>(ELEMENT_DATA);
    // obtenemos la referencia a elemento del DOM
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // visibilidad de boton de registro
    public visible = 0;

    public nombreGrupo = '';

    // loader para tabla de grupos
    public isLoadingResultsUser = true;
    // nombramos las columnas a mostrar en la tabla
    public displayedColumnsUser: string[] = ['nombre_grupo', 'nombre', 'usuario', 'email', 'password', 'id_usuario', 'status'];
    // inicializamos la tabla
    public dataSourceUser = new MatTableDataSource<ElementUser>(ELEMENT_DATA_USER);
    // obtenemos la referencia a elemento del DOM
    @ViewChild('pagUser', {static: true}) paginatorUser: MatPaginator;
    // visibilidad de boton de registro
    public visibleUser = 0;

    public usuario: ElementUser = {
        id_grupo: 0,
        nombre_grupo: '',
        cantidad_vehiculo: 0,
        status: 0,
        id_usuario: 0,
        usuario: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        telefonos: [],
        root: 0
    };

    // datos de grupo seleccionado
    grupoSeleccionado: ElementGrupo;
    grupoSeleccionadoVehiculo: any;
    usuarioSeleccionado: any;
    usuarioSeleccionadoVehiculo: any;
    usuarioGruposeleccionado: any;
    grupoSeleccionadoGeocerca: any;

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

    /**************************************** SELECT CON FILTRO GRUPOS2 ************************************************/
    /** datos crudos: lista de objetos */
    public banksGrupos2: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlGrupos2: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlGrupos2: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksGrupos2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectGrupos2', { static: true }) singleSelectGrupos2: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyGrupos2 = new Subject<void>();
    /**************************************** SELECT CON FILTRO GRUPOS2 ************************************************/

    /**************************************** SELECT CON FILTRO GRUPOS3 ************************************************/
    /** datos crudos: lista de objetos */
    public banksGrupos3: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlGrupos3: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlGrupos3: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksGrupos3: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectGrupos3', { static: true }) singleSelectGrupos3: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyGrupos3 = new Subject<void>();
    /**************************************** SELECT CON FILTRO GRUPOS3 ************************************************/

    /**************************************** SELECT CON FILTRO USUARIOS ************************************************/
    /** datos crudos: lista de objetos */
    public banksUsuarios: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlUsuarios: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlUsuarios: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksUsuarios: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectUsuarios', { static: true }) singleSelectUsuarios: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyUsuarios = new Subject<void>();
    /**************************************** SELECT CON FILTRO USUARIOS ************************************************/

    /**************************************** SELECT CON FILTRO USUARIOS2 ************************************************/
    /** datos crudos: lista de objetos */
    public banksUsuarios2: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlUsuarios2: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlUsuarios2: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksUsuarios2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectUsuarios2', { static: true }) singleSelectUsuarios2: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyUsuarios2 = new Subject<void>();
    /**************************************** SELECT CON FILTRO USUARIOS2 ************************************************/

    // vehiculos
    displayedColumnsVehicle: string[] = ['select', 'nombre'];
    dataSourceVehicle = new MatTableDataSource<VehiculoVisibilidad>(ELEMENT_DATA_VEHICLE);
    selectionVehicle = new SelectionModel<VehiculoVisibilidad>(true, []);

    // vehiculos
    displayedColumnsVehicleR: string[] = ['select', 'nombre_grupo'];
    dataSourceVehicleR = new MatTableDataSource<any>(ELEMENT_DATA_VEHICLER);
    selectionVehicleR = new SelectionModel<any>(true, []);

    // Colecciones
    displayedColumnsColeccion: string[] = ['select', 'nombre'];
    dataSourceColeccion = new MatTableDataSource<ColeccionVisibilidad>([]);
    selectionColeccion = new SelectionModel<ColeccionVisibilidad>(true, []);

    // usuarios esclavos
    public displayedColumnsSubUsuarios: string[] = ['select', 'nombre'];
    public dataSourceSubUsuario = new MatTableDataSource<any>([]);
    public selectionSubUsuario = new SelectionModel<any>(true, []);

    // drag and drop
    public todo = [];

    public done = [];

    public todo2 = [];

    public done2 = [];

    public spinnerDrop1 = 0;
    public spinnerDrop2 = 0;

    public searchText = '';
    public searchText2 = '';

    public searchText3 = '';
    public searchText4 = '';

    /**************************************** SELECT CON FILTRO USUARIOS 3 ************************************************/
    /** datos crudos: lista de objetos */
    public banksUsuarios3: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlUsuarios3: FormControl = new FormControl();
    /** control para la palabra clave de filtro Mat Select */
    public bankFilterCtrlUsuarios3: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksUsuarios3: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** selección única */
    @ViewChild('singleSelectUsuarios3', { static: true }) singleSelectUsuarios3: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyUsuarios3 = new Subject<void>();
    /**************************************** SELECT CON FILTRO USUARIOS 3 ************************************************/

    public orden: number[] = [0];
    public usuarioActivado = true;

    /***************************************/
    // TELEFONO 1
    countyCodes = ISO_3166_1_CODES;
    profileForm = this.fb.group({
        phone: this.fb.group({
            country: ['SV'],
            number: ['']
        }, {validators: phoneValidator})
    });
    phoneErrorMatcher = new PhoneErrorMatcher();
    /***************************************/

    constructor(private restService: RestService,
                public localStorageService: LocalStorageService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar,
                private fb: FormBuilder) {

    }

    ngOnInit() {

            // ingregar la data en el paginator
            this.dataSource.paginator = this.paginator;
            this.dataSourceUser.paginator = this.paginatorUser;

            this.getGrupo();
            this.getUsuario();
            this. getVehiculo();

            this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
                console.log('modulos asignados: ');
                console.log(data);
                // tslint:disable-next-line: forin
                for (let i in data) {
                    data[i].activo = false;
                    this.modulos.push(data[i]);
                }

            }, (err) => {
                console.log(err);
            });
    }

    // metodos utilzados en select con filtros
    ngAfterViewInit() {
        this.setInitialValueGrupos();
        this.setInitialValueGrupos2();
        this.setInitialValueGrupos3();

        this.setInitialValueUsuarios();
        this.setInitialValueUsuarios2();
        this.setInitialValueUsuarios3();
    }

    // metodos utilizados en select con filtro
    ngOnDestroy() {
        this._onDestroyGrupos.next();
        this._onDestroyGrupos.complete();

        this._onDestroyGrupos2.next();
        this._onDestroyGrupos2.complete();

        this._onDestroyGrupos3.next();
        this._onDestroyGrupos3.complete();

        this._onDestroyUsuarios.next();
        this._onDestroyUsuarios.complete();

        this._onDestroyUsuarios2.next();
        this._onDestroyUsuarios2.complete();

        this._onDestroyUsuarios3.next();
        this._onDestroyUsuarios3.complete();
    }

    crearGrupo() {
        // console.log('nombre grupo: ' + this.nombGrupo);
        // console.log('nombre admin: ' + this.nombAdmin);
        

        this.visible = 1;

        this.restService.crearGrupo(this.nombreGrupo, this.nombreCompania, this.direccion).subscribe((res) => {
            console.log(res);
            this.visible = 0;
            this.openDialog('OK', 'Grupo guardado exitosamente');

            // insertamos el nuevo registro en la tabla
            const nuevoGrupo = {
                id_grupo: res['insertId'],
                nombre_compania: this.nombreCompania,
                nombre_grupo: this.nombreGrupo,
                cantidad_vehiculo: 0,
                status: 1,
                logo: null,
                email: null,
                pais: null,
                ciudad: null,
                direccion_1: this.direccion,
                direccion_2: null,
                fecha_creado: null,
                fecha_actualizado: null,
            };

            // Actualizamos la tabla
            this.dataSource.data.push(nuevoGrupo);
            this.dataSource.data = this.dataSource.data;

            // limpiamos el formulario cuando se haya registrado un usuario
            this.nombreCompania = '';
            this.nombreGrupo = '';
            this.direccion = '';
        }, (err) => {
            console.log(err);
            this.openDialog('ERROR', 'Error al guardar el grupo');
        });
    }

    getGrupo() {

        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            // console.log(data);
            this.dataSource.data = [];
            this.dataSource.data.push(...data);
            this.dataSource.data = this.dataSource.data;
            this.isLoadingResults = false;
            this.llenarDatosGrupos(data);
            this.llenarDatosGrupos2(data);
            this.llenarDatosGrupos3(data);
        }, (err) => {
            console.log(err);
        });
    }

    selectChangeHandler(event: any) {
        // update the ui
        console.log(event.target.value);
        this.idGrupo = Number(event.target.value);
    }

    crearUsuario() {

        this.visibleUser = 1;
        if (this.bankCtrlGrupos.value) {
            this.usuario.id_grupo = this.bankCtrlGrupos.value.id_grupo;
        } else {
            this.usuario.id_grupo = 0;
        }

        this.usuario.telefonos = this.obtenerNunmero();

        console.log('usuario: ', this.usuario);

        this.restService.crearUsuario(this.usuario).subscribe((res) => {
            console.log(res);

            switch(res['codigo']) {
                case 1:
                    this.openDialog('OK', 'Usuario creado exitosamente');
                    this.visibleUser = 0;

                    // limpiar formulario de usuario
                    this.usuario.id_grupo = 0;
                    this.usuario.nombre_grupo = '';
                    this.usuario.cantidad_vehiculo = 0;
                    this.usuario.status = 0;
                    this.usuario.id_usuario = 0;
                    this.usuario.usuario = '';
                    this.usuario.password = '';
                    this.usuario.nombre = '';
                    this.usuario.apellido = '';
                    this.usuario.email = '';
                    // this.usuario.telefono = '';
                    this.usuario.root = 0;

                    // limpiamos la referencia del grupos seleccionado para que
                    // quede vacia despues de guardar los datos
                    this.grupoSeleccionado = undefined;
                    break;
                case 2:
                    this.openDialog('Error', res['mensaje']);
                    this.visibleUser = 0;
                    break;
                case 3:
                    this.openDialog('Error', res['mensaje']);
                    this.visibleUser = 0;
                    break;    
            }
            
        }, (err) => {
            console.log(err);
            this.openDialog('ERROR', 'huvo un erro con el servidor');
            this.visibleUser = 0;
        });
    }

    getUsuario() {

        this.restService.obtenerUsuarios().subscribe((data) => {
            // console.log('USUARIOS', data);
            this.llenarDatosUsuarios(data);
            this.llenarDatosUsuarios2(data);
            this.llenarDatosUsuarios3(data);
            // this.listaUsuario = data;
            this.dataSourceUser.data = [];
            
            for (let i in data) {
                if (data[i].status === 1) {
                    data[i].status = true;
                    this.dataSourceUser.data.push(data[i]);
                } else {
                    data[i].status = false;
                    this.dataSourceUser.data.push(data[i]);
                }
                
            }
            this.dataSourceUser.data = this.dataSourceUser.data;
            this.isLoadingResultsUser = false;
        }, (err) => {
            console.log(err);
        });
    }

    selectChangeHandler2(event: any) {
        // update the ui
        console.log(event.target.value);
        this.idUsuario = Number(event.target.value);
    }

    crearVehiculo() {

        this.restService.crearVehiculo(this.idGrupo, this.idUsuario, this.nomVehiculo).subscribe((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    }

    getVehiculo() {
        this.restService.obtenerVehiculos().subscribe((data) => {
            console.log(data);
            this.listaVehiculos = data;
        }, (err) => {
            console.log(err);
        });
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    applyFilterGrupos(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterUsuarios(filterValue: string) {
        this.dataSourceUser.filter = filterValue.trim().toLowerCase();
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

    seleccionUsuario(event) {
        this.usuarioActivado = true;
        // console.log('usuario seleccionado:', event.value);
        this.usuarioSeleccionado = event.value;
        this.restService.obtenerModuloUsuarioAsignado(event.value.id_usuario).subscribe((data) => {
            console.log('modulos asociado al usuario', data);
            // tslint:disable-next-line: forin
            this.usuarioActivado = false; 
            for (let i in this.modulos) {
                this.modulos[i].activo = false;

                const result = data.find( modulo => modulo.id_modulo === this.modulos[i].id_modulo );

                if (result !== undefined) {
                    console.log('tiene modulo asignado:',  result);
                    this.modulos[i].activo = true;
                } else {
                    this.modulos[i].activo = false;
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    cambiarEstatusModulo(modulo, event) {

        // cambiar el valor en el arreglo
        const result = this.modulos.find( mod => mod.id_modulo === modulo.id_modulo );
    
        result.activo = event.checked;

        console.log(event.checked);
        console.log('-: ', modulo.id_modulo);
        console.log('user ', this.usuarioSeleccionado.id_usuario);

        if (event.checked === true) {

            this.orden.push((this.orden.length -1) + 1);
            result.orden = (this.orden.length -1);
            result.des = '#';

            if (this.usuarioSeleccionado.id_usuario !== undefined) {
                // si es verdadero, agregamos el modulo al usuario
                this.restService.agregarModuloUsuario(this.usuarioSeleccionado.id_usuario, modulo.id_modulo).subscribe((res) => {
                    console.log(res);
                    this.openSnackBar('Módulo agregado al usuario', 'ok');
                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            }

        } else {
            if (this.usuarioSeleccionado.id_usuario !== undefined) {
                this.orden.pop();
                result.orden = Number('');
                result.des = '';
                if (this.orden.length === 0) {
                    this.orden.push(0);
                }
                // si es falso, eliminamos el modulo al usuario
                this.restService.quitarModuloUsuario(this.usuarioSeleccionado.id_usuario, modulo.id_modulo).subscribe((res) => {
                    console.log(res);
                    this.openSnackBar('Módulo eliminado al usuario', 'ok');
                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            }
            
        }
    }

    openSnackBar(mensaje: any, action: string) {
        this._snackBar.open(mensaje, action, {
          duration: 3000,
        });
    }

    seleccionUsuarioVehiculos(event) {

        this.todo = [];
        this.done = [];
        this.isLoadingResults2 = true;
        this.spinnerDrop1 = 1;
        this.selectionVehicle.clear();

        // console.log('usuario seleccionado para vehiculos:', event.value);

        this.usuarioSeleccionadoVehiculo = event.value;

        this.restService.obtenerImeis().subscribe((data) => {
            // console.log('dispositivos', data);
            // llenar de data el objeto de vehiculos
            this.dataSourceVehicle.data = [];
            this.dataSourceVehicle.data.push(...data);
            this.dataSourceVehicle.data = this.dataSourceVehicle.data;


            // evaluamos cuales vehiculos tiene asignados
            this.restService.obtenerDispositivosUsuario(event.value.id_grupo).subscribe((data2) => {

                // console.log(data2);

                // tslint:disable-next-line: forin
                for (let i in this.dataSourceVehicle.data) {
                    const result = data2.find( dat => dat.id_dispositivo === this.dataSourceVehicle.data[i].id_dispositivo );

                    if (result !== undefined) {
                        // console.log('tiene vehiculo asisnado');
                        this.selectionVehicle.select(this.dataSourceVehicle.data[i]);

                        //insertamos objeto a done
                        this.done.push(String(this.dataSourceVehicle.data[i].nombre));
                    } else {
                        // insertamos objetos a todo
                        // console.log('no tiene vehiculo asignado');
                        this.todo.push(String(this.dataSourceVehicle.data[i].nombre));
                    }
                }
                this.spinnerDrop1 = 0;
                this.isLoadingResults2 = false;
                // console.log('VEHICULOS SELECCIONADO: ', this.selectionVehicle.selected);

                // actualizar en la base local la info de grupos asignados

            }, (err) => {
                console.log(err);
            });

        }, (error) => {
            console.log(error);
        });
    }

    seleccionUsuarioGrupo(event) {

        this.todo2 = [];
        this.done2 = [];

        this.isLoadingResultsR = true;
        this.spinnerDrop2 = 1;
 
        this.selectionVehicleR.clear();

        console.log('grupo seleccionado para vehiculos:', event.value);

        this.usuarioGruposeleccionado = event.value;

        this.restService.obtenerGrupos().subscribe((data) => {

            // console.log('dispositivos', data);

            // llenar de data el objeto de vehiculos
            this.dataSourceVehicleR.data = [];
            this.dataSourceVehicleR.data.push(...data);
            this.dataSourceVehicleR.data = this.dataSourceVehicleR.data;


            // evaluamos cuales vehiculos tiene asignados
            this.restService.obtenerGrupoUsuario(event.value.id_usuario).subscribe((data2) => {

                console.log(data2);

                // tslint:disable-next-line: forin
                for (let i in this.dataSourceVehicleR.data) {
                    const result = data2.find( dat => dat.id_grupo === this.dataSourceVehicleR.data[i].id_grupo );

                    if (result !== undefined) {
                        console.log('tiene vehiculo asisnado');
                        this.selectionVehicleR.select(this.dataSourceVehicleR.data[i]);
                        this.done2.push(String(this.dataSourceVehicleR.data[i].nombre_grupo));
                    } else {
                        console.log('no tiene vehiculo asignado');
                        this.todo2.push(String(this.dataSourceVehicleR.data[i].nombre_grupo));
                    }
                }
                this.spinnerDrop2 = 0;
                this.isLoadingResultsR = false;
                
                // console.log('VEHICULOS SELECCIONADO: ', this.selectionVehicleR.selected);
            }, (err) => {
                console.log(err);
            });

        }, (error) => {
            console.log(error); 
        });
    }

    seleccionGrupo(event) {
        this.selectionColeccion.clear();
        console.log('grupo seleccionado para coleccion:', event.value.id_grupo);
        this.grupoSeleccionadoGeocerca = event.value;

        this.restService.obtenerColecciones().subscribe((data) => {
            // console.log('vehiculos asignados: ');
            console.log(data);

            // llenar de data el objeto de vehiculos
            this.dataSourceColeccion.data = [];
            this.dataSourceColeccion.data.push(...data);
            this.dataSourceColeccion.data = this.dataSourceColeccion.data;

            this.restService.obtenerColeccionGrupo(event.value.id_grupo).subscribe((data2) => {
                console.log(data2);
                // tslint:disable-next-line: forin
                for (let i in this.dataSourceColeccion.data) {
                    // tslint:disable-next-line: max-line-length
                    const result = data2.find( dat => dat.id_coleccion_geocerca === this.dataSourceColeccion.data[i].id_coleccion_geocerca );

                    if (result !== undefined) {
                        console.log('tiene coleccion asisnado');
                        this.selectionColeccion.select(this.dataSourceColeccion.data[i]);
                    } else {
                        console.log('no tiene coleccion asignado');
                    }
                }
                // console.log('VEHICULOS SELECCIONADO: ', this.selectionVehicle.selected);
            }, (err) => {
                console.log(err);
            });

        }, (err) => {
            console.log(err);
        });
    }

    applyFilterVehicle(filterValue: string) {
        this.dataSourceVehicle.filter = filterValue.trim().toLowerCase();
    }

    applyFilterColecciones(filterValue: string) {
        this.dataSourceColeccion.filter = filterValue.trim().toLocaleUpperCase();
    }

    applyFilterSubUsuario(filterValue) {
        this.dataSourceSubUsuario.filter = filterValue.trim().toLocaleUpperCase();
    }

    isAllSelected() {

        const numSelected = this.selectionVehicle.selected.length;
        const numRows = this.dataSourceVehicle.data.length;
        return numSelected === numRows;
    }

    isAllSelectedColecciones() {

        const numSelected = this.selectionColeccion.selected.length;
        const numRows = this.dataSourceColeccion.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
        this.selectionVehicle.clear() :
        this.dataSourceVehicle.data.forEach(row => this.selectionVehicle.select(row));
    }
 
    masterToggleColecciones() {
        this.isAllSelectedColecciones() ?
        this.selectionColeccion.clear() :
        this.dataSourceColeccion.data.forEach(row => this.selectionColeccion.select(row));
    }

    asignarEliminarVehiculoAUsuario(event, row) {
        // console.log('EVENT: ', event);
        // console.log('DATA ', row);
        // console.log('user ', this.usuarioSeleccionadoVehiculo.id_grupo);

        if (event.checked === true) {
            // significa que agregó un vehiculo a un usuario
            this.restService.agregarVehiculoUsuario(this.usuarioSeleccionadoVehiculo.id_grupo, row.id_dispositivo).subscribe((res) => {

                // evaluamos que este definido
                if (res[0] === undefined) {
                    this.openSnackBar('vehículo agregado al grupo', 'ok');
                    // console.log(res);
                } else {
                    console.log(res);
                    this.openDialog('ERROR', `El vehiculo ${row.nombre}
                                    ya esta asignado al grupo ${res[0].nombre_grupo}`);
                }

            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });
        } else {
            // significa que elñimino un vehiculo a un usuario
            this.restService.quitarVehiculoUsuario(this.usuarioSeleccionadoVehiculo.id_grupo, row.id_dispositivo).subscribe((res) => {
                // console.log(res);
                this.openSnackBar('vehículo eliminado del usuario', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });

        }
    }

    asignarEliminarGruposAUsuario(event, row) {
        // console.log('EVENT: ', event);
        // console.log('DATA ', row);
        // console.log('user ', this.usuarioGruposeleccionado.id_usuario);
        // console.log('CANTIDAD DE GRUPOS AGREGADO A USUARIO: ', this.selectionVehicleR.selected);

        if (event.checked === true) {
            // significa que agregó un vehiculo a un usuario
            this.restService.agregarGrupoUsuario(row.id_grupo, this.usuarioGruposeleccionado.id_usuario ).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Grupo agregado al usuario', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });
        } else {
            // significa que elñimino un vehiculo a un usuario
            this.restService.quitarGrupoUsuario(row.id_grupo, this.usuarioGruposeleccionado.id_usuario).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Grupo eliminado del usuario', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });

        }
    }

    asignarEliminarColeccionAGrupo(event, row) {
        console.log('EVENT: ', event);
        console.log('DATA ', row);
        console.log('user ', this.grupoSeleccionadoGeocerca.id_grupo);

        if (event.checked === true) {
            // significa que agregó un vehiculo a un usuario
            this.restService.agregarColeccionGrupo(this.grupoSeleccionadoGeocerca.id_grupo, row.id_coleccion_geocerca).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Colección agregada al grupo', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });
        } else {
            // significa que elñimino un vehiculo a un usuario
            this.restService.quitarColeccionGrupo(this.grupoSeleccionadoGeocerca.id_grupo, row.id_coleccion_geocerca).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Colección eliminada del grupo', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });

        }
    }

    dialogEditarGrupo(event) {
        console.log(event);
        // abrimos el modal
        const dialogRef = this.dialog.open(DialogEditarGrupoComponent, {
            width: '400px',
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.cancel !== true) {
                if (result.editado === true) {
                    this.openSnackBar('Grupo editado con exito', 'ok');
                } else {
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                }
            }
        });
    }

    dialogEditarUsuario(event) {
        console.log(event);
        // abrimos el modal
        const dialogRef = this.dialog.open(DialogEditarUsuarioComponent, {
            width: '500px',
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.cancel !== true) {
                if (result.editado === true) {
                    this.openSnackBar('Usuario editado con exito', 'ok');
                } else {
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                }
            }
        });
    }

    eliminarUsuario(data: any) {

        const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '400px',
            data: {body: `¿Desea eliminar el usuario ${data.nombre}?`}
        });

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                this.restService.eliminarUsuario(data).subscribe((res) => {
                    console.log(' se elimino usuario: ', res);
                    if (res['vehiculos'] !== undefined) {
                        if (res['vehiculos'] === true) {
                            this.openDialog('ERROR', 'El usuario no se puede eliminar porque tiene vehiculos asociado');
                        } else {

                        }
                    } else {
                        this.openDialog('OK', 'Usuario eliminado correctamente');
                    }

                }, (err) => {
                    console.log(err);
                    this.openDialog('ERROR', 'No se pudo eliminar el usuario');
                });
            } else {
                console.log(' se ha cancelado eliminacion');
            }
        });

    }


    /*********  metodos de drag and drop ********/
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }

    dblclickMove(itemName: any, ...targets: string[]) {
        // console.log('uno:', itemName);
        // console.log('dos: ', targets[0]);
        // console.log('tres: ', targets[1]);

        if (targets[0] === 'done') {
            const result = this.dataSourceVehicle.data.find( dat => dat.nombre === itemName );
            if (result) {
                console.log('paso a un grupo');
                console.log('id dispositivo: ', result.id_dispositivo);
                console.log('id grupo', this.usuarioSeleccionadoVehiculo.id_grupo);
                // significa que agregó un vehiculo a un usuario
                // tslint:disable-next-line: max-line-length
                this.restService.agregarVehiculoUsuario(this.usuarioSeleccionadoVehiculo.id_grupo, result.id_dispositivo).subscribe((res) => {

                    // evaluamos que este definido
                    if (res[0] === undefined) {
                        this.openSnackBar('vehículo agregado al grupo', 'ok');
                        this[targets[0]] = [
                            ...this[targets[1]].splice(this[targets[1]].indexOf(itemName), 1),
                            ...this[targets[0]]
                            ];
                        this.searchText = '';
                        // console.log(res);
                    } else {
                        console.log(res);
                        this.openDialog('ERROR', `El vehiculo ${result.nombre}
                                        ya esta asignado al grupo ${res[0].nombre_grupo}`);
                    }

                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            } else {
                console.log('indefinido');
            }

        } else {
            const result = this.dataSourceVehicle.data.find( dat => dat.nombre === itemName );
            if (result) {
                console.log('se elimino del grupo');
                console.log('id dispositivo: ', result.id_dispositivo);
                console.log('id grupo', this.usuarioSeleccionadoVehiculo.id_grupo);

                // significa que elñimino un vehiculo a un usuario
                // tslint:disable-next-line: max-line-length
                this.restService.quitarVehiculoUsuario(this.usuarioSeleccionadoVehiculo.id_grupo, result.id_dispositivo).subscribe((res) => {
                    // console.log(res);
                    this.openSnackBar('vehículo eliminado del usuario', 'ok');
                    this[targets[0]] = [
                        ...this[targets[1]].splice(this[targets[1]].indexOf(itemName), 1),
                        ...this[targets[0]]
                        ];
                    this.searchText3 = '';
                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            }
        }
    }

    autodrop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }
    /*********  /metodos de drag and drop ********/
    /*********  metodos de drag and drop ********/
    drop2(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }

    dblclickMove2(itemName: any, ...targets: string[]) {
       //  console.log('uno:', itemName);
        // console.log('dos: ', targets[0]);
        // console.log('tres: ', targets[1]);

        if (targets[0] === 'done2') {
            const result = this.dataSourceVehicleR.data.find( dat => dat.nombre_grupo === itemName );
            if (result) {
                console.log('paso a un usuario');
                console.log('id grupo: ', result.id_grupo);
                console.log('id usuario', this.usuarioGruposeleccionado.id_usuario);
                // significa que agregó un vehiculo a un usuario
                // tslint:disable-next-line: max-line-length
                this.restService.agregarGrupoUsuario(result.id_grupo,  this.usuarioGruposeleccionado.id_usuario ).subscribe((res) => {

                    this.openSnackBar('Grupo agregado al usuario', 'ok');
                    this[targets[0]] = [
                        ...this[targets[1]].splice(this[targets[1]].indexOf(itemName), 1),
                        ...this[targets[0]]
                        ];

                    this.searchText2 = '';

                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            } else {
                console.log('indefinido');
            }

        } else {
            const result = this.dataSourceVehicleR.data.find(dat => dat.nombre_grupo === itemName );
            if (result) {
                console.log('se elimino del grupo');
                console.log('id grupo: ', result.id_grupo);
                console.log('id usuario', this.usuarioGruposeleccionado.id_usuario);

                // significa que elñimino un vehiculo a un usuario
                // tslint:disable-next-line: max-line-length
                this.restService.quitarGrupoUsuario(result.id_grupo,  this.usuarioGruposeleccionado.id_usuario ).subscribe((res) => {
                    // console.log(res);
                    this.openSnackBar('vehículo eliminado del usuario', 'ok');
                    this[targets[0]] = [
                        ...this[targets[1]].splice(this[targets[1]].indexOf(itemName), 1),
                        ...this[targets[0]]
                        ];

                    this.searchText4 = '';
                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            }
        }
    }

    autodrop2(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
    }
    /*********  /metodos de drag and drop ********/

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

    cambiarStatusUsuario(event, usuario) {
        console.log('cambiar status usuario: ', event.checked);
        console.log('usuario: ', usuario);
        let status = 1;
        if (event.checked) {
            status = 1;
        } else {
            status = 0;
        }

        this.restService.cambiarStatusUsuario(status, usuario.id_usuario).subscribe((data) => {
            this.openSnackBar('Status de usuario actualizado', 'ok');
        }, (err) => {
            console.log(err);
        });
    }

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosUsuarios(data: any) {
        this.banksUsuarios.push(...data);
        // despues llamamos al metodo matSelect
        this.matSelectUsuarios();
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectUsuarios() {
        this.filteredBanksUsuarios.next(this.banksUsuarios.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlUsuarios.valueChanges.pipe(takeUntil(this._onDestroyUsuarios)).subscribe(() => {
            this.filterBanksUsuarios();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksUsuarios() {
        //
        if (!this.banksUsuarios) {
            return;
        }
        // get the search keyword
        let searchUsuarios = this.bankFilterCtrlUsuarios.value;
        if (!searchUsuarios) {
            this.filteredBanksUsuarios.next(this.banksUsuarios.slice());
            return;
        } else {
            searchUsuarios = searchUsuarios.toLowerCase();
        }

        // tslint:disable-next-line: max-line-length
        this.filteredBanksUsuarios.next(this.banksUsuarios.filter(bankUsuarios => bankUsuarios.usuario.toLowerCase().indexOf(searchUsuarios) > -1));
    }

    // cuarto:
    protected setInitialValueUsuarios() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksUsuarios.pipe(take(1), takeUntil(this._onDestroyUsuarios)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectUsuarios.compareWith = (a: any, b: any) => a && b &&  a.usuario === b.usuario;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosGrupos2(data: any) {
        this.banksGrupos2.push(...data);
        // despues llamamos al metodo matSelect
        this.matSelectGrupos2();
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectGrupos2() {
        this.filteredBanksGrupos2.next(this.banksGrupos2.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlGrupos2.valueChanges.pipe(takeUntil(this._onDestroyGrupos2)).subscribe(() => {
            this.filterBanksGrupos2();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksGrupos2() {
        //
        if (!this.banksGrupos2) {
            return;
        }
        // get the search keyword
        let searchGrupos2 = this.bankFilterCtrlGrupos2.value;
        if (!searchGrupos2) {
            this.filteredBanksGrupos2.next(this.banksGrupos2.slice());
            return;
        } else {
            searchGrupos2 = searchGrupos2.toLowerCase();
        }

        // tslint:disable-next-line: max-line-length
        this.filteredBanksGrupos2.next(this.banksGrupos2.filter(bankGrupos2 => bankGrupos2.nombre_grupo.toLowerCase().indexOf(searchGrupos2) > -1));
    }

    // cuarto:
    protected setInitialValueGrupos2() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksGrupos2.pipe(take(1), takeUntil(this._onDestroyGrupos2)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectGrupos2.compareWith = (a: any, b: any) => a && b &&  a.nombre_grupo === b.nombre_grupo;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosGrupos3(data: any) {
        this.banksGrupos3.push(...data);
        // despues llamamos al metodo matSelect
        this.matSelectGrupos3();
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectGrupos3() {
        this.filteredBanksGrupos3.next(this.banksGrupos3.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlGrupos3.valueChanges.pipe(takeUntil(this._onDestroyGrupos3)).subscribe(() => {
            this.filterBanksGrupos3();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksGrupos3() {
        //
        if (!this.banksGrupos3) {
            return;
        }
        // get the search keyword
        let searchGrupos3 = this.bankFilterCtrlGrupos3.value;
        if (!searchGrupos3) {
            this.filteredBanksGrupos3.next(this.banksGrupos3.slice());
            return;
        } else {
            searchGrupos3 = searchGrupos3.toLowerCase();
        }

        // tslint:disable-next-line: max-line-length
        this.filteredBanksGrupos3.next(this.banksGrupos3.filter(bankGrupos3 => bankGrupos3.nombre_grupo.toLowerCase().indexOf(searchGrupos3) > -1));
    }

    // cuarto:
    protected setInitialValueGrupos3() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksGrupos3.pipe(take(1), takeUntil(this._onDestroyGrupos3)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectGrupos3.compareWith = (a: any, b: any) => a && b &&  a.nombre_grupo === b.nombre_grupo;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosUsuarios2(data: any) {
        this.banksUsuarios2.push(...data);
        // despues llamamos al metodo matSelect
        this.matSelectUsuarios2();
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectUsuarios2() {
        this.filteredBanksUsuarios2.next(this.banksUsuarios2.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlUsuarios2.valueChanges.pipe(takeUntil(this._onDestroyUsuarios2)).subscribe(() => {
            this.filterBanksUsuarios2();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksUsuarios2() {
        //
        if (!this.banksUsuarios2) {
            return;
        }
        // get the search keyword
        let searchUsuarios2 = this.bankFilterCtrlUsuarios2.value;
        if (!searchUsuarios2) {
            this.filteredBanksUsuarios2.next(this.banksUsuarios2.slice());
            return;
        } else {
            searchUsuarios2 = searchUsuarios2.toLowerCase();
        }
        // tslint:disable-next-line: max-line-length
        // console.log('filtro por parametros: ', this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.usuario.toLowerCase().indexOf(searchUsuarios2) > -1).length );

        if (this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.usuario.toLowerCase().indexOf(searchUsuarios2) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
            this.filteredBanksUsuarios2.next(this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.usuario.toLowerCase().indexOf(searchUsuarios2) > -1));
        }

        if (this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.nombre.toLowerCase().indexOf(searchUsuarios2) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
            this.filteredBanksUsuarios2.next(this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.nombre.toLowerCase().indexOf(searchUsuarios2) > -1));
        }

        if (this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.apellido.toLowerCase().indexOf(searchUsuarios2) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
        this.filteredBanksUsuarios2.next(this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.apellido.toLowerCase().indexOf(searchUsuarios2) > -1));
        }
    }

    // cuarto:
    protected setInitialValueUsuarios2() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksUsuarios2.pipe(take(1), takeUntil(this._onDestroyUsuarios2)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectUsuarios2.compareWith = (a: any, b: any) => a && b &&  a.nombre === b.nombre;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    /*************************************** Métodos de select con filtro ********************************************/
    // Primero: llenar la lista de select a mostrar en el select con filtro
    llenarDatosUsuarios3(data: any) {
        this.banksUsuarios3.push(...data);
        // despues llamamos al metodo matSelect
        this.matSelectUsuarios3();
    }

    // Segundo: metodo que escuchara cambios cuandoi se digite un texto
    matSelectUsuarios3() {
        this.filteredBanksUsuarios3.next(this.banksUsuarios3.slice());

        // escuche los cambios en el valor del campo de búsqueda
        this.bankFilterCtrlUsuarios3.valueChanges.pipe(takeUntil(this._onDestroyUsuarios3)).subscribe(() => {
            this.filterBanksUsuarios3();
        });
    }

    // tercero: metodo que busca la lista de vehiculos en el select y lo muestra los resultados en el matSelect
    protected filterBanksUsuarios3() {
        //
        if (!this.banksUsuarios2) {
            return;
        }
        // get the search keyword
        let searchUsuarios3 = this.bankFilterCtrlUsuarios3.value;
        if (!searchUsuarios3) {
            this.filteredBanksUsuarios3.next(this.banksUsuarios3.slice());
            return;
        } else {
            searchUsuarios3 = searchUsuarios3.toLowerCase();
        }
        // tslint:disable-next-line: max-line-length
        // console.log('filtro por parametros: ', this.banksUsuarios2.filter(bankUsuarios2 => bankUsuarios2.usuario.toLowerCase().indexOf(searchUsuarios2) > -1).length );

        if (this.banksUsuarios3.filter(bankUsuarios3 => bankUsuarios3.usuario.toLowerCase().indexOf(searchUsuarios3) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
            this.filteredBanksUsuarios3.next(this.banksUsuarios3.filter(bankUsuarios3 => bankUsuarios3.usuario.toLowerCase().indexOf(searchUsuarios3) > -1));
        }

        if (this.banksUsuarios3.filter(bankUsuarios3 => bankUsuarios3.nombre.toLowerCase().indexOf(searchUsuarios3) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
            this.filteredBanksUsuarios3.next(this.banksUsuarios3.filter(bankUsuarios3 => bankUsuarios3.nombre.toLowerCase().indexOf(searchUsuarios3) > -1));
        }

        if (this.banksUsuarios3.filter(bankUsuarios3 => bankUsuarios3.apellido.toLowerCase().indexOf(searchUsuarios3) > -1).length > 0) {
            // tslint:disable-next-line: max-line-length
            this.filteredBanksUsuarios3.next(this.banksUsuarios3.filter(bankUsuarios3 => bankUsuarios3.apellido.toLowerCase().indexOf(searchUsuarios3) > -1));
        }
    }

    // cuarto:
    protected setInitialValueUsuarios3() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksUsuarios3.pipe(take(1), takeUntil(this._onDestroyUsuarios3)).subscribe(() => {
            this.singleSelectUsuarios3.compareWith = (a: any, b: any) => a && b &&  a.nombre === b.nombre;
        });
    }
    /*************************************** Métodos de select con filtro ********************************************/

    seleccionUsuariosEsclavos(event) {
        this.selectionSubUsuario.clear();
        console.log('usuario seleccionado:', event.value);

        this.dataSourceSubUsuario.data = [];
        this.dataSourceSubUsuario.data.push(...this.dataSourceUser.data);
        this.dataSourceSubUsuario.data = this.dataSourceSubUsuario.data;
        
        this.restService.obtenerSesionesSubUsuario(event.value.id_usuario).subscribe((data2) => {
            console.log('sub usuarios',data2);
            // tslint:disable-next-line: forin
            for (let i in this.dataSourceSubUsuario.data) {
                // tslint:disable-next-line: max-line-length
                const result = data2.find( dat => dat.id_usuario_sub === this.dataSourceSubUsuario.data[i].id_usuario );

                if (result !== undefined) {
                    console.log('tiene coleccion asisnado');
                    this.selectionSubUsuario.select(this.dataSourceSubUsuario.data[i]);
                } else {
                    console.log('no tiene coleccion asignado');
                }
            }
            // console.log('VEHICULOS SELECCIONADO: ', this.selectionVehicle.selected);
        }, (err) => {
            console.log(err);
        });
    }

    // ------------------------------------------------------ metodos de las tablas de selections
    masterToggleSubUsuarios() {
        this.isAllSelectedSubUsuarios() ?
        this.selectionSubUsuario.clear() :
        this.dataSourceSubUsuario.data.forEach(row => this.selectionSubUsuario.select(row));
    }

    isAllSelectedSubUsuarios() {

        const numSelected = this.selectionSubUsuario.selected.length;
        const numRows = this.dataSourceSubUsuario.data.length;
        return numSelected === numRows;
    }

    asignarEliminarMasterASubUsuario(event, row) {
        // console.log('EVENT: ', event);
        console.log('DATA ', row.id_usuario);
        console.log('usuario marter: ', this.bankCtrlUsuarios3.value.id_usuario);
    

        if (event.checked === true) {
            // significa que agregó un vehiculo a un usuario
            this.restService.agregarSubUsuario(this.bankCtrlUsuarios3.value.id_usuario, row.id_usuario).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Sub usuario agregado al master', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });
        } else {
            // significa que elñimino un vehiculo a un usuario
            this.restService.quitarSubUsuario(this.bankCtrlUsuarios3.value.id_usuario, row.id_usuario).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Sub usuario eliminado al master', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });

        }
    }
    // ------------------------------------------------------ metodos de las tablas de selections

    // ************************ metodos telefono 1
    get phoneGroup() {
        return this.profileForm.get('phone') as FormControl;
    }
    get phoneCountryControl() {
        return this.profileForm.get('phone.country') as FormControl;
    }
    get phoneNumberControl() {
        return this.profileForm.get('phone.number') as FormControl;
    }
    get phoneNumberDigits(): string {
        return this.phoneNumberControl.value.replace(/\D/g, '');
    }
    get phoneNumber(): PhoneNumber {
        return new PhoneNumber(this.phoneNumberDigits, this.phoneCountryControl.value);
    }
    get phoneHint(): string {
        return PhoneNumber.getExample(this.phoneCountryControl.value).getNumber('national');
    }
    get phoneE164(): string {
        return this.phoneNumber.getNumber('e164');
    }
    formatNumber() {
        const natNum = this.phoneNumber.getNumber('national');
        this.phoneNumberControl.setValue((natNum) ? natNum : this.phoneNumberDigits);
    }

    obtenerNunmero(): any {
        
        //E.164 formato estandar de numero de telefono

        if(this.phoneNumber.getNumber('rfc3966')) {
            // numero de telefono
            console.log('tel: ', this.phoneNumber.getNumber('rfc3966'));
            
            // console.log(this.phoneNumber.getNumber('rfc3966').substr(4).split('-'));

            const arregloNumeros = this.phoneNumber.getNumber('rfc3966').substr(4).split('-');
            console.log('length: ', arregloNumeros.length);

            let numeroTelefono = {
                simbolo: '',
                codigoPais: '',
                codigoCiudad: '',
                telefono: '',
                activado: 0,
                formato: this.phoneNumber.getNumber('e164'),
                codigo: this.phoneNumber.getRegionCode()          
            }
            switch(arregloNumeros.length) {
                case 2:
                    // significa que solo tiene codigo de pais y numero
                    
                    // añadimos el simbolo para llamadas internacionales
                    numeroTelefono.simbolo = this.phoneNumber.getNumber('rfc3966').substr(4,1);
                    // añadimos el codigo del pais
                    numeroTelefono.codigoPais = arregloNumeros[0].substr(1);
                    // añadimos telefono
                    numeroTelefono.telefono = arregloNumeros[1];
                    // console.log('telefono: ', numeroTelefono);
                    break;
                case 3:
                    // significa que tiene codigo de pais y numero telefono
                    
                    // añadimos el simbolo para llamadas internacionales
                    numeroTelefono.simbolo = this.phoneNumber.getNumber('rfc3966').substr(4,1);
                    // añadimos el codigo del pais
                    numeroTelefono.codigoPais = arregloNumeros[0].substr(1);
                    // añadimos telefono
                    numeroTelefono.telefono = arregloNumeros[1]
                    // añadimos telefono
                    numeroTelefono.telefono += arregloNumeros[2];
                    // console.log('telefono: ', numeroTelefono);
                    break;
                case 4:
                    // significa que tiene codigo de pais codigo de ciudad y numero telefono
                    
                    // añadimos el simbolo para llamadas internacionales
                    numeroTelefono.simbolo = this.phoneNumber.getNumber('rfc3966').substr(4,1);
                    // añadimos el codigo del pais
                    numeroTelefono.codigoPais = arregloNumeros[0].substr(1);
                    // añadimos codigo de ciudad
                    numeroTelefono.codigoCiudad = arregloNumeros[1]
                    // añadimos telefono
                    numeroTelefono.telefono = arregloNumeros[2];
                    numeroTelefono.telefono += arregloNumeros[3];
                    // console.log('telefono: ', numeroTelefono);
                    break;
                default:
                    return [];
                    break;
            }

            // console.log('telefono: ', numeroTelefono);
            return [numeroTelefono];
        }
        
    }
    // ************************ metodos telefono 1
}
