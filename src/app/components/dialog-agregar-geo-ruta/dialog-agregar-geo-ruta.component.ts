import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Geocerca } from '../../interfaces/geocerca';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

const ELEMENT_DATA_GEOCERCA: Geocerca[] = [];

@Component({
  selector: 'app-dialog-agregar-geo-ruta',
  templateUrl: './dialog-agregar-geo-ruta.component.html',
  styleUrls: ['./dialog-agregar-geo-ruta.component.css']
})
export class DialogAgregarGeoRutaComponent implements OnInit {

    // ---------------------------- tabla con seleccion multiple --------------------------------
    public isLoadingResultsGeocercas = true;
    public displayedColumnsGeocercas: string[] = ['select', 'nombre_geocerca'];
    public dataSourceGeocercas = new MatTableDataSource<Geocerca>(ELEMENT_DATA_GEOCERCA);
    public selectionGeocercas = new SelectionModel<Geocerca>(true, []);

    @ViewChild('pagGeocercas', {static: true}) paginatorGeocercas: MatPaginator;
    // ------------------------------------------------------------------------------------------

    public geocercasSeleccionados: number [] = [];
    public geos: any[] = [];
    constructor(public dialogRef: MatDialogRef<DialogAgregarGeoRutaComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) {
        
     }

    ngOnInit(): void {
        this.dataSourceGeocercas.paginator = this.paginatorGeocercas;
        this.obtenerGeocercas();
    }

    obtenerGeocercas() {
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

        }

        // console.log('geocercas: ', this.dataSourceGeocercas.data);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    AgregarGeoceraARuta() {
        console.log('geocercas seleccionadoas para agregar: ', this.geocercasSeleccionados);
        console.log('id ruta: ', this.data.id_ruta);
        this.restService.agregarGeocercaARuta(this.data.id_ruta, this.geocercasSeleccionados).subscribe((data) => {
            console.log(data);
            this.dialogRef.close({cancel: false, success: true, geos: this.geos});
        }, (err) => {
            console.log(err);
            this.dialogRef.close({cancel: false, success: false});
        });
    }

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
        
    }

    asignarEliminarGeocerca(event, row) {
        // row.checked = event.checked;
        // buscamos coincidencia para cambiar la visibilidad en el localStorage
        // tslint:disable-next-line: forin
        console.log('ID geocerca: ', row.id_geocerca);
        console.log('event');

        if (event.checked === true) {
            this.geocercasSeleccionados.push(row.id_geocerca);
            this.geos.push(row);
        } else {
            const index = this.geocercasSeleccionados.findIndex((g) => g === row.id_geocerca);
            if (index > -1) {
                this.geocercasSeleccionados.splice(index, 1);
                this.geos.splice(index, 1);
            }
        }

    }
    // ----------------------------- fin métodos seleccion de item de tabla ------------------------------------

}
