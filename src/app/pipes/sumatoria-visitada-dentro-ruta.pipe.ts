import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumatoriaVisitadaDentroRuta'
})
export class SumatoriaVisitadaDentroRutaPipe implements PipeTransform {

    transform(paradasDentroRuta: any[], dia: number): any {
        let sum = 0;
        if (paradasDentroRuta !== undefined || paradasDentroRuta !== null) {
            for (const j of paradasDentroRuta) {
                if (j.dia === dia) {
                    sum += 1;
                }
            }
        }
        return sum;
    }

}
