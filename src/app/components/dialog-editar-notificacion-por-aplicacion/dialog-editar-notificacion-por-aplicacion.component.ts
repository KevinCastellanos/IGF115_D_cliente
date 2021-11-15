import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dialog-editar-notificacion-por-aplicacion',
  templateUrl: './dialog-editar-notificacion-por-aplicacion.component.html',
  styleUrls: ['./dialog-editar-notificacion-por-aplicacion.component.css']
})
export class DialogEditarNotificacionPorAplicacionComponent implements OnInit {

    public spinner = false;
    public diaLunes = 0;
    public diaMartes = 0;
    public diaMiercoles = 0;
    public diaJueves = 0;
    public diaViernes = 0;
    public diaSabado = 0;
    public diaDomingo = 0;

    constructor(public dialogRef: MatDialogRef<DialogEditarNotificacionPorAplicacionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,) { }

    ngOnInit(): void {
        this.diaLunes = this.data.lunes;
        this.diaMartes = this.data.martes;
        this.diaMiercoles = this.data.miercoles;
        this.diaJueves = this.data.jueves;
        this.diaViernes = this.data.viernes;
        this.diaSabado = this.data.sabado;
        this.diaDomingo = this.data.domingo;

    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close({cancel: false});
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    editarNotificacion() {
        this.spinner = true;

        const semana = {
            id_notificacion_endpoint: this.data.id_notificacion_endpoint,
            lunes: this.convertBoolToNumber(this.diaLunes),
            martes: this.convertBoolToNumber(this.diaMartes),
            miercoles: this.convertBoolToNumber(this.diaMiercoles),
            jueves: this.convertBoolToNumber(this.diaJueves),
            viernes: this.convertBoolToNumber(this.diaViernes),
            sabado: this.convertBoolToNumber(this.diaSabado),
            domingo: this.convertBoolToNumber(this.diaDomingo)
        };
        
        this.restService.actualizarNotificacionPorAplicacion(semana).subscribe((data) => {
            if (data['changedRows'] >= 1) {
                this.dialogRef.close({cancel: false, editado: true});
            } else {
                this.dialogRef.close({cancel: true, editado: false});
            }
        }, (err) => {
            console.log(err);
        });

    }

    convertBoolToNumber(bool): number {
        if (bool == true) {
            return 1;
        }

        if (bool == false) {
            return 0;
        }
    }

}
