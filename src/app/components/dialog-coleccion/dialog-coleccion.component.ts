import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { RestService } from '../../services/rest.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-coleccion',
  templateUrl: './dialog-coleccion.component.html',
  styleUrls: ['./dialog-coleccion.component.css']
})
export class DialogColeccionComponent implements OnInit {

  public nombre = '';
  public fecha = '';

  constructor(public dialogRef: MatDialogRef<DialogColeccionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private restService: RestService) { }

  ngOnInit() {

    // load the initial bank list
    this.fecha = moment().format('YYYY-MM-DD HH:mm:ss');
  }

  public registrarColeccion() {
    const fechaUtc = String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));

    this.restService.registrarColeccion(
      this.nombre,
      0,
      fechaUtc,
      []
    ).subscribe((res) => {
      if (res['affectedRows'] === 1) {
        this.dialogRef.close(true);
      } else {
        this.dialogRef.close(false);
      }
    }, (err) => {
      console.log(err);
    });
  }

}
