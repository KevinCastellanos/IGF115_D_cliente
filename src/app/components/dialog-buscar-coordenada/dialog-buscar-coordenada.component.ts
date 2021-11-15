import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-buscar-coordenada',
  templateUrl: './dialog-buscar-coordenada.component.html',
  styleUrls: ['./dialog-buscar-coordenada.component.css']
})
export class DialogBuscarCoordenadaComponent implements OnInit {

    public coordenada: string;

    constructor(public dialogRef: MatDialogRef<DialogBuscarCoordenadaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

    buscarCoordenadas(): void {
        // console.log('coordenadas a buscar: ', this.coordenada.split(','));
        // Close the dialog, return true
        this.dialogRef.close({cancel: false, coors: this.coordenada.split(',')});
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }
}
