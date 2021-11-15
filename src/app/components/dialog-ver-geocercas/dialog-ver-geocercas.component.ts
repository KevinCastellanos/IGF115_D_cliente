import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
import { Grupo } from '../../interfaces/grupos';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { LocalStorageService } from '../../services/local-storage.service';
import { Coleccion } from '../../interfaces/coleccion';
import { Geocerca } from '../../interfaces/geocerca';
import { MatPaginator } from '@angular/material/paginator';

const ELEMENT_DATA_GRUPO: Grupo[] = [];
const ELEMENT_DATA_COLECCION: Coleccion[] = [];
const ELEMENT_DATA_GEOCERCA: Geocerca[] = [];

@Component({
  selector: 'app-dialog-ver-geocercas',
  templateUrl: './dialog-ver-geocercas.component.html',
  styleUrls: ['./dialog-ver-geocercas.component.css']
})
export class DialogVerGeocercasComponent implements OnInit {

    // ---------------------------- tabla con seleccion multiple --------------------------------
    public isLoadingResults = true;
    public displayedColumnsGrupo: string[] = ['select', 'nombre_grupo'];
    public dataSourceGrupo = new MatTableDataSource<Grupo>(ELEMENT_DATA_GRUPO);
    public selectionGrupo = new SelectionModel<Grupo>(true, []);
    private gruposSeleccionados: any[] = [];
    // ------------------------------------------------------------------------------------------
    // ---------------------------- tabla con seleccion multiple --------------------------------
    public isLoadingResultsColecciones = true;
    public displayedColumnsColecciones: string[] = ['select', 'nombre'];
    public dataSourceColecciones = new MatTableDataSource<Coleccion>(ELEMENT_DATA_COLECCION);
    public selectionColecciones = new SelectionModel<Coleccion>(true, []);
    private coleccionSeleccionados: any[] = [];
    @ViewChild('pagColecciones', {static: true}) paginatorColecciones: MatPaginator;
    // ------------------------------------------------------------------------------------------
    // ---------------------------- tabla con seleccion multiple --------------------------------
    public isLoadingResultsGeocercas = true;
    public displayedColumnsGeocercas: string[] = ['select', 'nombre_geocerca'];
    public dataSourceGeocercas = new MatTableDataSource<Geocerca>(ELEMENT_DATA_GEOCERCA);
    public selectionGeocercas = new SelectionModel<Geocerca>(true, []);
    private geocercaGeocercas: any[] = [];
    @ViewChild('pagGeocercas', {static: true}) paginatorGeocercas: MatPaginator;
    // ------------------------------------------------------------------------------------------

