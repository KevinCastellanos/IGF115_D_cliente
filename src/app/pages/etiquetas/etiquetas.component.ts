import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Etiqueta } from '../../interfaces/etiqueta';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import * as moment from 'moment';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEtiquetaComponent } from '../../components/dialog-etiqueta/dialog-etiqueta.component';
import { DialogEditarEtiquetaComponent } from '../../components/dialog-editar-etiqueta/dialog-editar-etiqueta.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const ELEMENT_DATA: Etiqueta[] = [];

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.css']
})
export class EtiquetasComponent implements OnInit, AfterViewInit, OnDestroy {

    public etiqueta = '';
    public nombre = '';
    public descripcion = '';
    public visible = 0;
    public fecha = '';
    public fotografia = false;
    public registro = true;

    displayedColumns: string[] = [ 'etiqueta', 'nombre', 'descripcion', 'descripcion_icono', 'id_etiqueta'];
    // inicializamos la table
    dataSource = new MatTableDataSource<Etiqueta>(ELEMENT_DATA);
    // obtenemos la referencia a elemento del DOM
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    public modulos: any;

    public iconosSelect = new FormControl();
    public listaBanderas = [{
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
    

    // ------------------------------------------------------------
    public banks: any[] = [{
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
    public bankCtrl: FormControl = new FormControl({value:{
        nombre: '',
        icono: '',
        valor: '',
        color: ''
    }});
    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();
    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(private restService: RestService,
                public localStorageService: LocalStorageService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar) { }

    ngOnInit() {

        this.restService.obtenerModulos(this.localStorageService.usuario.usuario.id_usuario).subscribe((data) => {
            // console.log('modulos asignados: ');
            // console.log(data);
            this.modulos = data;
        }, (err) => {
            console.log(err);
        });
        // ingregar la data en el paginator
        this.dataSource.paginator = this.paginator;
        // obtenemos la data de etiquetas
        this.obtenerEtiquetas();
        this.fecha = moment().format('YYYY-MM-DD HH:mm:ss');

        this.bankCtrl.setValue({
            nombre: 'Default',
            icono: 'circle',
            valor: 'op1',
            color: 'black'
        });
        this.matSelect();
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    salir() {
        this.localStorageService.logoutWS();
    }

    registrarEtiqueta() {

        this.visible = 1;
        const etiqueta: Etiqueta = {};

        etiqueta.etiqueta = this.etiqueta;
        etiqueta.nombre = this.nombre;
        etiqueta.descripcion = this.descripcion;
        etiqueta.fotografia = this.fotografia;

        // valores de icono de bandera
        etiqueta.icono = 0;
        etiqueta.nombre_icono = '';
        etiqueta.descripcion_icono = '';

        if (this.iconosSelect.value) {
            etiqueta.icono = 1;
            etiqueta.nombre_icono = this.iconosSelect.value.nombre;
            etiqueta.descripcion_icono = this.iconosSelect.value.icono;
        }

        if (this.bankCtrl.value) {
            etiqueta.color_icono = this.bankCtrl.value.color;
        }

        console.log('color icono: ', this.bankCtrl);
        console.log('bandera seleccionada: ', etiqueta);
        // convertimos a hora UTC
        etiqueta.fecha = String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss'));
        
        // console.log('fecha: ', String(moment(this.fecha).utc().format('YYYY-MM-DD HH:mm:ss')));
        

        this.restService.registrarEtiqueta(etiqueta).subscribe((data) => {
            // console.log(data);
            this.visible = 0;
            // tslint:disable-next-line: no-string-literal
            if (data['affectedRows'] === 1) {

                // tslint:disable-next-line: no-string-literal
                etiqueta.id_etiqueta = data['insertId'];

                // tslint:disable-next-line: max-line-length
                this.dataSource.data.push(etiqueta);
                //
                this.dataSource.data = this.dataSource.data;
                // this.dataSource.filter = '';

                console.log('guardado exitosamente');
                this.openDialog('OK', 'Etiqueta guardado exitosamente');
                // resetamos el formulario
                this.etiqueta = '';
                this.nombre = '';
                this.descripcion = '';

                // rese4teamos el select
                this.iconosSelect.reset();

            } else {
                console.log('error al guardar datos');
                this.openDialog('Error', 'Etiqueta no guardado');
            }
        }, (err) => {
            console.log(err);
        });

    }

    obtenerEtiquetas() {

        this.restService.obtenerEtiquetas().subscribe((response) => {
        console.log(response);
        this.dataSource.data = [];  // vacias los datos
        // insertamos los datos en la tabla
        this.dataSource.data.push(...response);
        // actualizamos los datos de la tabla
        this.dataSource.data = this.dataSource.data;
        }, (error) => {
        console.log(error);
        });
    }

    converterUTCToLocalDate(event) {
        // const utcTime = '2019-10-23 16:53:52';
        return moment.utc(event).local().format('YYYY-MM-DD');
        // return event;
    }

    eliminarEtiqueta(event) {
        console.log(event);
    }

    editarEtiqueta(event) {
        console.log(event);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openDialog(title: string, body: string) {

        const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {
            title,
            body
        }
        });

        dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);
        });
    }

    dialogEliminarEtiqueta(id: string) {

        const dialogRef = this.dialog.open(DialogEtiquetaComponent, {
        maxWidth: '250px',
        data:  {
            title: 'Confirmar',
            body: '¿Desea eliminar la etiqueta?'
        }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
        console.log(dialogResult);

        if (dialogResult) {

            this.restService.eliminarEtiqueta(id).subscribe((data) => {
            console.log(data);
            this.openDialog('OK', 'Etiqueta Elimnado extisamente');
            const index = this.dataSource.data.findIndex( dato => dato.id_etiqueta === Number(id) );

            // tslint:disable-next-line: align
            if (index > -1) {
                this.dataSource.data.splice(index, 1);
                this.dataSource.data = this.dataSource.data;
                console.log('objeto eliminado');
            }

            }, (err) => {
            console.log(err);
            });
        } else {

        }
        });
    }

    dialogEditarEtiqueta(event: Etiqueta) {
          console.log(event);
        const dialogRef = this.dialog.open(DialogEditarEtiquetaComponent, {
            width: '300px',
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        // tslint:disable-next-line: no-string-literal
        if (result['ok']) {
            // tslint:disable-next-line: no-string-literal
            const index = this.dataSource.data.findIndex( dato => dato.id_etiqueta === Number(result['data']['id_etiqueta']) );

            // tslint:disable-next-line: align
            if (index > -1) {

                // tslint:disable-next-line: no-string-literal
                this.dataSource.data[index].etiqueta = result['data']['etiqueta'];
                // tslint:disable-next-line: no-string-literal
                this.dataSource.data[index].nombre = result['data']['nombre'];
                // tslint:disable-next-line: no-string-literal
                this.dataSource.data[index].descripcion = result['data']['descripcion'];
                this.dataSource.data[index].icono = result['data']['icono'];
                this.dataSource.data[index].nombre_icono = result['data']['nombre_icono'];
                this.dataSource.data[index].descripcion_icono = result['data']['descripcion_icono'];
                this.dataSource.data[index].color_icono = result['data']['color_icono'];

                this.dataSource.data = this.dataSource.data;
        
                console.log('objeto editado');

                this._snackBar.open('Etiqueta actualizado con exito', 'ok', {
                    duration: 5000,
                });
            }
        }
        });
    }

    public toggle(event: MatSlideToggleChange) {
        // console.log('toggle', event.checked);
        this.fotografia = event.checked;
    }

    habilitarRegistro() {
        this.registro = false;
    }

    banderaSelecionada() {
        console.log('cambio');
        console.log(this.iconosSelect);
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

}
