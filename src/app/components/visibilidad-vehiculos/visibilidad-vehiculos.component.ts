import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { RestService } from '../../services/rest.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { MatPaginator } from '@angular/material/paginator';

export interface VehiculoVisibilidad {
  id?: number;
  id_usuario?: number;
  id_dispositivo?: number;
  visibilidad?: number;
  visibilidad2?: number;
  nombre?: string;
  nombre_grupo?: string;
}

const ELEMENT_DATA: VehiculoVisibilidad[] = [];
const ELEMENT_DATA2: any[] = [];

@Component({
  selector: 'app-visibilidad-vehiculos',
  templateUrl: './visibilidad-vehiculos.component.html',
  styleUrls: ['./visibilidad-vehiculos.component.css']
})
export class VisibilidadVehiculosComponent implements OnInit {

    /*********************** Tabla vehículos ************************/
    displayedColumns: string[] = ['select', 'nombre'];
    dataSource = new MatTableDataSource<VehiculoVisibilidad>(ELEMENT_DATA);
    selection = new SelectionModel<VehiculoVisibilidad>(true, []);
    @ViewChild('pagVehiculo', {static: true}) paginatorVehiculo: MatPaginator;

    /*********************** Tabla Grupos ************************/
    displayedColumnsGrupos: string[] = ['select', 'nombre_grupo'];
    dataSourceGrupos = new MatTableDataSource<any>();
    selectionGrupos = new SelectionModel<any>(true, []);
    @ViewChild('pagGrupo', {static: true}) paginatorGrupo: MatPaginator;
    // @ViewChild(MatSort, {static: true}) sort: MatSort;

    /** Grupos de vehiculos */
    grupos: any[] = [];

    // ORDEN DE VISIBILIDAD
    favoriteSeason = this.localStorageService.ordenVehiculos.orden;
    seasons: string[] = [];

    public disabledVehiculos = false;
    public progressGoup = false;

