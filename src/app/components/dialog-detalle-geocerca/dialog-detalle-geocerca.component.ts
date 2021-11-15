import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dialog-detalle-geocerca',
  templateUrl: './dialog-detalle-geocerca.component.html',
  styleUrls: ['./dialog-detalle-geocerca.component.css']
})
export class DialogDetalleGeocercaComponent implements OnInit {

    public geocercas: any[] = [];
    public searchText = '';

    constructor(public dialogRef: MatDialogRef<DialogDetalleGeocercaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                public localStorageService: LocalStorageService) { }

    ngOnInit() {
        this.obtenerGeocercas();
    }

    obtenerGeocercas() {
        this.geocercas = [];
        let idGeocercas = [];
        console.log('geo obtenidos de localStorage: ',  this.localStorageService.geocercas);
        for (let i in  this.localStorageService.geocercas) {
            if (this.data['id_coleccion_geocerca'] === this.localStorageService.geocercas[i].id_coleccion_geocerca) {
                const result = idGeocercas.findIndex(idGeo => idGeo === this.localStorageService.geocercas[i].id_geocerca);
                if (result === -1) {
                    idGeocercas.push(this.localStorageService.geocercas[i].id_geocerca);
                    this.geocercas.push(this.localStorageService.geocercas[i]);
                    console.log('no repetida');
                } else {
                    console.log('geocerca repetida');
                }
            }
        }
    }

    radioChange(event) {
        console.log('cambio button', event);
        this.dialogRef.close({geocerca: event});
    }
}
