import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ElementNotification {
    id_notificacion?: number;
    imei?: string;
    cod_configuracion?: string;
    etiqueta?: string;
    correo1?: string;
    correo2?: string;
    correo3?: string;
    correo4?: string;
    correo5?: string;
    cod_evento?: string;
    notificacion?: number;
    activado?: number;
}

const ELEMENT_DATA: ElementNotification[] = [];

@Component({
  selector: 'app-dialog-editar-notificacion',
  templateUrl: './dialog-editar-notificacion.component.html',
  styleUrls: ['./dialog-editar-notificacion.component.css']
})
export class DialogEditarNotificacionComponent implements OnInit, OnDestroy {

    public spinner = false;
    public vehiculosNotificacion: any[] = [];

    // ********** tabla lista notificacion ************
    displayedColumnsNotificacion: string[] = ['select', 'nombre', 'id_notificacion'];
    dataSourceNotificacion = new MatTableDataSource<ElementNotification>(ELEMENT_DATA);
    selection = new SelectionModel<any>(true, []);
    @ViewChild('pag', {static: true}) paginatorNotificacion: MatPaginator;
    // ********** tabla lista notificacion ************

    // -------------------------------------------------------------------------------------------------------
    // seleccion multiple
    /** control for the selected bank for multi-selection */
    public bankMultiCtrlDispositivos: FormControl = new FormControl();
    /** control for the MatSelect filter keyword multi-selection */
    public bankMultiFilterCtrlDispositivos: FormControl = new FormControl();
    /** list of banks filtered by search keyword for multi-selection */
    public filteredBanksMultiDispositivos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** list of banks */
    public banksDispositivos: any[] = [];
    /** Subject that emits when the component has been destroyed. */
    private _onDestroyDispositivos = new Subject<void>();
    // -------------------------------------------------------------------------------------------------------

    public visibleNotificacion = false;

    public diaLunes = 0;
    public diaMartes = 0;
    public diaMiercoles = 0;
    public diaJueves = 0;
    public diaViernes = 0;
    public diaSabado = 0;
    public diaDomingo = 0;

    constructor(public dialogRef: MatDialogRef<DialogEditarNotificacionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService,
                private _snackBar: MatSnackBar,
                private dialog: MatDialog) { }

    ngOnInit() {

        console.log('data: ', this.data);
        this.diaLunes = this.data.lunes;
        this.diaMartes = this.data.martes;
        this.diaMiercoles = this.data.miercoles;
        this.diaJueves = this.data.jueves;
        this.diaViernes = this.data.viernes;
        this.diaSabado = this.data.sabado;
        this.diaDomingo = this.data.domingo;

        this.obtenerDispositivos();

        this.dataSourceNotificacion.paginator = this.paginatorNotificacion;

        this.dataSourceNotificacion.data = [];
        // tslint:disable-next-line: forin
        for (let i in this.data.vehiculosNotificacion) {

            if (this.data.vehiculosNotificacion[i].cod_grupo_notificacion === this.data.cod_grupo_notificacion) {
                this.dataSourceNotificacion.data.push(this.data.vehiculosNotificacion[i]);

            }
        }
        this.dataSourceNotificacion.data = this.dataSourceNotificacion.data;

        for (let i in this.dataSourceNotificacion.data) {

            if (this.dataSourceNotificacion.data[i].activado === 1) {
                console.log('tiene notificacion activado');
                this.selection.select(this.dataSourceNotificacion.data[i]);
            } else {
                console.log('no tiene notificacion activado');
            }
        }
    }

    ngOnDestroy() {

        this._onDestroyDispositivos.next();
        this._onDestroyDispositivos.complete();
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
        let c1 = 'no';
        if (this.data.correo1 !== '') {
            c1 = this.data.correo1;
        }
        let c2 = 'no';
        if (this.data.correo2 !== '') {
            c2 = this.data.correo2;
        }
        let c3 = 'no';
        if (this.data.correo3 !== '') {
            c3 = this.data.correo3;
        }
        let c4 = 'no';
        if (this.data.correo4 !== '') {
            c4 = this.data.correo4;
        }
        let c5 = 'no';
        if (this.data.correo5 !== '') {
            c5 = this.data.correo5;
        }
        const id_notificacion = this.data.id_notificacion;

        const correos = {
            correo1: c1,
            correo2: c2,
            correo3: c3,
            correo4: c4,
            correo5: c5,
            id_notificacion,
            cod_grupo_notificacion: this.data.cod_grupo_notificacion,
            lunes: this.convertBoolToNumber(this.diaLunes),
            martes: this.convertBoolToNumber(this.diaMartes),
            miercoles: this.convertBoolToNumber(this.diaMiercoles),
            jueves: this.convertBoolToNumber(this.diaJueves),
            viernes: this.convertBoolToNumber(this.diaViernes),
            sabado: this.convertBoolToNumber(this.diaSabado),
            domingo: this.convertBoolToNumber(this.diaDomingo)
        };
        
        console.log('datos correo: ', correos);

        if (this.data.cod_grupo_notificacion === '-1') {

            // Significa que solo se esta editando un vehiculo
            // tslint:disable-next-line: max-line-length
            this.restService.editaNotificacion(correos).subscribe((res) => {
                console.log('data editado', res);
                if (res['changedRows'] >= 1) {
                    this.dialogRef.close({cancel: false, editado: true});
                } else {
                    this.dialogRef.close({cancel: true, editado: false});
                }
            }, (err) => {
                console.log(err);
            });
        } else {
            this.restService.editaNotificacionMultiple(correos).subscribe((res) => {
                console.log('data editado', res);
                if (res['changedRows'] >= 1) {
                    this.dialogRef.close({cancel: false, editado: true});
                } else {
                    this.dialogRef.close({cancel: true, editado: false});
                }
            }, (err) => {
                console.log(err);
            });
        }

    }

