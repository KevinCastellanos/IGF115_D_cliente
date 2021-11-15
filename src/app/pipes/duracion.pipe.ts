import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'duracion'
})
export class DuracionPipe implements PipeTransform {

    transform(fechaAntigua: any): any {
        const horaActual = moment().format('YYYY-MM-DD HH:mm:ss');

        // tslint:disable-next-line: max-line-length
        const ho = moment.duration(moment(horaActual, 'YYYY-MM-DD HH:mm:ss').diff(moment.utc(fechaAntigua).local().format('YYYY-MM-DD HH:mm:ss')));
        if (ho.get('years') !== 0) {
            return ho.get('years') + ' año';
        } else {
            if (ho.get('months') !== 0) {
                return ho.get('months') + ' mes';
            } else {
                if (ho.get('days') !== 0) {
                    return ho.get('days') + ' día';
                } else {
                    if (ho.get('hours') !== 0) {
                        return ho.get('hours') + ' h';
                    } else {
                        if (ho.get('minutes') !== 0) {
                            return ho.get('minutes') + ' min';
                        } else {
                            if (ho.get('seconds') !== 0) {
                                return ho.get('seconds') + ' s';
                            } else {
                                return 'un momento';
                            }
                        }
                    }
                }
            }
        }
    }

}
