import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../../services/rest.service';
import { Etiqueta } from '../../interfaces/etiqueta';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-editar-etiqueta',
  templateUrl: './dialog-editar-etiqueta.component.html',
  styleUrls: ['./dialog-editar-etiqueta.component.css']
})
export class DialogEditarEtiquetaComponent implements OnInit, AfterViewInit, OnDestroy {

    public eetiqueta = '';
    public enombre = '';
    public edescripcion = '';
    public evisible = 0;
    public efecha = '';
    public idEtiqueta = -1;


    // datos
    public banks = [{
        nombre: 'ninguno',
        icono: 'close',
        valor: 'op0'
    },{
        nombre: 'ignición',
        icono: 'power_settings_new',
        valor: 'op1'
    },
    {
        nombre: 'Pasajero',
        icono: 'directions_walk',
        valor: 'op2'
    },
    {
        nombre: 'Parada',
        icono: 'pan_tool',
        valor: 'op3'
    },
    {
        nombre: 'Bandera',
        icono: 'flag',
        valor: 'op4'
    },
    {
        nombre: 'Botón de asistencia',
        icono: 'volume_up',
        valor: 'op5'
    },
    {
        nombre: 'Exceso de velocidad',
        icono: 'speed',
        valor: 'op6'
    },
    {
        nombre: 'Salida de ruta',
        icono: 'alt_route',
        valor: 'op7'
    },
    {
        nombre: 'edit notifications',
        icono: 'edit_notifications',
        valor: 'op8'
    },
    {
        nombre: 'handyman',
        icono: 'handyman',
        valor: 'op9'
    },
    {
        nombre: 'miscellaneous services',
        icono: 'miscellaneous_services',
        valor: 'op10'
    },
    {
        nombre: 'local gas station',
        icono: 'local_gas_station',
        valor: 'op11'
    },
    {
        nombre: 'plumbing',
        icono: 'plumbing',
        valor: 'op12'
    },
    {
        nombre: 'car rental',
        icono: 'car_rental',
        valor: 'op13'
    },
    {
        nombre: 'edit notifications',
        icono: 'edit_notifications',
        valor: 'op14'
    },
    {
        nombre: 'ev station',
        icono: 'ev_station',
        valor: 'op15'
    },
    {
        nombre: 'campaign',
        icono: 'campaign',
        valor: 'op16'
    },
    {
        nombre: 'power off',
        icono: 'power_off',
        valor: 'op17'
    },
    {
        nombre: 'power',
        icono: 'power',
        valor: 'op18'
    },
    {
        nombre: 'phone callback',
        icono: 'phone_callback',
        valor: 'op19'
    },
    {
        nombre: 'support_agent',
        icono: 'support_agent',
        valor: 'op20'
    },
    {
        nombre: 'emoji objects',
        icono: 'emoji_objects',
        valor: 'op21'
    },
    {
        nombre: 'notifications none',
        icono: 'notifications_none',
        valor: 'op22'
    },
    {
        nombre: 'star border purple 500',
        icono: 'star_border_purple500',
        valor: 'op23'
    },
    {
        nombre: 'star purple 500',
        icono: 'star_purple500',
        valor: 'op24'
    },
    {
        nombre: 'star half',
        icono: 'star_half',
        valor: 'op25'
    },
    {
        nombre: 'meeting room',
        icono: 'meeting_room',
        valor: 'op26'
    },
    {
        nombre: 'key',
        icono: 'vpn_key',
        valor: 'op27'
    },
    {
        nombre: 'no encryption gmail errorred',
        icono: 'no_encryption_gmailerrorred',
        valor: 'op28'
    },
    {
        nombre: 'lock open',
        icono: 'lock_open',
        valor: 'op29'
    }];
    /** control for the selected bank */
    public bankCtrl: FormControl = new FormControl({value:{
        nombre: '',
        icono: '',
        valor: ''
    }});
    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    // ***********************************************************************
    public banks2: any[] = [{
        nombre: 'Default',
        icono: 'circle',
        valor: 'op1',
        color: 'black'
    },
    {
        nombre: 'Verde',
        icono: 'circle',
        valor: 'op0',
        color: 'green'
    },
    {
        nombre: 'Amarillo',
        icono: 'circle',
        valor: 'op3',
        color: 'yellow'
    },
    {
        nombre: 'Rojo',
        icono: 'circle',
        valor: 'op2',
        color: 'red'
    }, 
    {
        nombre: 'Anaranjado',
        icono: 'circle',
        valor: 'opt4',
        color: '#ff6f00'
    }];

    /** control for the selected bank */
    public bankCtrl2: FormControl = new FormControl({value:{
        nombre: '',
        icono: '',
        valor: '',
        color: ''
    }});
    /** control for the MatSelect filter keyword */
    public bankFilterCtrl2: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanks2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect2', { static: true }) singleSelect2: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy2 = new Subject<void>();

