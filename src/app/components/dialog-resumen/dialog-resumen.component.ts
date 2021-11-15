import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/services/local-storage.service';

export interface DialogResumen {
  title: string;
  body: any;
}

export interface ResumenEventos {
  etiqueta?: string;
  evento?: string;
  cantidad?: number;
}

@Component({
  selector: 'app-dialog-resumen',
  templateUrl: './dialog-resumen.component.html',
  styleUrls: ['./dialog-resumen.component.css']
})
export class DialogResumenComponent implements OnInit {

  public resumen: ResumenEventos[] = [];

  displayedColumns: string[] = ['etiqueta', 'evento', 'cantidad'];
  dataSource = this.resumen;

  public velMaxima = 0;
  public velPromedio = 0;
  public totDistancia = 0;

  constructor(public dialogRef: MatDialogRef<DialogResumenComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogResumen,
              public localStorageService: LocalStorageService,) { }

  ngOnInit() {
    console.log('------------data modal -------------');
    console.log(this.data);
    
    // copiamos el array mas no la referencia contenida en el
    const nuevoArray = this.data.body.slice();

    // console.log('tam: ', nuevoArray.length - 1);
    const ult = nuevoArray.length - 1;
    /*console.log('VO 2: ', nuevoArray[ult].VO);
    console.log('VO 1: ', nuevoArray[0].VO);*/
    this.totDistancia =    nuevoArray[0].VO - nuevoArray[ult].VO;
    
    nuevoArray.sort(function(a, b) { return Number(a.evento) - Number(b.evento); });
    // tslint:disable-next-line: forin
    for (const i in nuevoArray) {

      // buscamos la velocidad maxima
      if (nuevoArray[i].vel > this.velMaxima) {
        this.velMaxima = nuevoArray[i].vel;
      }

      // velocidad promedio
      this.velPromedio = nuevoArray[i].vel;

      if (this.buscarPorObjetos(this.resumen, nuevoArray[i].evento) === undefined) {
        const evento: ResumenEventos = {
          etiqueta: nuevoArray[i].etiqueta,
          evento: nuevoArray[i].evento,
          cantidad: 1
        };

        this.resumen.push(evento);

      } else {

        this.resumen[this.buscarIndice(this.resumen, nuevoArray[i].evento)].cantidad += 1;
      }
    }

    this.velPromedio = (this.velPromedio / nuevoArray.length);
    

    
  }

  filterItems(arr: any, query: string) {
  return arr.filter(function(el: any) {
      return el.indexOf(query) > -1;
  });
  }

  buscarPorObjetos(arr: any, query: string) {
    return arr.find( element => element.evento === query );
  }

  buscarIndice(arr: any, query: string) {
    return arr.findIndex(object => object.evento === query);
  }

}
