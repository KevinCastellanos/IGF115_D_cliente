import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cantidadReverse'
})
export class CantidadReversePipe implements PipeTransform {

  transform(cantidad: any, i: any): any {
    return Math.round(((cantidad - i) / 2));
  }

}
