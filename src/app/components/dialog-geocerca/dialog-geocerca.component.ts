import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dialog-geocerca',
  templateUrl: './dialog-geocerca.component.html',
  styleUrls: ['./dialog-geocerca.component.css']
})
export class DialogGeocercaComponent implements OnInit, OnDestroy {

    public nombre = '';
    public grupos = '';
    public colecciones = '1';
    public fecha = '';
    public viewGrupos = false;
    public viewColectiones = false;

    // -------------------------------------------------------------------------------------------------------
    // seleccion multiple
    /** control for the selected bank for multi-selection */
    public bankMultiCtrl: FormControl = new FormControl();
    /** control for the MatSelect filter keyword multi-selection */
    public bankMultiFilterCtrl: FormControl = new FormControl();
    /** list of banks filtered by search keyword for multi-selection */
    public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** list of banks */
    private banks: any[] = [];
    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();
    // -------------------------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------
    // seleccion multiple
    /** control for the selected bank for multi-selection */
    public bankMultiCtrlColecciones: FormControl = new FormControl();
    /** control for the MatSelect filter keyword multi-selection */
    public bankMultiFilterCtrlColecciones: FormControl = new FormControl();
    /** list of banks filtered by search keyword for multi-selection */
    public filteredBanksMultiColecciones: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** list of banks */
    public banksColecciones: any[] = [];
    /** Subject that emits when the component has been destroyed. */
    private _onDestroyColecciones = new Subject<void>();
    // -------------------------------------------------------------------------------------------------------

    public asignarA = 'private';

    public desabilitar = false;

    constructor(public dialogRef: MatDialogRef<DialogGeocercaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit() {
        console.log('id grupo: ',  this.localStorageService.usuario.usuario.id_grupo);
        // console.log('colecciones: ', this.data['colecciones']);
        this.fecha = moment().format('YYYY-MM-DD HH:mm:ss');

        // --------------------------------------------------------------------------------------------------------------
        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            // console.log(data);
            this.banks.push(...data);
            this.filteredBanksMulti.next(this.banks.slice());
        }, (err) => {
            console.log(err);
        });

