import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'diferenciaHora'
})
export class DiferenciaHoraPipe implements PipeTransform {

  transform(viaje: any): any {
    const now =  viaje[0].event_time;
    const then = viaje[viaje.length - 1].event_time;
    return moment.utc(moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'))).format('HH:mm:ss');
  }

}
