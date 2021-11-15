import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResumenComponent } from '../dialog-resumen/dialog-resumen.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-dialog-resumen-viaje',
  templateUrl: './dialog-resumen-viaje.component.html',
  styleUrls: ['./dialog-resumen-viaje.component.css']
})
export class DialogResumenViajeComponent implements OnInit {

    public resumen: any[] = [];

    displayedColumns: string[] = ['etiqueta', 'evento', 'cantidad'];
    dataSource = this.resumen;

  constructor(public dialogRef: MatDialogRef<DialogResumenComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public localStorageService: LocalStorageService) { }

    ngOnInit() {

        // this.conteoViaje(this.data['viajes'].length);
        // console.log(this.data);

        // copiamos el array mas no la referencia contenida en el
        let nuevoArray = this.data.rawdata.slice();

        //ordenamos el contenido
        nuevoArray.sort(function(a, b) { return Number(a.evento) - Number(b.evento); });

        let arraySinDuplicidad = [];

        try {
            // Nos aseguramos que no se presenten eventos duplicados en la app
            let sa = -1;
            let eventTime = '-1';
            
            // primero evaluamos si trae .SA 
            if (nuevoArray[0].SA !== '') {
                // si es diferente de vacío indica que este vehiculo tiene secuencia analogica
                // configurado, por lo tanto evaluamos por SA
                // Algorithmic Complexity: O(N) 
                var hash = {};
                nuevoArray = nuevoArray.filter(function(current) {
                    let go = current.SA !== undefined ? String(current.event_time) + String(current.SA) : String(current.event_time);
                    let exists = !hash[go] || false;
                    hash[go] = true;
                    return exists;
                });

                // console.log('cantidad de eventos: ', data.length);
                
                for (const info of nuevoArray) {
                    // ----------------------------------------------------------------------------------
                    /**
                     * *********** Primera condicion **************
                     * Diferente SA, Diferente hora: contar evento
                     */
                    if (Number(info.SA) !== Number(sa) && info.event_time !== eventTime) {
                        // actualizamos valores temporales
                         sa = Number(info.SA);
                        eventTime = info.event_time;
                        
                        // actualizamos e insertamos datos al array
                        arraySinDuplicidad.push(info);
                    } else {
                        // console.log('mismo SA. misma hora repetido, no se cuenta (SECUENCIAL)');
                    }
                    // ----------------------------------------------------------------------------------
                    /**
                     * *********** Segunda condicion **************
                     * mismo SA, Diferente hora: contar evento
                     */
                    if (Number(info.SA) === Number(sa) && info.event_time !== eventTime) {
                        // actualizamos valores temporales
                        sa = Number(info.SA);
                        eventTime = info.event_time;

                        // actualizamos e insertamos datos al array
                        arraySinDuplicidad.push(info);
                    }
                    // ----------------------------------------------------------------------------------
                    /**
                     * *********** Tercerca condicion **************
                     * diferente SA, misma hora: contar evento
                     */
                    if (Number(info.SA) !== Number(sa) && info.event_time === eventTime) {
                        // actualizamos valores temporales
                        sa = Number(info.SA);
                        eventTime = info.event_time;

                        // actualizamos e insertamos datos al array
                        arraySinDuplicidad.push(info);
                    }
                    // ----------------------------------------------------------------------------------                            
                }
            } 
        } catch (e) {
            console.log(e);
        }

        for (const i in arraySinDuplicidad) {

            if (this.buscarPorObjetos(this.resumen, arraySinDuplicidad[i].evento) === undefined) {
                const evento: any = {
                    etiqueta: arraySinDuplicidad[i].etiqueta,
                    evento: arraySinDuplicidad[i].evento,
                    cantidad: 1
                };
                this.resumen.push(evento);
            } else {
                this.resumen[this.buscarIndice(this.resumen, arraySinDuplicidad[i].evento)].cantidad += 1;
            }
        }
    }

    conteoViaje(cantidad) {
        return Math.round((cantidad / 2));
    }

    cambiarStatusIgn(event) {
        console.log('evento seleccionado: ', event.checked);
        this.localStorageService.guardarDetalleIgn(event.checked);
    }

    buscarPorObjetos(arr: any, query: string) {
        return arr.find( element => element.evento === query );
    }

    buscarIndice(arr: any, query: string) {
        return arr.findIndex(object => object.evento === query);
    }
}

