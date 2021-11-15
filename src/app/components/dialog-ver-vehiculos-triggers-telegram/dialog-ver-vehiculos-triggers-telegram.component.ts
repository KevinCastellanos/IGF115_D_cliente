import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dialog-ver-vehiculos-triggers-telegram',
  templateUrl: './dialog-ver-vehiculos-triggers-telegram.component.html',
  styleUrls: ['./dialog-ver-vehiculos-triggers-telegram.component.css']
})
export class DialogVerVehiculosTriggersTelegramComponent implements OnInit, AfterViewInit, OnDestroy {

    public resumen: any[] = [];

    displayedColumns: string[] = ['nombre', 'id_disparador'];
    dataSource = new MatTableDataSource<any>([]);

    // select con cuadro de busqueda de dispositivo
    /** Datos de dispositivos */
    public banksDispositivo: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlDispositivo: FormControl = new FormControl();
    /** control de la palabra clave del filtro MatSelect */
    public bankFilterCtrlDispositivo: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksDispositivo: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** referencia al id de la vista de dispositivo */
    @ViewChild('singleSelectDispositivo', { static: true }) singleSelectDispositivo: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyDispositivo = new Subject<void>();
    // fin select con cuadro de busqueda de dispositivo

    constructor(public dialogRef: MatDialogRef<DialogVerVehiculosTriggersTelegramComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestService) { }

    ngOnInit() {
        this.dataSource.data = [];
        console.log(this.data);
        // tslint:disable-next-line: forin
        for (const i in this.data) {
            this.data[i].id_disparador = this.data[0].id_disparador;
            this.dataSource.data.push(this.data[i]);
        }
        this.dataSource.data = this.dataSource.data;
        this.obtenerDispositivos();
    }

    ngAfterViewInit() {
        this.setInitialValueDispositivo();
    }

    ngOnDestroy() {
        this._onDestroyDispositivo.next();
        this._onDestroyDispositivo.complete();
    }

    obtenerDispositivos() {
        this.restService.obtenerImeis().subscribe((response) => {

            console.log('dispositivos', response);
            this.banksDispositivo.push(...response);
            this.matSelectDispositivo();

        }, (error) => { 
            console.log(error);
        });
    }

    // metodo que utiliza el filtro de mat-select
    // metodo 1
    matSelectDispositivo() {
        this.filteredBanksDispositivo.next(this.banksDispositivo.slice());

        // listen for search field value changes
        this.bankFilterCtrlDispositivo.valueChanges.pipe(takeUntil(this._onDestroyDispositivo)).subscribe(() => {
            this.filterBanksDispositivo();
        });
    }

    // metodo 2
    protected setInitialValueDispositivo() {
    // ------------------------------------------------------------------------------------------------
    this.filteredBanksDispositivo.pipe(take(1), takeUntil(this._onDestroyDispositivo)).subscribe(() => {
    // setting the compareWith property to a comparison function
    // triggers initializing the selection according to the initial value of
    // the form control (i.e. _initializeSelection())
    // this needs to be done after the filteredBanks are loaded initially
    // and after the mat-option elements are available
    this.singleSelectDispositivo.compareWith = (a: any, b: any) => a && b &&  a.nombre === b.nombre;
    });
    }

    // metodo 3
    protected filterBanksDispositivo() {
        // ---------------------------------------------------------------------------------
        if (!this.banksDispositivo) {
            return;
        }
        // get the search keyword
        let searchDispositivo = this.bankFilterCtrlDispositivo.value;
        if (!searchDispositivo) {
            this.filteredBanksDispositivo.next(this.banksDispositivo.slice());
            return;
        } else {
            searchDispositivo = searchDispositivo.toLowerCase();
        }

        if (!isNaN(searchDispositivo)) {
            console.log('es numero');
            // tslint:disable-next-line: max-line-length
            this.filteredBanksDispositivo.next(this.banksDispositivo.filter(bankDispositivo => bankDispositivo.imei.toLowerCase().indexOf(searchDispositivo) > -1));
        } else {
            console.log('no es numero');
            // tslint:disable-next-line: max-line-length
            this.filteredBanksDispositivo.next(this.banksDispositivo.filter(bankDispositivo => bankDispositivo.nombre.toLowerCase().indexOf(searchDispositivo) > -1));
        }
    }
    // sin metodos para select filtro


    agregarVehiculoATrigger() {
        // console.log(this.bankCtrlDispositivo.value.id_dispositivo);
        // console.log(this.bankCtrlDispositivo.value.nombre);
        // console.log(this.bankCtrlDispositivo.value.imei);
        // console.log(this.data[0].id_disparador);

        const ob = {
            id_disparador: this.data[0].id_disparador,
            id_dispositivo: this.bankCtrlDispositivo.value.id_dispositivo,
            imei: this.bankCtrlDispositivo.value.imei,
            nombre: this.bankCtrlDispositivo.value.nombre
        };
        this.restService.agregarVehiculoAnotificacionTrigger(ob).subscribe((res) => {

            console.log(res);
            // insertamos el nuevo valor
            this.dataSource.data.push(ob);
            this.dataSource.data = this.dataSource.data;


            // limpiamos la opcion seleccionada
            this.bankCtrlDispositivo.reset();
        }, (err) => {
            console.log(err);
        });
    }

    eliminarVehiculoTrigger(element) {
        console.log('elemento a eliminaar', element);

        this.restService.eliminarVehiculoAnotificacionTrigger(element).subscribe((res) => {

            // eliminamos de la tabla el elemento seleccionadpo
            const index = this.dataSource.data.findIndex( elemento => Number(elemento.imei) === Number(element.imei) );
            // tslint:disable-next-line: align
            if (index > -1) {
                this.dataSource.data.splice(index, 1);
                this.dataSource.data = this.dataSource.data;
                console.log('objeto eliminado');
            }
        }, (err) => {
            console.log(err);
        });
    }

}
