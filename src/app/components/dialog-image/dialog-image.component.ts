import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';

export interface DialogImage {
  title: any;
  body: any;
}
@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.css']
})
export class DialogImageComponent implements OnInit {

    public imagen = '/assets/cargando.gif';
    public imageNoDisponible = '/assets/imagen_no_disponible.png';

  constructor(public dialogRef: MatDialogRef<DialogImageComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private restService: RestService) { }

    ngOnInit() {
        this.obtenerImagen(this.data.imei, this.data.ps00);
    }

    obtenerImagen(imei, ps00) {
        this.restService.obtenerImagen(imei, ps00).subscribe((data) => {
            // console.log(data);
            // this.dialogImagen(event, data['data']);
            if (data['ok'] === true) {
                this.imagen = data['data'];
            } else {
                this.imagen = this.imageNoDisponible
            }
            
        }, (error) => {
            console.log(error);
        });
    }
}
