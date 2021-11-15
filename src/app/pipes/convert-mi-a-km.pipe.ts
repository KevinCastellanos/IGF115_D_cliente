import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMiAKm'
})
export class ConvertMiAKmPipe implements PipeTransform {

  transform(millas: any, ...args: any[]): any {
    return Number(Number(millas) * 1.609).toFixed(2);
  }

}
