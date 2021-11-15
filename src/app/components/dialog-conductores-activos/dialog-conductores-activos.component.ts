import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-dialog-conductores-activos',
  templateUrl: './dialog-conductores-activos.component.html',
  styleUrls: ['./dialog-conductores-activos.component.css']
})
export class DialogConductoresActivosComponent implements OnInit {
    public conductores: any[] = [];
    constructor(public dialogRef: MatDialogRef<DialogConductoresActivosComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private localStorageService: LocalStorageService) { }

    ngOnInit() {
        console.log(this.data.idsConductores);
        this.restService.obtenerConductores(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            let i;
            for (i = 0; i < this.data.idsConductores.length; i++) {
                const c = data.find((dato) => dato.id_conductor === this.data.idsConductores[i]);
                if (c) {
                    this.conductores.push(c);
                }
            }
            // console.log(data);
            // this.conductores = data;
        }, (err) => {
            console.log(err);
        });
    }

}
