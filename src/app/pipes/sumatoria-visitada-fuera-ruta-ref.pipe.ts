import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumatoriaVisitadaFueraRutaRef'
})
export class SumatoriaVisitadaFueraRutaRefPipe implements PipeTransform {

    transform(paradasFueraRutaRef: any[], dia: number): any {
        let sum = 0;
        // console.log('ITERAR FUERA RUTA REF: ', paradasFueraRutaRef);
        if (paradasFueraRutaRef) {
            for (const j of paradasFueraRutaRef) {
                if (dia === -1) {
                    sum += 1;
                } else {
                    if (j.dia === dia) {
                        sum += 1;
                    }
                }
            }
        }
        return sum;
    }

}