    constructor(public dialogRef: MatDialogRef<VisibilidadVehiculosComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit() {

        if (this.localStorageService.usuario.usuario.idioma === 'es') {
            this.seasons = ['Orden alfabético', 'Orden de conexión'];
        } else {
            this.seasons = ['Alphabetical order', 'Connection order'];
        }

        this.dataSource.paginator = this.paginatorVehiculo;
        this.dataSource.data = [];
        this.dataSource.data.push(...this.localStorageService.vehiculos);
        this.dataSource.data = this.dataSource.data;

        // buscamos los vehiculos que tiene visdibilidad asignada y lo añadimos al checkbox verdadero
        for (let i in this.dataSource.data) {
            if (this.dataSource.data[i].visibilidad2 === 1) {
                this.selection.select(this.dataSource.data[i]);

                // seleccionar o deseleccionar item (cambia el estado de seleccion de checkbox)
                // this.selection.toggle(this.localStorageService.vehiculos[0]);
                // this.selection.deselect(this.localStorageService.vehiculos[1]);

                
                // limpiar todas las selecciones
                // this.selection.clear();
            }
        }

        // this.cargarGrupos();
        // tslint:disable-next-line: forin
        for (let j in this.localStorageService.vehiculos) {

            const index = this.grupos.findIndex((grupo) => grupo.nombre_grupo === this.localStorageService.vehiculos[j].nombre_grupo);
            if (index > -1) {
                // significa que existe y no es nesesario agregar el grupo
                // console.log('existe grupo: ', this.localStorageService.vehiculos[j].nombre_grupo);
            } else {
                // significa que no existe
                // console.log('NO existe grupo: ', this.localStorageService.vehiculos[j].nombre_grupo);
                const grupo = {
                    nombre_grupo: this.localStorageService.vehiculos[j].nombre_grupo
                };

                this.grupos.push(grupo);
                
                // this.selectionGrupos.select(grupo);
            }
        }

        // console.log('grupos de vehiculos: ', this.grupos);

        // llenamos la tabla con los datos del grupo que tenga asignado el usuario final
        this.dataSourceGrupos.paginator = this.paginatorGrupo;
        this.dataSourceGrupos.data = [];
        this.dataSourceGrupos.data.push(...this.grupos);
        this.dataSourceGrupos.data = this.dataSourceGrupos.data;


        // console.log('vehiculos seleccionados: ', this.selection.selected);


        // marcamos como activados los grupos seleccionado en el filtro
        if (this.localStorageService.gruposSeleccionados.length) {
            // console.log('hay grupos en el filtro de grupo');
            this.disabledVehiculos = true;

            for(let i in this.dataSourceGrupos.data) {
                const g =  this.localStorageService.gruposSeleccionados.find((gg) => gg.nombre_grupo === this.dataSourceGrupos.data[i].nombre_grupo);
                if(g) {
                    this.selectionGrupos.select(this.dataSourceGrupos.data[i]);
                }
            }
        } else {
            // console.log('esta vacio seleccion por grupo');
            this.disabledVehiculos = false;
        }
    }

    cambioTabs(event) {
        // console.log('evento de tab', event);
       
    }

    cargarGrupos() {
        // console.log('se ejecuto cargar grupos');
        /**
         * 
         * Evaluamos los grupos existentes y lo añadismo a una tabla
         * 
         */
        // tslint:disable-next-line: forin
        for (let j in this.localStorageService.vehiculos) {

            const index = this.grupos.findIndex((grupo) => grupo.nombre_grupo === this.localStorageService.vehiculos[j].nombre_grupo);
            if (index > -1) {
                // significa que existe y no es nesesario agregar el grupo
                // console.log('existe grupo: ', this.localStorageService.vehiculos[j].nombre_grupo);
            } else {
                // significa que no existe
                // console.log('NO existe grupo: ', this.localStorageService.vehiculos[j].nombre_grupo);
                const grupo = {
                    nombre_grupo: this.localStorageService.vehiculos[j].nombre_grupo
                };

                this.grupos.push(grupo);

            }
        }

        // console.log('grupos de vehiculos: ', this.grupos);

        // llenamos la tabla con los datos del grupo que tenga asignado el usuario final
        this.dataSourceGrupos.data = [];
        this.dataSourceGrupos.data = this.grupos;
        this.dataSourceGrupos.data = this.dataSourceGrupos.data;
        
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // console.log('vehiculos activos', this.selection.selected);
        // console.log('DATA SOURCE:', this.dataSource.data);

    }

    actualizarVehiculosVisible() {

        // tslint:disable-next-line: forin
        for (let i in this.dataSource.data) {

            // evaluamos visibilidad por grupos
            const resultGrupos = this.selectionGrupos.selected.find(grupo => grupo.nombre_grupo === this.dataSource.data[i].nombre_grupo);

            // si encuentra resultados
            // hay que añadir la visibilidad de los vehiculos que pertenezcan a un grupo
            // especifico
            if (resultGrupos) {
                // console.log('encontro grupo para visualizar');
                // ponemos visible los vehiculos que pertenezcan al grupo
                this.dataSource.data[i].visibilidad = 1;
                this.localStorageService.vehiculos[i].visibilidad2 = 1;
            } else {
                
                // evaluamos visibilidad por vehiculos
                let enc = this.selection.selected.find(disp => disp.id_dispositivo === this.dataSource.data[i].id_dispositivo);
                // console.log('>>>> ', enc);

                // lugar para actualizar la visibilidad de los vehiculos
                if (enc !== undefined) {
                    // si es diferente de indefinido significa que ese vehiculo es visible y hay que
                    // actualizar su erstado en caso que no lo este
                    this.dataSource.data[i].visibilidad = 1;
                    this.localStorageService.vehiculos[i].visibilidad2 = 1;
                    // console.log('** vehiculo visible', );
                } else {
                    // si marca indefinido significa que ese vehiculo no tiene que ser visible por el usuario
                    this.dataSource.data[i].visibilidad = 0;
                    this.localStorageService.vehiculos[i].visibilidad2 = 0;
                    // console.log('** vehiculo NO visible');
                }
            }
        }

        // console.log('nueva visibilidad: ', this.localStorageService.vehiculos);
        // console.log('grupos seleccionado: ', this.selectionGrupos.selected);
        if (this.localStorageService.ordenVehiculos.orden === 'Orden de conexión') {
            this.localStorageService.vehiculos.sort(function(a, b) { return a.inactivityTime - b.inactivityTime; });
        }

        //guardamos en el localStrorage los grupos seleccionados
        // console.log('grupos que se guardaran en el localStorage: ', this.selectionGrupos.selected);
        this.localStorageService.guardarGruposSeleccionado(this.selectionGrupos.selected);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    /*************************** Método de gestion de tablas de Angular ***********************/
    // Filtrar grupos
    applyFilterGrupos(filterValue: string) {
        this.dataSourceGrupos.filter = filterValue.trim().toLowerCase();
    }

    // Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara.}
    masterToggleGrupos() {
        // console.log('ejecuto metodo', this.dataSourceGrupos.data);
        this.isAllSelectedGrupos() ?
        this.selectionGrupos.clear() :
        this.dataSourceGrupos.data.forEach(row => this.selectionGrupos.select(row));
    }

    // Si el número de elementos seleccionados coincide con el número total de filas.
    isAllSelectedGrupos() {
        const numSelected = this.selectionGrupos.selected.length;
        const numRows = this.dataSourceGrupos.data.length;
        return numSelected === numRows;
    }
    /*************************** /Método de gestion de tablas de Angular **********************/
    radioChange(event) {
        // console.log(event.value);
        this.localStorageService.guardarOrdenVehiculos(event.value);
    }

    chequearGrupo(dato) {
        this.progressGoup = true;
        // console.log(this.selectionGrupos.selected);
        if (this.selectionGrupos.selected.length) {
            // console.log('bloquear lista de vehiculos individuales, hay grupos seleccionado');
            this.disabledVehiculos = true;

            // activar los vehiculos que tengan seleccionado el grupo
            // evaluamos visibilidad por grupos
            for (let i in this.dataSource.data) {
                const resultGrupos = this.selectionGrupos.selected.find(grupo => grupo.nombre_grupo === this.dataSource.data[i].nombre_grupo);
                if (resultGrupos) {
                    // console.log('encontro grupo para visualizar');
                    // ponemos visible los vehiculos que pertenezcan al grupo
                    // this.dataSource.data[i].visibilidad = 1;
                    // this.localStorageService.vehiculos[i].visibilidad2 = 1;
                    this.selection.select(this.dataSource.data[i]);
                } else {
                    // this.dataSource.data[i].visibilidad = 0;
                    // this.localStorageService.vehiculos[i].visibilidad2 = 0;
                    this.selection.deselect(this.dataSource.data[i]);
                }
            }
            
        } else {
            // console.log('no hay grupos seleccionados, filtrar solo por vehiculos');
            this.disabledVehiculos = false;
            for (let i in this.dataSource.data) {
                this.selection.deselect(this.dataSource.data[i]);
            }
        }

        this.progressGoup = false;
    }
}
