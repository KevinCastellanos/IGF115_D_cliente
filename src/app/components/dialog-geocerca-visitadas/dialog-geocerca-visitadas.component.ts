import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dialog-geocerca-visitadas',
  templateUrl: './dialog-geocerca-visitadas.component.html',
  styleUrls: ['./dialog-geocerca-visitadas.component.css']
})
export class DialogGeocercaVisitadasComponent implements OnInit {

    public geocercasRutas: any[] = [];
    public nombre = '';

    constructor(public dialogRef: MatDialogRef<DialogGeocercaVisitadasComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private localStorageService: LocalStorageService) { }

    ngOnInit() {
        console.log('datos: ', this.data);
        this.obtenerRutaGeocerca(this.data.ruta);
        this.obtenerNombreruta();
    }

    obtenerRutaGeocerca(id_ruta) {

        this.restService.obtenerRutaGeocerca(id_ruta).subscribe((data) => {
            console.log('geocercas de la ruta', data);
            // const geoDisponibles = this.localStorageService.geocercas;
            // console.log('geocercas: ', geoDisponibles);
            /*console.log('GEOCERCAS DENTRO RUTA: ', this.data.nombreRutas[26]);
            const g2 = this.data.nombreRutas.find((re) => re.id_geocerca === 330  );
            console.log('UNA GEOCERCA INDIVIDUAL: ', g2);
            let i = 0;*/
            for (const ids of data) {

                const index = this.localStorageService.geocercas.findIndex((geo) => geo.id_geocerca === ids.id_geocerca);

                if (index > -1) {
                    // console.log('encontro geocerca: ', i++, ' ID GEO: ', ids.id_geocerca&& re.dia == 4 );

                    const g = this.data.nombreRutas.find((re) => re.id_geocerca === ids.id_geocerca && re.dia === this.data.dia);

                    if (g) {
                        if (g.dia === this.data.dia) {
                            this.localStorageService.geocercas[index].icon = 'check_circle';
                            this.localStorageService.geocercas[index].event_time = g.fecha;
                            // console.log('DIA: ', this.data.dia);
                            // console.log('ID GEO: ', g.id_geocerca);
                        } else {
                            this.localStorageService.geocercas[index].icon = 'remove';
                            this.localStorageService.geocercas[index].event_time = '';
                        }
                    } else {
                        this.localStorageService.geocercas[index].icon = 'remove';
                        this.localStorageService.geocercas[index].event_time = '';
                    }

                    // insertamos el listado de geocercas asignada a la ruta
                    this.geocercasRutas.push(this.localStorageService.geocercas[index]);
                }
            }
        }, (err) => {
            console.log(err);
        });
    }

    obtenerNombreruta() {
        this.restService.obtenerRutas(26).subscribe((res) => {
            // console.log(res);
            const ruta = res.find((rut) => rut.id_ruta === this.data.ruta);
            if (ruta) {
                this.nombre = ruta.nombre;
            }
        }, (err) => {
            console.log(err);
        });
    }

}
