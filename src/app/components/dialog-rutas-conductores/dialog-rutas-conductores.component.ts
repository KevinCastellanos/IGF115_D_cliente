import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-dialog-rutas-conductores',
  templateUrl: './dialog-rutas-conductores.component.html',
  styleUrls: ['./dialog-rutas-conductores.component.css']
})
export class DialogRutasConductoresComponent implements OnInit {
    public rutas: any[] = [];
    constructor(public dialogRef: MatDialogRef<DialogRutasConductoresComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit() {
        console.log('RUTAS XXX: ', this.data.idsRutas);
        this.restService.obtenerRutasMultiple(this.data.idsRutas).subscribe((data) => {
            console.log(data);
            this.rutas = data;
        }, (err) => {
            console.log(err);
        });
    }

}
