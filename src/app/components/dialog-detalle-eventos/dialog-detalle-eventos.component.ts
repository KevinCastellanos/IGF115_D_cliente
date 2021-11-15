import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as moment from 'moment';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-dialog-detalle-eventos',
  templateUrl: './dialog-detalle-eventos.component.html',
  styleUrls: ['./dialog-detalle-eventos.component.css']
})
export class DialogDetalleEventosComponent implements OnInit {
    public eventos: any[] = [];
    constructor(public dialogRef: MatDialogRef<DialogDetalleEventosComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private localStorageService: LocalStorageService,
                public mapService: MapService) { }

    ngOnInit() {

      for (const ev of this.data.eventos) {
            const date1 = moment(ev.event_time);
            const dow1 = date1.day();
            if (dow1 === this.data.dia) {
              ev.direccion = 'Solving direction...';
              this.eventos.push(ev);
            }
      }

      this.convertirDireciones();
    }

    async convertirDireciones() {
        // console.log(this.viajes);

        // tslint:disable-next-line: forin
        for (const evento of this.eventos) {
            evento.direccion = await this.mapService.geocodeLatLng(evento.lat, evento.lng);
        }
    }

}