    constructor(public dialogRef: MatDialogRef<DialogVerGeocercasComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit() {
        this.dataSourceColecciones.paginator = this.paginatorColecciones;
        this.dataSourceGeocercas.paginator = this.paginatorGeocercas;
        // this.obtenerGrupos();
        this.obtenerColecciones();
        this.obtenerGeocercas();
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    verGeocercas() {
        // guardamos los cambios en el storage con los datos actualizados de visibilidad
        this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
        this.localStorageService.guardarGrupos(this.selectionGrupo.selected);
        this.localStorageService.guardarColeccion(this.selectionColecciones.selected);
        this.dialogRef.close({
            cancel: false,
            grupos: this.gruposSeleccionados
        });
        // console.log('visivilidad actualizada: ', this.selectionGrupo.selected);
    }

    obtenerGrupos() {
        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            // console.log('grupos', data);
            // console.log('grupos: ', this.localStorageService.usuario.usuario.grupos);

            this.isLoadingResults = false;
            // llenamos la tabla de datos
            // llenar de data el objeto de vehiculos
            // provicional
            this.dataSourceGrupo.data = [];
            // tslint:disable-next-line: forin
            for (let i in data) {
                const index = this.localStorageService.usuario.usuario.grupos.findIndex(grup => grup === data[i].id_grupo);
                if (index > -1) {
                    this.dataSourceGrupo.data.push(data[i]);
                }
            }
            this.dataSourceGrupo.data = this.dataSourceGrupo.data;


            // tslint:disable-next-line: forin
            for (let i in this.dataSourceGrupo.data) {
                // tslint:disable-next-line: max-line-length
                const result = this.localStorageService.grupos.find( grupo => grupo.id_grupo === this.dataSourceGrupo.data[i].id_grupo );

                if (result !== undefined) {
                    // console.log('tiene grupo asisnado');
                    this.selectionGrupo.select(this.dataSourceGrupo.data[i]);
                } else {
                    // console.log('no tiene grupo asignado');
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    obtenerColecciones() {
        this.restService.obtenerColeccionesPorGrupo2(this.localStorageService.usuario.usuario.grupos).subscribe((data) => {
            // this.colecciones.push(...data);
            console.log('colecciones: ', data);
            // this.obtenerGeocercas();
            this.isLoadingResultsColecciones = false;
            // llenamos la tabla de datos
            // llenar de data el objeto de vehiculos
            this.dataSourceColecciones.data = [];

            // convertir el array a unicos elementos
            const nuevoArray  = data.filter((v, i, a) => a.findIndex( t => (t.nombre === v.nombre) ) === i);

            console.log('colecciones filtrada: ', nuevoArray);
            // const uniques = [...new Set(data)];

            this.dataSourceColecciones.data.push(...nuevoArray);
            this.dataSourceColecciones.data = this.dataSourceColecciones.data;

            // tslint:disable-next-line: forin
            for (let i in this.dataSourceColecciones.data) {
                // tslint:disable-next-line: max-line-length
                const result = this.localStorageService.colecciones.find( coleccion => coleccion.id_coleccion_geocerca === this.dataSourceColecciones.data[i].id_coleccion_geocerca );

                if (result !== undefined) {
                    // console.log('tiene grupo asisnado');
                    this.selectionColecciones.select(this.dataSourceColecciones.data[i]);
                } else {
                    // console.log('no tiene grupo asignado');
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    obtenerGeocercas() {
        console.log('cantidad de geocercas: ', this.localStorageService.geocercas.length);
        this.isLoadingResultsGeocercas = false;
        // llenamos la tabla de datos
        // llenar de data el objeto de vehiculos
        this.dataSourceGeocercas.data = [];
        this.dataSourceGeocercas.data.push(...this.localStorageService.geocercas);
        this.dataSourceGeocercas.data = this.dataSourceGeocercas.data;

        // tslint:disable-next-line: forin
        for (let i in this.dataSourceGeocercas.data) {

            // tslint:disable-next-line: max-line-length
            const result = this.localStorageService.geocercas.find( (geocerca) => {
                return  geocerca.visibilidad === 1 &&
                        this.dataSourceGeocercas.data[i].id_geocerca === geocerca.id_geocerca &&
                        this.dataSourceGeocercas.data[i].id_geocerca === geocerca.id_geocerca &&
                        this.dataSourceGeocercas.data[i].id_coleccion_geocerca === geocerca.id_coleccion_geocerca &&
                        this.dataSourceGeocercas.data[i].id_grupo === geocerca.id_grupo;
            });

            // tslint:disable-next-line: max-line-length
            const resultGrupoUsuario = this.localStorageService.grupoUsuario.find( grupo => grupo.id_grupo === this.dataSourceGeocercas.data[i].id_grupo );

            if (resultGrupoUsuario !== undefined) {
                this.dataSourceGeocercas.data[i].nombre_grupo = resultGrupoUsuario.nombre_grupo;
            }

            if (result !== undefined) {
                // console.log('tiene grupo asisnado');
                this.selectionGeocercas.select(this.dataSourceGeocercas.data[i]);
            } else {
                // console.log('no tiene grupo asignado');
            }
        }

        // console.log('geocercas: ', this.dataSourceGeocercas.data);
    }

    // ------------------------------ Métodos de seleccion de item de tabla -------------------------------------
    applyFilterGrupos(filterValue: string) {
        this.dataSourceGrupo.filter = filterValue.trim().toLowerCase();
    }

    isAllSelected() {
        // console.log('selected: ', this.selectionGrupo.selected);
        const numSelected = this.selectionGrupo.selected.length;
        const numRows = this.dataSourceGrupo.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.selectionGrupo.clear();
            // console.log('deseleccion');
            // tslint:disable-next-line: forin
            for (let i in this.localStorageService.geocercas) {
                this.localStorageService.geocercas[i].visibilidad = 0;
            }
            this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
        } else {
            this.dataSourceGrupo.data.forEach((row) => {
                this.selectionGrupo.select(row);
                // console.log('row: ', row);
                // tslint:disable-next-line: forin
                for (let i in this.localStorageService.geocercas) {
                    this.localStorageService.geocercas[i].visibilidad = 1;
                }
                this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
            });
        }
        /*this.isAllSelected() ?
        this.selectionGrupo.clear() :
        this.dataSourceGrupo.data.forEach((row) => {
            this.selectionGrupo.select(row);
            // console.log('row: ', row);
        });*/
    }

    asignarEliminarGrupoAGrocerca(event, row) {
        row.checked = event.checked;
        // buscamos coincidencia para cambiar la visibilidad en el localStorage
        // tslint:disable-next-line: forin
        for (let i in this.localStorageService.geocercas) {
            // evaluamos si está chequeado el grupo
            if (event.checked === true) {
                if (this.localStorageService.geocercas[i].id_grupo === row.id_grupo) {
                    this.localStorageService.geocercas[i].visibilidad = 1;
                    // this.gruposSeleccionados.push(row);
                    this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
                }
            } else {
                if (this.localStorageService.geocercas[i].id_grupo === row.id_grupo) {
                    this.localStorageService.geocercas[i].visibilidad = 0;
                    this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
                }
            }

        }

        // console.log('Grupos Seleccionados: ', this.gruposSeleccionados);
    }

    // ----------------------------- fin métodos seleccion de item de tabla ------------------------------------
    // ------------------------------ Métodos de seleccion de item de tabla -------------------------------------
    applyFilterColeccion(filterValue: string) {
        this.dataSourceColecciones.filter = filterValue.trim().toLowerCase();
    }

    isAllSelectedColeccion() {
        // console.log('selected: ', this.selectionGrupo.selected);
        const numSelected = this.selectionColecciones.selected.length;
        const numRows = this.dataSourceColecciones.data.length;
        return numSelected === numRows;
    }

    masterToggleColeccion() {
        if (this.isAllSelectedColeccion()) {
            this.selectionColecciones.clear();
            // console.log('deseleccion');
            // tslint:disable-next-line: forin
            for (let i in this.localStorageService.geocercas) {
                this.localStorageService.geocercas[i].visibilidad = 0;
            }
            this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
        } else {
            this.dataSourceColecciones.data.forEach((row) => {
                this.selectionColecciones.select(row);
                // console.log('row: ', row);
                // tslint:disable-next-line: forin
                for (let i in this.localStorageService.geocercas) {
                    this.localStorageService.geocercas[i].visibilidad = 1;
                }
                this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
            });
        }
    }

    asignarEliminarColeccionAGeocerca(event, row) {
        // row.checked = event.checked;
        // buscamos coincidencia para cambiar la visibilidad en el localStorage
        // tslint:disable-next-line: forin
        for (let i in this.localStorageService.geocercas) {
            // evaluamos si está chequeado el grupo
            if (event.checked === true) {
                if (this.localStorageService.geocercas[i].id_coleccion_geocerca === row.id_coleccion_geocerca) {
                    // console.log('se activo');
                    this.localStorageService.geocercas[i].visibilidad = 1;
                    this.localStorageService.geocercas[i].visibilidad = 1;
                    // this.gruposSeleccionados.push(row);
                    // this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
                }
            } else {
                if (this.localStorageService.geocercas[i].id_coleccion_geocerca === row.id_coleccion_geocerca) {
                    // console.log('se desactivo');
                    this.localStorageService.geocercas[i].visibilidad = 0;
                    this.localStorageService.geocercas[i].visibilidad = 0;
                    // this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
                }
            }

        }

        this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
        // console.log('Grupos Seleccionados: ', this.gruposSeleccionados);
    }
    // ----------------------------- fin métodos seleccion de item de tabla ------------------------------------
    // ------------------------------ Métodos de seleccion de item de tabla -------------------------------------
    applyFilterGeocerca(filterValue: string) {
        this.dataSourceGeocercas.filter = filterValue.trim().toLowerCase();
    }

    isAllSelectedGeocerca() {
        // console.log('selected: ', this.selectionGrupo.selected);
        const numSelected = this.selectionGeocercas.selected.length;
        const numRows = this.dataSourceGeocercas.data.length;
        return numSelected === numRows;
    }

    masterToggleGeocerca() {
        if (this.isAllSelectedGeocerca()) {
            this.selectionGeocercas.clear();
            // console.log('deseleccion');
            // tslint:disable-next-line: forin
            for (let i in this.localStorageService.geocercas) {
                this.localStorageService.geocercas[i].visibilidad = 0;
            }
            this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
        } else {
            this.dataSourceGeocercas.data.forEach((row) => {
                this.selectionGeocercas.select(row);
                // console.log('row: ', row);
                // tslint:disable-next-line: forin
                for (let i in this.localStorageService.geocercas) {
                    this.localStorageService.geocercas[i].visibilidad = 1;
                }
                this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
            });
        }
    }

    asignarEliminarGeocerca(event, row) {
        // row.checked = event.checked;
        // buscamos coincidencia para cambiar la visibilidad en el localStorage
        // tslint:disable-next-line: forin
        // console.log('ID geocerca: ', row.id_geocerca);
        // console.log('ID coleccion geocerca: ', row.id_coleccion_geocerca);
        // console.log('ID grupo: ', row.id_grupo);
        for (let i in this.localStorageService.geocercas) {
            // evaluamos si está chequeado el grupo
            if (event.checked === true) {
                // tslint:disable-next-line: max-line-length
                if (this.localStorageService.geocercas[i].id_geocerca === row.id_geocerca &&
                    this.localStorageService.geocercas[i].id_coleccion_geocerca === row.id_coleccion_geocerca &&
                    this.localStorageService.geocercas[i].id_grupo === row.id_grupo) {
                    // console.log('se activo');
                    this.localStorageService.geocercas[i].visibilidad = 1;
                    // this.gruposSeleccionados.push(row);
                    // this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
                    return;
                }
            } else {
                // tslint:disable-next-line: max-line-length
                if (this.localStorageService.geocercas[i].id_geocerca === row.id_geocerca &&
                    this.localStorageService.geocercas[i].id_coleccion_geocerca === row.id_coleccion_geocerca &&
                    this.localStorageService.geocercas[i].id_grupo === row.id_grupo) {
                    // console.log('se desactivo');
                    this.localStorageService.geocercas[i].visibilidad = 0;
                    // this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
                    return;
                }
            }

        }

        this.localStorageService.actualizarGeocerca(this.localStorageService.geocercas);
        // console.log('Grupos Seleccionados: ', this.gruposSeleccionados);
    }
    // ----------------------------- fin métodos seleccion de item de tabla ------------------------------------

}
