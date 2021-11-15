import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';

@Component({
    selector: 'app-dialog-editar-grupo',
    templateUrl: './dialog-editar-grupo.component.html',
    styleUrls: ['./dialog-editar-grupo.component.css']
})
export class DialogEditarGrupoComponent implements OnInit {

    public spinner = false;
    constructor(public dialogRef: MatDialogRef<DialogEditarGrupoComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit() {

    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close({cancel: false});
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    editarGrupo() {
        this.spinner = true;
        // tslint:disable-next-line: max-line-length
        this.restService.editarGrupo(this.data.nombre_grupo, this.data.nombre_compania, this.data.direccion_1, this.data.id_grupo).subscribe((res) => {
            console.log('data editado', res);
            if (res['changedRows'] === 1) {
                this.dialogRef.close({cancel: false, editado: true});
            } else {
                this.dialogRef.close({cancel: true, editado: false});
            }
        }, (err) => {
            console.log(err);
        });
    }

}
