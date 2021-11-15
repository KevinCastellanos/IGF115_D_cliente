import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-editar-coleccion',
  templateUrl: './editar-coleccion.component.html',
  styleUrls: ['./editar-coleccion.component.css']
})
export class EditarColeccionComponent implements OnInit {

    public spinner = false;

    constructor(public dialogRef: MatDialogRef<EditarColeccionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit(): void {
        console.log('coleccion antes de editar: ', this.data);
    }

    editarColeccion() {
        console.log('datos colección: ', this.data);

        this.restService.editarColeccion(this.data).subscribe(data => {

            console.log(data);
            /*if (data['changedRows'] === 1) {

                
            }*/
            this.dialogRef.close(true);
        }, (err) => {
            console.log(err);
        });
    }

}
