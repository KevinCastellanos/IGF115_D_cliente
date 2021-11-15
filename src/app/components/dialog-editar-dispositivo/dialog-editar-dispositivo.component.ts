import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
import { Vehiculo } from '../../interfaces/vehiculo';

@Component({
    selector: 'app-dialog-editar-dispositivo',
    templateUrl: './dialog-editar-dispositivo.component.html',
    styleUrls: ['./dialog-editar-dispositivo.component.css']
})
export class DialogEditarDispositivoComponent implements OnInit {

    public vehiculo: Vehiculo;
    public spinner = false;

    constructor(public dialogRef: MatDialogRef<DialogEditarDispositivoComponent>,
                @Inject(MAT_DIALOG_DATA) public data: Vehiculo,
                private restService: RestService) { }

    ngOnInit() {
        console.log('datos a editar:',  this.data);
        this.vehiculo = this.data;
    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    editarVehiculo() {
        this.spinner = true;
        console.log(this.vehiculo);
        this.restService.editarVehiculo(this.vehiculo).subscribe((res) => {
            this.spinner = false;
            if (res['changedRows'] === 1) {

                const ob = {
                    ok: true,
                    data: this.vehiculo
                };

                this.dialogRef.close(ob);

            } else {
                const ob = {
                    ok: false,
                    data: ''
                };
                this.dialogRef.close(ob);
            }
        }, (err) => {
            console.log(err);
        });
    }

}
