import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-dialog-geocerca-fuera-ruta',
  templateUrl: './dialog-geocerca-fuera-ruta.component.html',
  styleUrls: ['./dialog-geocerca-fuera-ruta.component.css']
})
export class DialogGeocercaFueraRutaComponent implements OnInit {
    public geocercasFueraRuta: any[] = [];

    constructor(public dialogRef: MatDialogRef<DialogGeocercaFueraRutaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private localStorageService: LocalStorageService,
                ) { }

    ngOnInit() {
        console.log(this.data);
        // this.geocercasFueraRuta = this.data.nombreRutas;

        for (const g of this.data.nombreRutas) {
          if (g.dia === this.data.dia) {
            const nomGeo = this.localStorageService.geocercas.find((geo) => geo.id_geocerca === g.id_geocerca);
            if (nomGeo) {
              nomGeo.event_time = g.fecha;
              this.geocercasFueraRuta.push(nomGeo);
            }
          }
        }
    }

}
