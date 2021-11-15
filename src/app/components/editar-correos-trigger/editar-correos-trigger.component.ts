import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-editar-correos-trigger',
  templateUrl: './editar-correos-trigger.component.html',
  styleUrls: ['./editar-correos-trigger.component.css']
})
export class EditarCorreosTriggerComponent implements OnInit {

    public spinner = false;

    public diaLunes = 0;
    public diaMartes = 0;
    public diaMiercoles = 0;
    public diaJueves = 0;
    public diaViernes = 0;
    public diaSabado = 0;
    public diaDomingo = 0;

    constructor(public dialogRef: MatDialogRef<EditarCorreosTriggerComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit(): void {
        console.log('editar correos');
        console.log(this.data);
        this.diaLunes = this.data.lunes;
        this.diaMartes = this.data.martes;
        this.diaMiercoles = this.data.miercoles;
        this.diaJueves = this.data.jueves;
        this.diaViernes = this.data.viernes;
        this.diaSabado = this.data.sabado;
        this.diaDomingo = this.data.domingo
    }

    editarCorreosTrigger() {
        this.spinner = true;
        
        this.data.lunes = this.convertBoolToNumber(this.diaLunes);
        this.data.martes = this.convertBoolToNumber(this.diaMartes);
        this.data.miercoles = this.convertBoolToNumber(this.diaMiercoles);
        this.data.jueves = this.convertBoolToNumber(this.diaJueves);
        this.data.viernes = this.convertBoolToNumber(this.diaViernes);
        this.data.sabado = this.convertBoolToNumber(this.diaSabado);
        this.data.domingo = this.convertBoolToNumber(this.diaDomingo);

        console.log('correos editados: ', this.data);
        
        this.restService.actualizarCorreoTrigger(this.data).subscribe((data)=> {
            this.spinner = false;
            console.log(data);
            this.onDismiss();
        }, (err) => {
            console.log(err);
        });
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
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
