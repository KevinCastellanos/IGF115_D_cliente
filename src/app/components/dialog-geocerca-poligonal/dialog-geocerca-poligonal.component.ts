import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dialog-geocerca-poligonal',
  templateUrl: './dialog-geocerca-poligonal.component.html',
  styleUrls: ['./dialog-geocerca-poligonal.component.css']
})
export class DialogGeocercaPoligonalComponent implements OnInit {

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

    constructor(public dialogRef: MatDialogRef<DialogGeocercaPoligonalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit() {
        console.log('latlng: ', this.data.latLngs);
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

    registrarGeocercaPoligonal() {

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

        this.restService.registrarGeocercaPoligonal(
            -1,
            this.data.latLngs,
            this.nombre,
            this.localStorageService.usuario.usuario.id_grupo,
            idColeccionGeocerca,
            fechaUtc,
            'false').subscribe((resp) => {
                // console.log(resp);
                if (resp['affectedRows'] === 1) {
                this.dialogRef.close(true);
                } else {
                this.dialogRef.close(false);
                }
            }, (err) => {
            console.log(err);
            });
    }

    registroMultipleGrupo(idColeccionGeocerca, fechaUtc) {
        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            // console.log('todos los grupos:', data);
            this.restService.registrarGeocercaPoligonalMultipleGrupo(
                                                        -1,
                                                        this.data.latLngs,
                                                        this.nombre,
                                                        data,
                                                        idColeccionGeocerca,
                                                        fechaUtc, 'false').subscribe((resp) => {
                // console.log(resp);
                if (resp['affectedRows'] === 1) {
                    this.dialogRef.close(true);
                } else {
                    this.dialogRef.close(false);
                }
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    registroMultipleGrupoSelected(idColeccionGeocerca, fechaUtc) {
        // console.log('Grupos seleccionado', this.bankMultiCtrl.value);
        this.restService.registrarGeocercaPoligonalMultipleGrupo(
                                                                -1,
                                                                this.data.latLngs,
                                                                this.nombre,
                                                                this.bankMultiCtrl.value,
                                                                idColeccionGeocerca,
                                                                fechaUtc, 'false').subscribe((resp) => {
            // console.log(resp);
            if (resp['affectedRows'] === 1) {
                this.dialogRef.close(true);
            } else {
                this.dialogRef.close(false);
            }
        }, (err) => {
            console.log(err);
        });
    }

    registrarMultipleColecciones(fechaUtc) {
        this.desabilitar = true;
        console.log('colecciones seleccionadas: ',  this.bankMultiCtrlColecciones.value);
        console.log('latLngs: ', this.data.latLngs);
        console.log('nombre: ', this.nombre);
        this.restService.obtenerGrupos().subscribe((data) => {
            this.restService.registrarGeocercaPoligonalColecciones(
                                                                    -1,
                                                                    this.data.latLngs,
                                                                    this.nombre,
                                                                    data,
                                                                    this.bankMultiCtrlColecciones.value,
                                                                    fechaUtc, 'false').subscribe((resp) => {
                // console.log(resp);
                if (resp['affectedRows'] === 1) {
                    this.dialogRef.close(true);
                } else {
                    this.dialogRef.close(false);
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

    registrarGrupoMasColeccion(idColeccionGeocerca, fechaUtc) {
        console.log('Grupos seleccionado', this.bankMultiCtrl.value);
        this.restService.registrarGeocercaPoligonalMultipleGrupo(
                                                                -1,
                                                                this.data.latLngs,
                                                                this.nombre,
                                                                this.bankMultiCtrl.value,
                                                                idColeccionGeocerca,
                                                                fechaUtc, 'false').subscribe((resp) => {

            console.log('colecciones seleccionadas: ',  this.bankMultiCtrlColecciones.value);
            this.restService.obtenerGrupos().subscribe((data) => {
                this.restService.registrarGeocercaPoligonalColecciones(
                                                                        -1,
                                                                        this.data.latLngs,
                                                                        this.nombre,
                                                                        data,
                                                                        this.bankMultiCtrlColecciones.value,
                                                                        fechaUtc, 'false').subscribe((resp) => {
                    // console.log(resp);
                    if (resp['affectedRows'] === 1) {
                        this.dialogRef.close(true);
                    } else {
                        this.dialogRef.close(false);
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
