import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-dialog-estadistica-velocidad',
  templateUrl: './dialog-estadistica-velocidad.component.html',
  styleUrls: ['./dialog-estadistica-velocidad.component.css']
})
export class DialogEstadisticaVelocidadComponent implements OnInit {

    multi: any[];
    view: any[] = [];

    // options
    legend: boolean = false;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Event time';
    yAxisLabel: string = 'Speed';
    timeline: boolean = true;

    colorScheme = {
        domain: ['orange']
    };

    // -----------------------------------------
    singleBar: any[];
    multiBar: any[];

    viewBar: any[] = [700, 400];

    // options
    showXAxisBar = true;
    showYAxisBar = true;
    gradientBar = false;
    showLegendBar = false;
    showXAxisLabelBar = true;
    xAxisLabelBar = 'Event time';
    showYAxisLabelBar = true;
    yAxisLabelBar = 'Speed (km/h)';
    barPadding = 1;
    roundEdges = false;
    colorSchemeBar = {
        domain: ['#ff5722']
    };
    nombreVehiculo = '';

    constructor(public dialogRef: MatDialogRef<DialogEstadisticaVelocidadComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public localStorageService: LocalStorageService,) { }

    ngOnInit(): void {

        const veh = this.localStorageService.vehiculos.find((v) => v.imei == this.data[0].imei);

        if (veh) {
            this.nombreVehiculo = veh.nombre;
        }


        console.log('detalle viaje: ', this.data);
        let datos = [];
        for (let i in this.data) {
            if (this.data[i].vel > 0) {
                datos.push({
                    name: this.data[i].event_time.substr(11,8),
                    value: this.data[i].vel * 1.609
                });
            }
        }

        this.singleBar = datos.map(datum => ({ name: datum.name, value: datum.value }));
    }

}