    convertBoolToNumber(bool): number {
        if (bool == true) {
            return 1;
        }

        if (bool == false) {
            return 0;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceNotificacion.data.forEach(row => this.selection.select(row));
    }

    isAllSelected() {

        const numSelected = this.selection.selected.length;
        const numRows = this.dataSourceNotificacion.data.length;
        return numSelected === numRows;
    }

    activarDesactivarNotificacion(event, row) {
        console.log('EVENT: ', event);
        console.log('DATA ', row);
        row.vehiculosNotificacion = null;
        // console.log('user ', this.usuarioSeleccionadoVehiculo.id_usuario);

        if (event.checked === true) {
            // significa que agregó un vehiculo a un usuario
            this.restService.activarNotificacionCorreo(row).subscribe((res) => {
                console.log(res);
                this.openSnackBar('Notificacion activado con exito', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });
        } else {
            // significa que elñimino un vehiculo a un usuario
            this.restService.desactivarNotificacionCoreo(row).subscribe((res) => {
                console.log(res);
                this.openSnackBar('notificacion desactivada con exito', 'ok');
            }, (err) => {
                console.log(err);
                this.openSnackBar('No se ha podido completar la operación', 'ok');
            });

        }
    }
    /** Selects all row if they are not all selected; ohterwise clear selection. */

    openSnackBar(mensaje: any, action: string) {
        this._snackBar.open(mensaje, action, {
          duration: 3000,
        });
    }

    eliminarNotificacionPorCorreo(vehiculo: any) {
        console.log('vehiculo eliminar: ', vehiculo);
        vehiculo.vehiculosNotificacion = null;
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '400px',
            data: {body: `¿Desea eliminar el vehiculo ${vehiculo.nombre} con notificación ${vehiculo.etiqueta}?`}
        });

        dialogRef.afterClosed().subscribe(result => {
            // Verificamos que no haya cancelado la operación
            if (result.cancel === false) {
                this.restService.eliminarNotificacionPorCorreo(vehiculo).subscribe((res) => {
                    console.log('vehiculo eliminado: ', res);
                    this.openSnackBar('Notificación eliminado con exito', 'OK');

                    const index = this.dataSourceNotificacion.data.findIndex((noti) => {
                        return  noti.id_notificacion === vehiculo.id_notificacion;
                    });

                    if (index > -1) {
                        this.dataSourceNotificacion.data.splice(index, 1);
                        this.dataSourceNotificacion._updateChangeSubscription(); // <-- Refresh the datasource
                    } else {
                        console.log('no se encontro coincidencia para eliminar');
                    }
                }, (err) => {
                    console.log(err);
                    this.openSnackBar('No se ha podido completar la operación', 'ok');
                });
            } else {
                console.log(' se ha cancelado eliminacion');
            }
        });

    }

    obtenerDispositivos() {
        this.restService.obtenerImeis().subscribe((response) => {

            // inicializamos los valores de tiltro de lista de colecciones --------------------------------------------------
            this.banksDispositivos.push(...response);
            /** Logica para armar lista de seleccion multiple */
            this.filteredBanksMultiDispositivos.next(this.banksDispositivos.slice());
            this.bankMultiFilterCtrlDispositivos.valueChanges.pipe(takeUntil(this._onDestroyDispositivos)).subscribe(() => {
                this.filterBanksMultiColecciones();
            });
            // tslint:disable-next-line: jsdoc-format
            /** Fin Logica para armar lista de seleccion multiple ---------------------------------------------------------*/
        }, (error) => {
            console.log(error);
        });
    }

    /********************************************** select multiple *************************************/
    private filterBanksMultiColecciones() {
        if (!this.banksDispositivos) {
            return;
        }
        // get the search keyword
        let search = this.bankMultiFilterCtrlDispositivos.value;
        if (!search) {
            this.filteredBanksMultiDispositivos.next(this.banksDispositivos.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksMultiDispositivos.next(
            this.banksDispositivos.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1)
        );
    }
    /******************************************** fin select multiple ***********************************/

    crearNotificacionPorCorreo() {
        this.visibleNotificacion = true;
        console.log(this.bankMultiCtrlDispositivos.value);
        let c1 = 'no';
        if (this.data.correo1 !== '') {
            c1 = this.data.correo1;
        }
        let c2 = 'no';
        if (this.data.correo2 !== '') {
            c2 = this.data.correo2;
        }
        let c3 = 'no';
        if (this.data.correo3 !== '') {
            c3 = this.data.correo3;
        }
        let c4 = 'no';
        if (this.data.correo4 !== '') {
            c4 = this.data.correo4;
        }
        let c5 = 'no';
        if (this.data.correo5 !== '') {
            c5 = this.data.correo5;
        }

        const noti = {
            imeis: this.bankMultiCtrlDispositivos.value,
            cod_configuracion: this.bankMultiCtrlDispositivos.value[0].cod_configuracion,
            etiqueta: this.data.etiqueta,
            cod_evento: this.data.cod_evento,
            correo1: c1,
            correo2: c2,
            correo3: c3,
            correo4: c4,
            correo5: c5,
            activado: 1,
            cod_grupo_notificacion: this.data.cod_grupo_notificacion
        };
        console.log('valores de la notificacion: ', noti);
        this.restService.crearNotificacionPorCorreo(noti).subscribe((res) => {
            this.visibleNotificacion = false;
            console.log(res);
            this.openSnackBar('Notificacion agregado con exito', 'ok');
        }, (err) => {
            console.log(err);
        });
    }
}
