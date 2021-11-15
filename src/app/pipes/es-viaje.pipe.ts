import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'esViaje'
})
export class EsViajePipe implements PipeTransform {

  transform(viaje: any): any {
    return viaje[0].VO - viaje[viaje.length - 1].VO;
  }

}
