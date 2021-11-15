import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dialog-ver-geocercas-triggers-telegram',
  templateUrl: './dialog-ver-geocercas-triggers-telegram.component.html',
  styleUrls: ['./dialog-ver-geocercas-triggers-telegram.component.css']
})
export class DialogVerGeocercasTriggersTelegramComponent implements OnInit, AfterViewInit, OnDestroy {

    states: string[] = [];
    initialRange: ListRange = { start: 0, end: 5 } as ListRange;
    @ViewChild(CdkVirtualScrollViewport) cdkVirtualScrollViewport: CdkVirtualScrollViewport;

    public resumen: any[] = [];

    displayedColumns: string[] = ['nombre', 'id_disparador'];
    dataSource = new MatTableDataSource<any>([]);

    // select con cuadro de busqueda de dispositivo
    /** Datos de dispositivos */
    public banksGeocerca: any[] = [];
    /** control para el banco seleccionado */
    public bankCtrlGeocerca: FormControl = new FormControl();
    /** control de la palabra clave del filtro MatSelect */
    public bankFilterCtrlGeocerca: FormControl = new FormControl();
    /** lista de bancos filtrados por palabra clave de búsqueda */
    public filteredBanksGeocerca: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    /** referencia al id de la vista de dispositivo */
    @ViewChild('singleSelectGeocerca', { static: true }) singleSelectGeocerca: MatSelect;
    /** Sujeto que emite cuando el componente ha sido destruido. */
    // tslint:disable-next-line: variable-name
    protected _onDestroyGeocerca = new Subject<void>();
    // fin select con cuadro de busqueda de dispositivo
    constructor(public dialogRef: MatDialogRef<DialogVerGeocercasTriggersTelegramComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private restService: RestService,
        public localStorageService: LocalStorageService) { }

        ngOnInit() {
            this.dataSource.data = [];
            console.log(this.data);
            // tslint:disable-next-line: forin
            for (const i in this.data) {
                this.data[i].id_disparador = this.data[0].id_disparador;
                this.dataSource.data.push(this.data[i]);
            }
            this.dataSource.data = this.dataSource.data;
    
            console.log('geos');
            console.log(this.localStorageService.geocercas);
    
            this.obtenerGeocercas();
        }
    
        ngAfterViewInit() {
            this.setInitialValueGeocerca();
        }
    
        ngOnDestroy() {
            this._onDestroyGeocerca.next();
            this._onDestroyGeocerca.complete();
        }
    
        obtenerGeocercas() {
            this.banksGeocerca.push(...this.localStorageService.geocercas);
            this.matSelectGeocerca();
        }
    
        // metodo que utiliza el filtro de mat-select
        // metodo 1
        matSelectGeocerca() {
            this.filteredBanksGeocerca.next(this.banksGeocerca.slice());
    
            // listen for search field value changes
            this.bankFilterCtrlGeocerca.valueChanges.pipe(takeUntil(this._onDestroyGeocerca)).subscribe(() => {
                this.filterBanksGeocerca();
            });
        }
    
        // metodo 2
        protected setInitialValueGeocerca() {
        // ------------------------------------------------------------------------------------------------
        this.filteredBanksGeocerca.pipe(take(1), takeUntil(this._onDestroyGeocerca)).subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.singleSelectGeocerca.compareWith = (a: any, b: any) => a && b &&  a.nombre_geocerca === b.nombre_geocerca;
        });
        }
    
        // metodo 3
        protected filterBanksGeocerca() {
            // ---------------------------------------------------------------------------------
            if (!this.banksGeocerca) {
                return;
            }
            // get the search keyword
            let searchGeocerca = this.bankFilterCtrlGeocerca.value;
            if (!searchGeocerca) {
                this.filteredBanksGeocerca.next(this.banksGeocerca.slice());
                return;
            } else {
                searchGeocerca = searchGeocerca.toLowerCase();
            }
    
            if (!isNaN(searchGeocerca)) {
                console.log('es numero');
                // tslint:disable-next-line: max-line-length
                this.filteredBanksGeocerca.next(this.banksGeocerca.filter(bankGeocerca => bankGeocerca.imei.toLowerCase().indexOf(searchGeocerca) > -1));
            } else {
                console.log('no es numero');
                // tslint:disable-next-line: max-line-length
                this.filteredBanksGeocerca.next(this.banksGeocerca.filter(bankGeocerca => bankGeocerca.nombre_geocerca.toLowerCase().indexOf(searchGeocerca) > -1));
            }
        }
        // sin metodos para select filtro
    
        eliminarGeocercaTrigger(element) {
            console.log('elemento a eliminaar', element);
            this.restService.eliminarGeocercaAnotificacionTrigger(element).subscribe((res) => {
    
                // eliminamos de la tabla el elemento seleccionadpo
                const index = this.dataSource.data.findIndex( elemento => Number(elemento.id_geocerca) === Number(element.id_geocerca) );
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
    
        agregarGeocercaATrigger() {
            console.log(this.bankCtrlGeocerca.value.id_geocerca);
            console.log(this.data[0].id_disparador);
            console.log(this.bankCtrlGeocerca.value.nombre_geocerca);
            
            const ob = {
                id_disparador: this.data[0].id_disparador,
                id_geocerca: this.bankCtrlGeocerca.value.id_geocerca,
                nombre: this.bankCtrlGeocerca.value.nombre_geocerca
            };
            this.restService.agregarGeocercanotificacionTrigger(ob).subscribe((res) => {
    
                console.log(res);
                // insertamos el nuevo valor
                this.dataSource.data.push(ob);
                this.dataSource.data = this.dataSource.data;
    
    
                // limpiamos la opcion seleccionada
                this.bankCtrlGeocerca.reset();
            }, (err) => {
                console.log(err);
            });
        }
    
        scrolledIndexChange($event) {
            if (!this.initialRange) {
              this.initialRange = this.cdkVirtualScrollViewport.getRenderedRange();
            }
        
        }
        openedChange(opened) {
            if (!opened) {
              this.cdkVirtualScrollViewport.setRenderedContentOffset(0);
              this.cdkVirtualScrollViewport.setRenderedRange(this.initialRange)
            } 
        }
}
