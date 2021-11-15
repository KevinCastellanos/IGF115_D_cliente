import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'convertAmPm'
})
export class ConvertAmPmPipe implements PipeTransform {

  transform(event_time: any): any {
    // primero convertimos a hora UTC
    const horaUtc = moment.utc(event_time).local().format('HH:mm:ss');
    // convertimos a hora local
    return moment(horaUtc, 'hh:mm:ss').format('LTS');
  }

}