    constructor(public dialogRef: MatDialogRef<DialogEditarEtiquetaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Etiqueta,
              private restService: RestService) { 
    }

    // metodos default
    ngOnInit() {

        console.log('valores por defecto: ',this.data);

        this.eetiqueta = this.data.etiqueta;
        this.enombre = this.data.nombre;
        this.edescripcion = this.data.descripcion;
        this.idEtiqueta = this.data.id_etiqueta;

        // valores por defecto selecccionado
        this.bankCtrl.setValue({
            nombre: this.data.nombre_icono,
            icono: this.data.descripcion_icono,
            valor: 'op0'
        });

        this.matSelect();

        switch(this.data.color_icono) {
            case 'black':
                // color por defecto selecccionado
                this.bankCtrl2.setValue({
                    nombre: 'Default',
                    icono: 'circle',
                    valor: 'op1',
                    color: 'black'
                });
                break;
            case 'green':
                // color por defecto selecccionado
                this.bankCtrl2.setValue({
                    nombre: 'Verde',
                    icono: 'circle',
                    valor: 'op0',
                    color: 'green'
                });
                break;
            case 'yellow':
                // color por defecto selecccionado
                this.bankCtrl2.setValue({
                    nombre: 'Amarillo',
                    icono: 'circle',
                    valor: 'op1',
                    color: 'yellow'
                });
                break;
            case 'red':
                // color por defecto selecccionado
                this.bankCtrl2.setValue({
                    nombre: 'Rojo',
                    icono: 'circle',
                    valor: 'op2',
                    color: 'red'
                });
                break;

        }
        this.matSelect2();
    }

    ngAfterViewInit() {
        this.setInitialValue();
        this.setInitialValue2();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this._onDestroy2.next();
        this._onDestroy2.complete();
    }
    // fin metodos default

    onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
    }

    editarEtiqueta() {
        this.evisible = 1;
        const etiqueta: Etiqueta = {};

        etiqueta.etiqueta = this.eetiqueta;
        etiqueta.nombre = this.enombre;
        etiqueta.descripcion = this.edescripcion;
        etiqueta.id_etiqueta = this.idEtiqueta;

        // valores de icono de bandera
        etiqueta.icono = 0;
        etiqueta.nombre_icono = '';
        etiqueta.descripcion_icono = '';

        if (this.bankCtrl.value) {
            etiqueta.icono = 1;
            etiqueta.nombre_icono = this.bankCtrl.value.nombre;
            etiqueta.descripcion_icono = this.bankCtrl.value.icono;

            // si es la opcion: ninguno, limpiar las banderas
            if (etiqueta.nombre_icono === 'ninguno') {
                etiqueta.icono = 0;
                etiqueta.nombre_icono = '';
                etiqueta.descripcion_icono = '';
            }
        }

        if (this.bankCtrl2.value) {
            etiqueta.color_icono = this.bankCtrl2.value.color;
        }

        console.log('etiqueta para editar', etiqueta);

        
        this.restService.editarEtiqueta(etiqueta).subscribe(data => {
            console.log(data);
            // tslint:disable-next-line: no-string-literal
            if (data['changedRows'] === 1) {

                const etiqueta2: Etiqueta = {};

                etiqueta2.etiqueta = this.eetiqueta;
                etiqueta2.nombre = this.enombre;
                etiqueta2.descripcion = this.edescripcion;
                etiqueta2.id_etiqueta = this.idEtiqueta;
                etiqueta2.icono = etiqueta.icono;
                etiqueta2.nombre_icono = etiqueta.nombre_icono;
                etiqueta2.descripcion_icono = etiqueta.descripcion_icono;
                etiqueta2.color_icono = etiqueta.color_icono;
                console.log('ACTUALIZADO; ', etiqueta2);

                const ob = {
                    ok: true,
                    data: etiqueta2
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

    // mat selection
    matSelect() {
        // this.bankCtrl.setValue(this.banks[0]);
        // load the initial bank list
        this.filteredBanks.next(this.banks.slice());
    }

    protected setInitialValue() {
        this.filteredBanks.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
            this.singleSelect.compareWith = (a: any, b: any) => a && b && a.nombre === b.nombre;
        });
    }
    // fin mat selection con value inicial

    // *******************************************************************
    // mat selection
    matSelect2() {
        // this.bankCtrl.setValue(this.banks[0]);
        // load the initial bank list
        this.filteredBanks2.next(this.banks2.slice());
    }

    protected setInitialValue2() {
        this.filteredBanks2.pipe(take(1), takeUntil(this._onDestroy2)).subscribe(() => {
            this.singleSelect2.compareWith = (a: any, b: any) => a && b && a.nombre === b.nombre;
        });
    }
    // fin mat selection con value inicial

    limpiarIcono(ev) {
        console.log(ev);
        if (ev.value.valor == 'op0') {
            ev.clear();
        }
    }
}
