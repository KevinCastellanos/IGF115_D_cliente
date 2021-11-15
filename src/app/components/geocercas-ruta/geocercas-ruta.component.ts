import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { DialogVerGeocercasComponent } from '../dialog-ver-geocercas/dialog-ver-geocercas.component';
import { DialogAgregarGeoRutaComponent } from '../dialog-agregar-geo-ruta/dialog-agregar-geo-ruta.component';
import { DialogEtiquetaComponent } from 'src/app/components/dialog-etiqueta/dialog-etiqueta.component';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-geocercas-ruta',
  templateUrl: './geocercas-ruta.component.html',
  styleUrls: ['./geocercas-ruta.component.css']
})
export class GeocercasRutaComponent implements OnInit {

    public geocercasRutas: any[] = [];

    constructor(public dialogRef: MatDialogRef<GeocercasRutaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private localStorageService: LocalStorageService,
                private dialog: MatDialog) { }

    ngOnInit() {
        // console.log('datos: ', this.data);
        this.obtenerRutaGeocerca(this.data.ruta.id_ruta);
    }

    obtenerRutaGeocerca(id_ruta) {
        this.restService.obtenerRutaGeocerca(id_ruta).subscribe((data) => {
            // console.log(data);
            const geoDisponibles = this.localStorageService.geocercas;
            // console.log('geocercas: ', geoDisponibles);

            for (const ids of data) {
                const index = this.localStorageService.geocercas.findIndex((geo) => geo.id_geocerca === ids.id_geocerca);
                if (index > -1) {
                    this.geocercasRutas.push(this.localStorageService.geocercas[index]);
                }
            }
            console.log('geocerca ruta',this.geocercasRutas);
        }, (err) => {
            console.log(err);
        });
    }

    agregarGeocercaARuta() {
        console.log('agregar geocerca a ruta', this.data.ruta.id_ruta);
        const dialogRef = this.dialog.open(DialogAgregarGeoRutaComponent, {
            width: '500px',
            data: {
                id_ruta: this.data.ruta.id_ruta
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                if (result.success === true) {
                    this.openDialog('OK', 'Georeference added successfully');
                    // tslint:disable-next-line: forin
                    for (let i in result.geos) {
                        this.geocercasRutas.push(result.geos[i]);
                    }
                } else {
                    this.openDialog('ERROR', 'The operation could not be completed');
                }
            }
        });
    }

    eliminarGeocercaARuta(geocerca) {
        console.log('id ruta: ', this.data.ruta.id_ruta);
        console.log('geocerca a eliminar de ruta: ', geocerca);

        const dialogRef = this.dialog.open(DialogEtiquetaComponent, {
            maxWidth: '350px',
            data:  {
                title: 'Confirm',
                body: 'Do you want to remove the georeference from the route?'
            }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            console.log(dialogResult);

            if (dialogResult) {

                this.restService.eliminarGeocercaARuta(this.data.ruta.id_ruta, geocerca.id_geocerca).subscribe((data) => {
                    console.log(data);
                    this.openDialog('OK', 'Georeference removed successfully');

                    // eliminar de la lista actual
                    const index = this.geocercasRutas.findIndex((g) => g.id_geocerca === geocerca.id_geocerca);
                    if (index > -1) {
                        this.geocercasRutas.splice(index, 1);
                    }
                }, (err) => {
                    console.log(err);
                    this.openDialog('OK', 'The operation could not be completed, try again later, if the fault persists contact technical support');
                });

            } else {

            }
        });

        
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

}
