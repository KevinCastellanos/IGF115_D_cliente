import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestService } from '../../services/rest.service';
import { DialogEditarTelefonosComponent } from '../dialog-editar-telefonos/dialog-editar-telefonos.component';

@Component({
  selector: 'app-dialog-editar-usuario',
  templateUrl: './dialog-editar-usuario.component.html',
  styleUrls: ['./dialog-editar-usuario.component.css']
})
export class DialogEditarUsuarioComponent implements OnInit {
    public spinner = false;
    public grupos: any[] = [];
    private grupoSeleccionado: any;
    constructor(public dialogRef: MatDialogRef<DialogEditarUsuarioComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar) { }

    ngOnInit() {
        this.getGrupo();

    }

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close({cancel: false});
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close({cancel: true});
    }

    editarUsuario() {
        console.log('data actualizado: ', this.data);
        this.spinner = true;
        // tslint:disable-next-line: max-line-length
        this.restService.editarUsuario(this.data).subscribe((res) => {
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

    getGrupo() {

        this.restService.obtenerGrupos().subscribe((data) => {
            // this.listaGrupo = data;
            // console.log(data);
            this.grupos = [];
            this.grupos.push(...data);

        }, (err) => {
            console.log(err);
        });
    }

    changeGrupo(event) {
        console.log('grupo seleccionado:', event);
        this.grupoSeleccionado = event;
        this.data.id_grupo = event;
    }

    dialogEditarTelefonos(event) {
        // console.log(event);
        // abrimos el modal
        const dialogRef = this.dialog.open(DialogEditarTelefonosComponent, {
            width: '700px',
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.cancel !== true) {
                if (result.editado === true) {
                    /*this._snackBar.open(mensaje, action, {
                        duration: 3000,
                      });/*
                } else {
                    /*this._snackBar.open(mensaje, action, {
                        duration: 3000,
                      });*/
                }
            }
        });
    }

}
