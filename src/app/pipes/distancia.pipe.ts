import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distancia'
})
export class DistanciaPipe implements PipeTransform {

  transform(viaje: any): number {
    return viaje[0].VO - viaje[viaje.length - 1].VO;
  }

}
