import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMAKm'
})
export class ConvertMAKmPipe implements PipeTransform {

  transform(metros: any, ...args: any[]): any {
    return Number(Number(metros) / 1000).toFixed(2);
  }

}
