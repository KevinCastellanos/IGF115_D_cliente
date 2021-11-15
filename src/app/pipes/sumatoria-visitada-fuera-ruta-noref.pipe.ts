import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'sumatoriaVisitadaFueraRutaNoref'
})
export class SumatoriaVisitadaFueraRutaNorefPipe implements PipeTransform {

    transform(paradasFueraRutaNoRef: any[], dia: number): any {
        let sum = 0;
        if (paradasFueraRutaNoRef !== undefined || paradasFueraRutaNoRef !== null) {
            for (const j of paradasFueraRutaNoRef) {

                if (dia === -1) {
                    sum += 1;
                } else {
                    const date1 = moment(j.event_time);
                    const dow1 = date1.day();
                    if (dow1 === dia) {
                        sum += 1;
                    }
                }
            }
        }

        return sum;
    }

}