        /** Logica para armar lista de seleccion multiple */
        // this.filteredBanksMulti.next(this.banks.slice());
        this.bankMultiFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterBanksMulti();
        });
        // tslint:disable-next-line: jsdoc-format
        /** Fin Logica para armar lista de seleccion multiple ----------------------------------------------------------*/


        // inicializamos los valores de tiltro de lista de colecciones --------------------------------------------------
        this.banksColecciones.push(...this.data['colecciones']);
        /** Logica para armar lista de seleccion multiple */
        this.filteredBanksMultiColecciones.next(this.banksColecciones.slice());
        this.bankMultiFilterCtrlColecciones.valueChanges.pipe(takeUntil(this._onDestroyColecciones)).subscribe(() => {
            this.filterBanksMultiColecciones();
        });
        // tslint:disable-next-line: jsdoc-format
        /** Fin Logica para armar lista de seleccion multiple ---------------------------------------------------------*/

    }

    registrarGeocercaCircular() {
        this.desabilitar = true;
        // console.log('click en guardar', this.bankCtrlColecciones.value.id_coleccion_geocerca);
        const fechaUtc = String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));
        let idColeccionGeocerca = 0;
        switch (this.asignarA) {
            case 'private':
                idColeccionGeocerca = 8;
                this.registroParaUnGrupo(idColeccionGeocerca, fechaUtc);
                break;
            case 'public':
                idColeccionGeocerca = 8;
                this.registroMultipleGrupo(idColeccionGeocerca, fechaUtc);
                break;
            case 'group':
                idColeccionGeocerca = 8;
                this.registroMultipleGrupoSelected(idColeccionGeocerca, fechaUtc);
                break;
            case 'collection':
                // idColeccionGeocerca = 8;
                this.registrarMultipleColecciones(fechaUtc);
                break;
            case 'group-collecion':
                idColeccionGeocerca = 8;
                // this.registrarMultipleColecciones(fechaUtc);
                // this.registroMultipleGrupoSelected(idColeccionGeocerca, fechaUtc);
                this.registrarGrupoMasColeccion(idColeccionGeocerca, fechaUtc);
                break;
        }

    }

    registroParaUnGrupo(idColeccionGeocerca: any, fechaUtc) {
        this.restService.registrarGeocercaCircular(
                                                    this.data['radio'],
                                                    this.data['latLng'],
                                                    this.nombre,
                                                    this.localStorageService.usuario.usuario.id_grupo,
                                                    idColeccionGeocerca,
                                                    fechaUtc, 'true').subscribe((resp) => {
        console.log('data geocerca registrado: ', resp);
        if (resp['affectedRows'] === 1) {
            this.dialogRef.close({  accept: true,
                                    idGrupo: this.localStorageService.usuario.usuario.id_grupo,
                                    idGeocerca: resp['insertId'],
                                    idColeccionGeocerca,
                                    nombreColeccion: 'vacio',
                                    circular: 'true',
                                    fecha: 'vacio',
                                    visibilidad: 1,
                                    id: -1,
                                    sin_coleccion: 0,
                                    cantidad: 0,
                                    coleccion: 0,
                                    nombreGeocerca: this.nombre,
                                    coordenadaGeocerca: [{
                                        lat: 13.676105553501252,
                                        lng: -89.3046534061432,
                                        orden: null,
                                        radio: 234.5656212573355,
                                        id_geocerca: resp['insertId'],
                                        id_coordenada_geocerca: idColeccionGeocerca
                                    }]
                                });
        } else {
            this.dialogRef.close({accept: false});
        }
        }, (err) => {
            console.log(err);
        });
    }

    registroMultipleGrupo(idColeccionGeocerca: any, fechaUtc) {
        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            console.log('todos los grupos:', data);
            this.restService.registrarGeocercaCircularMultipleGrupo(
                                                        this.data['radio'],
                                                        this.data['latLng'],
                                                        this.nombre,
                                                        data,
                                                        idColeccionGeocerca,
                                                        fechaUtc, 'true').subscribe((resp) => {
                console.log(resp);
                if (resp['affectedRows'] === 1) {
                    this.dialogRef.close({accept: true});
                } else {
                    this.dialogRef.close({accept: false});
                }
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    registroMultipleGrupoSelected(idColeccionGeocerca: any, fechaUtc) {
        console.log('Grupos seleccionado', this.bankMultiCtrl.value);
        this.restService.registrarGeocercaCircularMultipleGrupo(
                                                                this.data['radio'],
                                                                this.data['latLng'],
                                                                this.nombre,
                                                                this.bankMultiCtrl.value,
                                                                idColeccionGeocerca,
                                                                fechaUtc, 'true').subscribe((resp) => {
            // console.log(resp);
            if (resp['affectedRows'] === 1) {
                this.dialogRef.close({accept: true});
            } else {
                this.dialogRef.close({accept: false});
            }
        }, (err) => {
            console.log(err);
        });
    }

    registrarMultipleColecciones(fechaUtc) {
        console.log('colecciones seleccionadas: ',  this.bankMultiCtrlColecciones.value);
        console.log('radio: ', this.data['radio']);
        console.log('lat lng: ', this.data['latLng'].lat);
        console.log('nombre geocerca: ', this.nombre);
        console.log('fecha: ', fechaUtc);
        this.restService.obtenerGrupos().subscribe((data) => {
            console.log('grupos ', data);
            this.restService.registrarGeocercaCircularColecciones(  this.data['radio'],
                                                                    this.data['latLng'],
                                                                    this.nombre,
                                                                    data,
                                                                    this.bankMultiCtrlColecciones.value,
                                                                    fechaUtc,
                                                                    'true').subscribe((resp) => {
                // console.log(resp);
                if (resp['affectedRows'] === 1) {
                    this.dialogRef.close({accept: true});
                } else {
                    this.dialogRef.close({accept: false});
                }
                this.desabilitar = false;
            }, (err) => {
                    console.log(err);
                    this.desabilitar = false;
            });
        }, (err) => {
            console.log(err);
        });
    }

    registrarGrupoMasColeccion(idColeccionGeocerca: any, fechaUtc) {
        console.log('Grupos seleccionado', this.bankMultiCtrl.value);
        this.restService.registrarGeocercaCircularMultipleGrupo(
                                                                this.data['radio'],
                                                                this.data['latLng'],
                                                                this.nombre,
                                                                this.bankMultiCtrl.value,
                                                                idColeccionGeocerca,
                                                                fechaUtc, 'true').subscribe((resp) => {

            console.log('colecciones seleccionadas: ',  this.bankMultiCtrlColecciones.value);
            this.restService.obtenerGrupos().subscribe((data) => {
                this.restService.registrarGeocercaCircularColecciones(
                                                                        this.data['radio'],
                                                                        this.data['latLng'],
                                                                        this.nombre,
                                                                        data,
                                                                        this.bankMultiCtrlColecciones.value,
                                                                        fechaUtc, 'true').subscribe((resp) => {
                    // console.log(resp);
                    if (resp['affectedRows'] === 1) {
                        this.dialogRef.close({accept: true});
                    } else {
                        this.dialogRef.close({accept: false});
                    }
                }, (err) => {
                        console.log(err);
                });
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    onDismiss(op: boolean): void {
        // Close the dialog, return false
        this.dialogRef.close(op);
    }

    // metodos de filtro de colecciones de geocercas
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this._onDestroyColecciones.next();
        this._onDestroyColecciones.complete();
    }

    private filterBanksMulti() {
        if (!this.banks) {
            return;
        }
        // get the search keyword
        let search = this.bankMultiFilterCtrl.value;
        if (!search) {
            this.filteredBanksMulti.next(this.banks.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksMulti.next(
            this.banks.filter(bank => bank.nombre_grupo.toLowerCase().indexOf(search) > -1)
        );
    }

    private filterBanksMultiColecciones() {
        if (!this.banksColecciones) {
            return;
        }
        // get the search keyword
        let search = this.bankMultiFilterCtrlColecciones.value;
        if (!search) {
            this.filteredBanksMultiColecciones.next(this.banksColecciones.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksMultiColecciones.next(
            this.banksColecciones.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1)
        );
    }
    // fin metodos de filtro de colecciones de geocercas

    seleccionVisibilidad(event) {
        console.log('visibilidad seleccionada: ', event);
        this.asignarA = event.value;
        switch (this.asignarA) {
            case 'private':
                this.viewGrupos = false;
                this.viewColectiones = false;
                break;
            case 'public':
                this.viewGrupos = false;
                this.viewColectiones = false;
                break;
            case 'group':
                this.viewGrupos = true;
                this.viewColectiones = false;
                break;
            case 'collection':
                this.viewGrupos = false;
                this.viewColectiones = true;
                break;
            case 'group-collecion':
                this.viewGrupos = true;
                this.viewColectiones = true;
                break;
        }
    }
}
