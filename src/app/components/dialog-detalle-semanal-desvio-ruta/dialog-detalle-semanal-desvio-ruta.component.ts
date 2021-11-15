import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dialog-detalle-semanal-desvio-ruta',
  templateUrl: './dialog-detalle-semanal-desvio-ruta.component.html',
  styleUrls: ['./dialog-detalle-semanal-desvio-ruta.component.css']
})

export class DialogDetalleSemanalDesvioRutaComponent implements OnInit {

    public desvios: any[] = [];
    constructor(public dialogRef: MatDialogRef<DialogDetalleSemanalDesvioRutaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit(): void {
        // console.log(this.data);
        this.obtenerDetalleDesvioRutaSemanal(this.data.eq);
    }

    obtenerDetalleDesvioRutaSemanal(eq: any) {
        this.restService.obtenerDetalleDesvioRutaSemanal(eq).subscribe((data) => {
            console.log(data);
            this.desvios = data;
        }, (error) => {
            console.log(error);
        });
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

}
