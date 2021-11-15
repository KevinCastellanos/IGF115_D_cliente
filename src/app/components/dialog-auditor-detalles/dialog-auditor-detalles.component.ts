import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';


@Component({
  selector: 'app-dialog-auditor-detalles',
  templateUrl: './dialog-auditor-detalles.component.html',
  styleUrls: ['./dialog-auditor-detalles.component.css']
})
export class DialogAuditorDetallesComponent implements OnInit {

    public eventos: any[] = [];
    public loader = true;
    public searchText = '';

    constructor(public dialogRef: MatDialogRef<DialogAuditorDetallesComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit(): void {
        this.obtenerDatos(this.data.imei, this.data.fInit, this.data.fEnd);
    }

    obtenerDatos(imei, fInit, fFin) {
        this.restService.obtenerDataRaw(imei, fInit, fFin).subscribe((data) => {


            try {
                // Nos aseguramos que no se presenten eventos duplicados en la app
                let sa = -1;
                // nos aseguramos que no presente evento repetidos por tiempo y evento
                let event = '-1';
                let tiempo = '-1';
                // primero evaluamos si trae .SA 
                if (data[0].SA !== '') {

                    // eliminar elementos suplicado con SA y tiempo a la vez
                    // Algorithmic Complexity: O(N) 
                    // Evaluamos si tiene valores repetidos, si lo tiene, se elimina los que aparecen repetidos
                    var hash = {};
                    data = data.filter(function(current) {
                        let go = current.SA !== undefined ? String(current.event_time) + String(current.SA) : String(current.event_time);
                        let exists = !hash[go] || false;
                        hash[go] = true;
                        return exists;
                    });
                    // fin de evaluacion de datos repetidos

                    // si es diferente de vacío indica que este vehiculo tiene secuencia analogica
                    // configurado, por lo tanto evaluamos por SA
                    for (const info of data) {
                        if (Number(info.SA) !== Number(sa)) {
                            sa = Number(info.SA);
                            if (info.evento === '04') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '05') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '08') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '10') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '96') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '97') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '45') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '46') {
                                this.eventos.push(info);
                            }
                        } else {
                            console.log('Hay SA duplicado: ', Number(info.SA));
                        }
                    }
                } else {
                    // si el SA es vacío indica que este vehículo no tiene secuencia analogica
                    // configurado, por lo tanto evaluamos por evento y tiempo
                    // Algorithmic Complexity: O(N) 
                    // Evaluamos si tiene valores repetidos, si lo tiene, se elimina los que aparecen repetidos
                    var hash = {};
                    data = data.filter(function(current) {
                        let go = current.SA !== undefined ? String(current.event_time) + String(current.SA) : String(current.event_time);
                        let exists = !hash[go] || false;
                        hash[go] = true;
                        return exists;
                    });
                    // fin de evaluacion de datos repetidos

                    for (const info of data) {
                        // console.log(info.event_time);
                        if (info.event_time !== tiempo && info.evento !== event) {
                            // actualizamos los datos de evaluación
                            tiempo = info.event_time;
                            event = info.evento;
                            if (info.evento === '04') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '05') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '08') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '10') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '96') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '97') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '45') {
                                this.eventos.push(info);
                            }
                            if (info.evento === '46') {
                                this.eventos.push(info);
                            }

                        } else {
                            console.log('duplicado en fecha: ', Number(info.SA));
                        }
                    }
                }
                this.loader = false;
            } catch (e) {
                console.log(e);
            }


        }, (err) => {
            console.log(err);
        });

    }

    clearSearchField() {
        this.searchText = '';
    }
}
